<?php

namespace App\Http\Controllers;

use App\Models\ArchivoAudio;
use App\Models\CategoriaPodcast;
use App\Models\Episodio;
use App\Models\HistorialPodcast;
use App\Models\Podcast;
use App\Models\ReproduccionPodcast;
use App\Support\RabbitMqPublisher;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class PodcastsController extends Controller
{
    private function jsonOk(mixed $data = [], string $message = 'OK', int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    private function jsonError(string $message, int $status = 400, mixed $errors = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }

    private function base64UrlDecode(string $value): string|false
    {
        $remainder = strlen($value) % 4;

        if ($remainder) {
            $value .= str_repeat('=', 4 - $remainder);
        }

        return base64_decode(strtr($value, '-_', '+/'));
    }

    private function decodeAccessToken(?string $token): ?array
    {
        if (!$token) {
            return null;
        }

        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            return null;
        }

        [$header64, $payload64, $signature64] = $parts;
        $secret = env('JWT_ACCESS_SECRET', 'rootblend-access-secret');

        $expected = rtrim(
            strtr(
                base64_encode(hash_hmac('sha256', $header64 . '.' . $payload64, $secret, true)),
                '+/',
                '-_'
            ),
            '='
        );

        if (!hash_equals($expected, $signature64)) {
            return null;
        }

        $payloadJson = $this->base64UrlDecode($payload64);
        $payload = json_decode($payloadJson ?: '', true);

        if (!is_array($payload)) {
            return null;
        }

        if (($payload['type'] ?? '') !== 'access') {
            return null;
        }

        if (isset($payload['exp']) && (int) $payload['exp'] < time()) {
            return null;
        }

        return $payload;
    }

    private function currentUserPayload(Request $request): array|JsonResponse
    {
        $header = $request->header('Authorization', '');
        $token = str_starts_with($header, 'Bearer ') ? trim(substr($header, 7)) : '';
        $payload = $this->decodeAccessToken($token);

        if (!$payload || empty($payload['sub'])) {
            return $this->jsonError('No autenticado.', 401);
        }

        return $payload;
    }

    private function optionalUserId(Request $request): ?int
    {
        $header = $request->header('Authorization', '');
        $token = str_starts_with($header, 'Bearer ') ? trim(substr($header, 7)) : '';
        $payload = $this->decodeAccessToken($token);

        return $payload && !empty($payload['sub']) ? (int) $payload['sub'] : null;
    }

    private function normalizedPodcastStatus(?string $status): string
    {
        return match ($status) {
            'published', 'publicado', 'activo' => 'activo',
            'draft', 'borrador', 'inactivo' => 'inactivo',
            default => 'activo',
        };
    }

    private function normalizedEpisodeStatus(?string $status): string
    {
        return match ($status) {
            'published', 'publicado' => 'publicado',
            'draft', 'borrador' => 'borrador',
            'deleted', 'eliminado' => 'eliminado',
            default => 'publicado',
        };
    }

    private function statusForFrontend(string $status): string
    {
        return match ($status) {
            'activo', 'publicado' => 'published',
            'inactivo', 'borrador' => 'draft',
            'eliminado' => 'deleted',
            default => $status,
        };
    }

    private function gatewayUrl(): string
    {
        return rtrim((string) (config('app.url') ?: env('APP_URL', 'http://localhost:8080')), '/');
    }

    private function canalesServiceUrl(): string
    {
        return rtrim((string) env('CANALES_SERVICE_URL', 'http://canales-streaming-service:8001/api/canales'), '/');
    }

    private function fetchChannelById(int $idCanal): ?array
    {
        $url = $this->canalesServiceUrl() . '/' . $idCanal . '/';
        $context = stream_context_create([
            'http' => [
                'method' => 'GET',
                'timeout' => 3,
                'header' => "Accept: application/json\r\n",
            ],
        ]);

        $response = @file_get_contents($url, false, $context);

        if ($response === false) {
            return null;
        }

        $decoded = json_decode($response, true);

        if (!is_array($decoded) || empty($decoded['success']) || !is_array($decoded['data'] ?? null)) {
            return null;
        }

        return $decoded['data'];
    }

    private function validatePodcastChannelOwnership(int $idCanal, int $idUsuario): ?JsonResponse
    {
        $required = filter_var(env('PODCAST_CHANNEL_OWNERSHIP_REQUIRED', true), FILTER_VALIDATE_BOOL);
        $channel = $this->fetchChannelById($idCanal);

        if (!$channel) {
            return $required
                ? $this->jsonError('No se pudo verificar el canal del podcast.', 503)
                : null;
        }

        $ownerId = (int) ($channel['id_usuario_propietario'] ?? 0);
        $channelState = (string) ($channel['estado_canal'] ?? '');
        $tipoCanal = $channel['tipo_canal'] ?? '';
        $channelType = is_array($tipoCanal)
            ? (string) ($tipoCanal['nombre_tipo'] ?? '')
            : (string) $tipoCanal;

        if ($ownerId !== $idUsuario) {
            return $this->jsonError('No puedes crear podcasts en un canal que no te pertenece.', 403);
        }

        if ($channelState !== 'activo') {
            return $this->jsonError('El canal no esta activo.', 403);
        }

        if ($channelType !== 'podcaster') {
            return $this->jsonError('Solo los canales de tipo podcaster pueden crear podcasts.', 403);
        }

        return null;
    }

    private function storagePublicUrl(string $path): string
    {
        return $this->gatewayUrl() . '/podcasts-storage/' . ltrim($path, '/');
    }

    private function isYoutubeUrl(string $url): bool
    {
        return (bool) preg_match('/(youtube\.com|youtu\.be)/i', $url);
    }

    private function youtubeIdFromUrl(string $url): ?string
    {
        $patterns = [
            '/youtu\.be\/([A-Za-z0-9_-]{6,})/i',
            '/youtube\.com\/watch\?.*v=([A-Za-z0-9_-]{6,})/i',
            '/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/i',
            '/youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/i',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $url, $matches)) {
                return $matches[1];
            }
        }

        return null;
    }

    private function youtubeEmbedUrl(?string $youtubeId): ?string
    {
        return $youtubeId ? 'https://www.youtube.com/embed/' . $youtubeId : null;
    }

    private function formatCategory(CategoriaPodcast $category): array
    {
        return [
            'id_categoria_podcast' => $category->id_categoria_podcast,
            'id' => (string) $category->id_categoria_podcast,
            'nombre' => $category->nombre,
            'name' => $category->nombre,
            'descripcion' => $category->descripcion,
            'description' => $category->descripcion,
        ];
    }

    private function formatPodcast(Podcast $podcast, bool $includeEpisodes = false): array
    {
        $episodeQuery = Episodio::where('id_podcast', $podcast->id_podcast)
            ->where('estado', '!=', 'eliminado');

        $publishedEpisodeQuery = (clone $episodeQuery)->where('estado', 'publicado');
        $plays = ReproduccionPodcast::where('id_podcast', $podcast->id_podcast)->count();
        $latestEpisode = (clone $publishedEpisodeQuery)
            ->orderByDesc('fecha_publicacion')
            ->first();

        $data = [
            'id_podcast' => $podcast->id_podcast,
            'id' => (string) $podcast->id_podcast,
            'id_canal' => $podcast->id_canal,
            'id_usuario_propietario' => $podcast->id_usuario_propietario,
            'id_categoria_podcast' => $podcast->id_categoria_podcast,
            'nombre' => $podcast->nombre,
            'title' => $podcast->nombre,
            'descripcion' => $podcast->descripcion,
            'description' => $podcast->descripcion,
            'imagen_portada' => $podcast->imagen_portada,
            'cover' => $podcast->imagen_portada,
            'tipo_portada' => $podcast->tipo_portada ?? null,
            'coverType' => $podcast->tipo_portada ?? null,
            'fecha_creacion' => optional($podcast->fecha_creacion)->toISOString(),
            'createdAt' => optional($podcast->fecha_creacion)->toDateString(),
            'estado' => $podcast->estado,
            'status' => $this->statusForFrontend($podcast->estado),
            'category' => $podcast->categoria?->nombre,
            'categoria' => $podcast->categoria ? $this->formatCategory($podcast->categoria) : null,
            'episodes' => $episodeQuery->count(),
            'publishedEpisodes' => $publishedEpisodeQuery->count(),
            'latestEpisode' => $latestEpisode?->titulo,
            'plays' => $plays,
        ];

        if ($includeEpisodes) {
            $data['episodeList'] = Episodio::with('archivoAudio')
                ->where('id_podcast', $podcast->id_podcast)
                ->where('estado', 'publicado')
                ->orderByDesc('fecha_publicacion')
                ->get()
                ->map(fn (Episodio $episode) => $this->formatEpisode($episode))
                ->values();
        }

        return $data;
    }

    private function formatEpisode(Episodio $episode): array
    {
        $episode->loadMissing('podcast.categoria', 'archivoAudio');
        $plays = ReproduccionPodcast::where('id_episodio', $episode->id_episodio)->count();
        $audio = null;

        if ($episode->archivoAudio) {
            $audio = [
                'id_archivo_audio' => $episode->archivoAudio->id_archivo_audio,
                'nombre_archivo' => $episode->archivoAudio->nombre_archivo,
                'url_archivo' => $episode->archivoAudio->url_archivo,
                'url' => $episode->archivoAudio->url_archivo,
                'formato' => $episode->archivoAudio->formato,
                'tamano_mb' => $episode->archivoAudio->tamano_mb,
                'tipo_origen' => $episode->archivoAudio->tipo_origen ?? 'url',
                'sourceType' => $episode->archivoAudio->tipo_origen ?? 'url',
                'youtube_id' => $episode->archivoAudio->youtube_id ?? null,
                'youtubeId' => $episode->archivoAudio->youtube_id ?? null,
                'embed_url' => $episode->archivoAudio->embed_url ?? null,
                'embedUrl' => $episode->archivoAudio->embed_url ?? null,
                'is_youtube' => ($episode->archivoAudio->tipo_origen ?? '') === 'youtube',
                'isYoutube' => ($episode->archivoAudio->tipo_origen ?? '') === 'youtube',
            ];
        }

        return [
            'id_episodio' => $episode->id_episodio,
            'id' => (string) $episode->id_episodio,
            'id_podcast' => $episode->id_podcast,
            'podcastId' => (string) $episode->id_podcast,
            'podcastTitle' => $episode->podcast?->nombre,
            'titulo' => $episode->titulo,
            'title' => $episode->titulo,
            'descripcion' => $episode->descripcion,
            'description' => $episode->descripcion,
            'fecha_publicacion' => optional($episode->fecha_publicacion)->toISOString(),
            'publishedAt' => optional($episode->fecha_publicacion)->toDateString(),
            'duracion' => $episode->duracion,
            'duration' => $episode->duracion ?: '00:00:00',
            'estado' => $episode->estado,
            'status' => $this->statusForFrontend($episode->estado),
            'numero_episodio' => $episode->numero_episodio,
            'episodeNumber' => $episode->numero_episodio,
            'plays' => $plays,
            'audio' => $audio,
        ];
    }

    private function formatHistory(HistorialPodcast $history): array
    {
        $history->loadMissing('podcast');

        return [
            'id_historial' => $history->id_historial,
            'id' => (string) $history->id_historial,
            'id_podcast' => $history->id_podcast,
            'podcastTitle' => $history->podcast?->nombre,
            'fecha_registro' => optional($history->fecha_registro)->toISOString(),
            'date' => optional($history->fecha_registro)->toDateString(),
            'accion' => $history->accion,
            'action' => $history->accion,
            'detalle' => $history->detalle,
            'detail' => $history->detalle,
        ];
    }

    private function recordHistory(int $idPodcast, string $action, string $detail): void
    {
        HistorialPodcast::create([
            'id_podcast' => $idPodcast,
            'fecha_registro' => Carbon::now(),
            'accion' => $action,
            'detalle' => $detail,
        ]);
    }

    private function assertPodcastOwner(Podcast $podcast, int $idUsuario): ?JsonResponse
    {
        if ((int) $podcast->id_usuario_propietario !== $idUsuario) {
            return $this->jsonError('No tienes permiso para administrar este podcast.', 403);
        }

        return null;
    }

    private function saveCoverFromRequest(Request $request, array $validated, ?string $currentCover = null): array
    {
        $uploadedFile = $request->file('portada') ?: $request->file('cover') ?: $request->file('cover_file');
        $url = trim((string) ($validated['imagen_portada'] ?? $request->input('cover_url', '')));

        if ($uploadedFile) {
            $path = $uploadedFile->store('podcast-covers', 'public');
            return [
                'imagen_portada' => $this->storagePublicUrl($path),
                'tipo_portada' => 'archivo',
            ];
        }

        if ($url !== '') {
            return [
                'imagen_portada' => $url,
                'tipo_portada' => 'url',
            ];
        }

        return [
            'imagen_portada' => $currentCover,
            'tipo_portada' => $currentCover ? 'url' : null,
        ];
    }

    private function saveAudioFromRequest(Request $request, Episodio $episode): ?ArchivoAudio
    {
        $uploadedFile = $request->file('audio') ?: $request->file('audio_file');
        $youtubeUrl = trim((string) $request->input('youtube_url', $request->input('youtubeUrl', '')));
        $urlArchivo = trim((string) $request->input('url_archivo', $request->input('audio_url', '')));

        if ($youtubeUrl === '' && $urlArchivo !== '' && $this->isYoutubeUrl($urlArchivo)) {
            $youtubeUrl = $urlArchivo;
        }

        if ($uploadedFile) {
            $path = $uploadedFile->store('podcast-audio', 'public');
            $data = [
                'tipo_origen' => 'archivo',
                'nombre_archivo' => $uploadedFile->getClientOriginalName(),
                'url_archivo' => $this->storagePublicUrl($path),
                'youtube_id' => null,
                'embed_url' => null,
                'formato' => strtolower($uploadedFile->getClientOriginalExtension() ?: $uploadedFile->extension() ?: 'audio'),
                'tamano_mb' => round($uploadedFile->getSize() / 1024 / 1024, 2),
            ];
        } elseif ($youtubeUrl !== '') {
            $youtubeId = $this->youtubeIdFromUrl($youtubeUrl);

            if (!$youtubeId) {
                return null;
            }

            $data = [
                'tipo_origen' => 'youtube',
                'nombre_archivo' => 'YouTube - ' . $youtubeId,
                'url_archivo' => $youtubeUrl,
                'youtube_id' => $youtubeId,
                'embed_url' => $this->youtubeEmbedUrl($youtubeId),
                'formato' => 'youtube',
                'tamano_mb' => null,
            ];
        } elseif ($urlArchivo !== '') {
            $nombreArchivo = basename(parse_url($urlArchivo, PHP_URL_PATH) ?: 'audio-podcast.mp3');
            $data = [
                'tipo_origen' => 'url',
                'nombre_archivo' => $nombreArchivo,
                'url_archivo' => $urlArchivo,
                'youtube_id' => null,
                'embed_url' => null,
                'formato' => strtolower(pathinfo($nombreArchivo, PATHINFO_EXTENSION) ?: (string) $request->input('formato', 'mp3')),
                'tamano_mb' => $request->filled('tamano_mb') ? (float) $request->input('tamano_mb') : null,
            ];
        } else {
            return null;
        }

        return ArchivoAudio::updateOrCreate(
            ['id_episodio' => $episode->id_episodio],
            $data
        );
    }

    public function categories(): JsonResponse
    {
        $items = CategoriaPodcast::orderBy('nombre')->get()
            ->map(fn (CategoriaPodcast $category) => $this->formatCategory($category))
            ->values();

        return $this->jsonOk([
            'count' => $items->count(),
            'results' => $items,
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Podcast::with('categoria')
            ->where('estado', 'activo')
            ->orderByDesc('fecha_creacion');

        if ($request->filled('q')) {
            $search = trim((string) $request->query('q'));
            $query->where(function ($inner) use ($search) {
                $inner->where('nombre', 'like', '%' . $search . '%')
                    ->orWhere('descripcion', 'like', '%' . $search . '%');
            });
        }

        if ($request->filled('categoria')) {
            $category = trim((string) $request->query('categoria'));
            $query->whereHas('categoria', function ($inner) use ($category) {
                $inner->where('nombre', $category)
                    ->orWhere('id_categoria_podcast', (int) $category);
            });
        }

        $items = $query->get()
            ->map(fn (Podcast $podcast) => $this->formatPodcast($podcast))
            ->values();

        return $this->jsonOk([
            'count' => $items->count(),
            'results' => $items,
        ]);
    }

    public function show(int $idPodcast): JsonResponse
    {
        $podcast = Podcast::with('categoria')
            ->where('estado', 'activo')
            ->find($idPodcast);

        if (!$podcast) {
            return $this->jsonError('Podcast no encontrado.', 404);
        }

        return $this->jsonOk($this->formatPodcast($podcast, true));
    }

    public function episodes(int $idPodcast): JsonResponse
    {
        $podcast = Podcast::where('estado', 'activo')->find($idPodcast);

        if (!$podcast) {
            return $this->jsonError('Podcast no encontrado.', 404);
        }

        $items = Episodio::with('archivoAudio', 'podcast.categoria')
            ->where('id_podcast', $idPodcast)
            ->where('estado', 'publicado')
            ->orderByDesc('fecha_publicacion')
            ->get()
            ->map(fn (Episodio $episode) => $this->formatEpisode($episode))
            ->values();

        return $this->jsonOk([
            'count' => $items->count(),
            'results' => $items,
        ]);
    }

    public function showEpisode(int $idEpisode): JsonResponse
    {
        $episode = Episodio::with('archivoAudio', 'podcast.categoria')
            ->where('estado', 'publicado')
            ->find($idEpisode);

        if (!$episode || !$episode->podcast || $episode->podcast->estado !== 'activo') {
            return $this->jsonError('Episodio no encontrado.', 404);
        }

        return $this->jsonOk($this->formatEpisode($episode));
    }

    public function playEpisode(Request $request, int $idEpisode): JsonResponse
    {
        $episode = Episodio::with('podcast')
            ->where('estado', 'publicado')
            ->find($idEpisode);

        if (!$episode || !$episode->podcast || $episode->podcast->estado !== 'activo') {
            return $this->jsonError('Episodio no encontrado o no disponible.', 404);
        }

        $validated = $request->validate([
            'tiempo_escuchado' => ['nullable', 'date_format:H:i:s'],
            'completado' => ['nullable', 'boolean'],
            'dispositivo' => ['nullable', 'string', 'max:100'],
        ]);

        $play = ReproduccionPodcast::create([
            'id_podcast' => $episode->id_podcast,
            'id_episodio' => $episode->id_episodio,
            'id_usuario' => $this->optionalUserId($request),
            'fecha_reproduccion' => Carbon::now(),
            'tiempo_escuchado' => $validated['tiempo_escuchado'] ?? null,
            'completado' => (bool) ($validated['completado'] ?? false),
            'dispositivo' => $validated['dispositivo'] ?? $request->userAgent(),
        ]);

        RabbitMqPublisher::publish('episode.played', [
            'id_reproduccion' => $play->id_reproduccion,
            'id_podcast' => $episode->id_podcast,
            'id_episodio' => $episode->id_episodio,
            'id_usuario' => $play->id_usuario,
            'tiempo_escuchado' => $play->tiempo_escuchado,
            'completado' => (bool) $play->completado,
            'dispositivo' => $play->dispositivo,
            'fecha_reproduccion' => optional($play->fecha_reproduccion)->toISOString(),
            'episodios_publicados' => Episodio::where('id_podcast', $episode->id_podcast)
                ->where('estado', 'publicado')
                ->count(),
        ]);

        return $this->jsonOk([
            'id_reproduccion' => $play->id_reproduccion,
            'episode' => $this->formatEpisode($episode),
        ], 'Reproducción registrada.');
    }

    public function myPodcasts(Request $request): JsonResponse
    {
        $payload = $this->currentUserPayload($request);

        if ($payload instanceof JsonResponse) {
            return $payload;
        }

        $idUsuario = (int) $payload['sub'];
        $items = Podcast::with('categoria')
            ->where('id_usuario_propietario', $idUsuario)
            ->orderByDesc('fecha_creacion')
            ->get()
            ->map(fn (Podcast $podcast) => $this->formatPodcast($podcast))
            ->values();

        return $this->jsonOk([
            'count' => $items->count(),
            'results' => $items,
        ]);
    }

    public function storePodcast(Request $request): JsonResponse
    {
        $payload = $this->currentUserPayload($request);

        if ($payload instanceof JsonResponse) {
            return $payload;
        }

        $validated = $request->validate([
            'id_canal' => ['required', 'integer', 'min:1'],
            'id_categoria_podcast' => ['required', 'integer', Rule::exists('categorias_podcast', 'id_categoria_podcast')],
            'nombre' => ['required', 'string', 'max:150'],
            'descripcion' => ['nullable', 'string'],
            'imagen_portada' => ['nullable', 'string', 'max:2048'],
            'cover_url' => ['nullable', 'string', 'max:2048'],
            'portada' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,gif', 'max:10240'],
            'cover' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,gif', 'max:10240'],
            'cover_file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,gif', 'max:10240'],
            'estado' => ['nullable', 'string'],
        ]);

        $idUsuario = (int) $payload['sub'];

        $channelError = $this->validatePodcastChannelOwnership((int) $validated['id_canal'], $idUsuario);

        if ($channelError) {
            return $channelError;
        }

        $duplicate = Podcast::where('id_canal', (int) $validated['id_canal'])
            ->where('nombre', $validated['nombre'])
            ->exists();

        if ($duplicate) {
            return $this->jsonError('Ya existe un podcast con ese nombre en este canal.', 409);
        }

        $coverData = $this->saveCoverFromRequest($request, $validated);

        $podcast = Podcast::create([
            'id_canal' => (int) $validated['id_canal'],
            'id_usuario_propietario' => $idUsuario,
            'id_categoria_podcast' => (int) $validated['id_categoria_podcast'],
            'nombre' => trim($validated['nombre']),
            'descripcion' => $validated['descripcion'] ?? null,
            'imagen_portada' => $coverData['imagen_portada'],
            'tipo_portada' => $coverData['tipo_portada'],
            'fecha_creacion' => Carbon::now(),
            'estado' => $this->normalizedPodcastStatus($validated['estado'] ?? 'activo'),
        ]);

        $this->recordHistory($podcast->id_podcast, 'crear_podcast', 'Se creó el podcast ' . $podcast->nombre . '.');

        return $this->jsonOk($this->formatPodcast($podcast->fresh('categoria')), 'Podcast creado correctamente.', 201);
    }

    public function updatePodcast(Request $request, int $idPodcast): JsonResponse
    {
        $payload = $this->currentUserPayload($request);

        if ($payload instanceof JsonResponse) {
            return $payload;
        }

        $podcast = Podcast::with('categoria')->find($idPodcast);

        if (!$podcast) {
            return $this->jsonError('Podcast no encontrado.', 404);
        }

        $permissionError = $this->assertPodcastOwner($podcast, (int) $payload['sub']);

        if ($permissionError) {
            return $permissionError;
        }

        $validated = $request->validate([
            'id_categoria_podcast' => ['nullable', 'integer', Rule::exists('categorias_podcast', 'id_categoria_podcast')],
            'nombre' => ['nullable', 'string', 'max:150'],
            'descripcion' => ['nullable', 'string'],
            'imagen_portada' => ['nullable', 'string', 'max:2048'],
            'cover_url' => ['nullable', 'string', 'max:2048'],
            'portada' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,gif', 'max:10240'],
            'cover' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,gif', 'max:10240'],
            'cover_file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,gif', 'max:10240'],
            'estado' => ['nullable', 'string'],
        ]);

        if (isset($validated['nombre'])) {
            $duplicate = Podcast::where('id_canal', $podcast->id_canal)
                ->where('nombre', $validated['nombre'])
                ->where('id_podcast', '!=', $podcast->id_podcast)
                ->exists();

            if ($duplicate) {
                return $this->jsonError('Ya existe otro podcast con ese nombre en este canal.', 409);
            }
        }

        $coverData = $this->saveCoverFromRequest($request, $validated, $podcast->imagen_portada);

        $podcast->fill([
            'id_categoria_podcast' => $validated['id_categoria_podcast'] ?? $podcast->id_categoria_podcast,
            'nombre' => isset($validated['nombre']) ? trim($validated['nombre']) : $podcast->nombre,
            'descripcion' => array_key_exists('descripcion', $validated) ? $validated['descripcion'] : $podcast->descripcion,
            'imagen_portada' => $coverData['imagen_portada'],
            'tipo_portada' => $coverData['tipo_portada'] ?? $podcast->tipo_portada,
            'estado' => isset($validated['estado']) ? $this->normalizedPodcastStatus($validated['estado']) : $podcast->estado,
        ])->save();

        $this->recordHistory($podcast->id_podcast, 'editar_podcast', 'Se actualizó la información del podcast.');

        return $this->jsonOk($this->formatPodcast($podcast->fresh('categoria')), 'Podcast actualizado correctamente.');
    }

    public function deletePodcast(Request $request, int $idPodcast): JsonResponse
    {
        $payload = $this->currentUserPayload($request);

        if ($payload instanceof JsonResponse) {
            return $payload;
        }

        $podcast = Podcast::find($idPodcast);

        if (!$podcast) {
            return $this->jsonError('Podcast no encontrado.', 404);
        }

        $permissionError = $this->assertPodcastOwner($podcast, (int) $payload['sub']);

        if ($permissionError) {
            return $permissionError;
        }

        $podcast->estado = 'inactivo';
        $podcast->save();
        $this->recordHistory($podcast->id_podcast, 'desactivar_podcast', 'El podcast fue desactivado.');

        return $this->jsonOk($this->formatPodcast($podcast->fresh('categoria')), 'Podcast desactivado correctamente.');
    }

    public function myEpisodes(Request $request): JsonResponse
    {
        $payload = $this->currentUserPayload($request);

        if ($payload instanceof JsonResponse) {
            return $payload;
        }

        $idUsuario = (int) $payload['sub'];
        $items = Episodio::with('archivoAudio', 'podcast.categoria')
            ->whereHas('podcast', fn ($query) => $query->where('id_usuario_propietario', $idUsuario))
            ->where('estado', '!=', 'eliminado')
            ->orderByDesc('fecha_publicacion')
            ->get()
            ->map(fn (Episodio $episode) => $this->formatEpisode($episode))
            ->values();

        return $this->jsonOk([
            'count' => $items->count(),
            'results' => $items,
        ]);
    }

    public function storeEpisode(Request $request, int $idPodcast): JsonResponse
    {
        $payload = $this->currentUserPayload($request);

        if ($payload instanceof JsonResponse) {
            return $payload;
        }

        $podcast = Podcast::find($idPodcast);

        if (!$podcast) {
            return $this->jsonError('Podcast no encontrado.', 404);
        }

        $permissionError = $this->assertPodcastOwner($podcast, (int) $payload['sub']);

        if ($permissionError) {
            return $permissionError;
        }

        $channelError = $this->validatePodcastChannelOwnership((int) $podcast->id_canal, (int) $payload['sub']);

        if ($channelError) {
            return $channelError;
        }

        $validated = $request->validate([
            'titulo' => ['required', 'string', 'max:150'],
            'descripcion' => ['nullable', 'string'],
            'duracion' => ['nullable', 'date_format:H:i:s'],
            'estado' => ['nullable', 'string'],
            'numero_episodio' => ['nullable', 'integer', 'min:1'],
            'audio' => ['nullable', 'file', 'mimes:mp3,wav,m4a,ogg,aac', 'max:102400'],
            'audio_file' => ['nullable', 'file', 'mimes:mp3,wav,m4a,ogg,aac', 'max:102400'],
            'url_archivo' => ['nullable', 'string', 'max:2048'],
            'audio_url' => ['nullable', 'string', 'max:2048'],
            'youtube_url' => ['nullable', 'string', 'max:2048'],
            'youtubeUrl' => ['nullable', 'string', 'max:2048'],
            'formato' => ['nullable', 'string', 'max:20'],
            'tamano_mb' => ['nullable', 'numeric', 'min:0'],
        ]);

        $estado = $this->normalizedEpisodeStatus($validated['estado'] ?? 'publicado');

        if (
            $estado === 'publicado'
            && !$request->hasFile('audio')
            && !$request->hasFile('audio_file')
            && !$request->filled('url_archivo')
            && !$request->filled('audio_url')
            && !$request->filled('youtube_url')
            && !$request->filled('youtubeUrl')
        ) {
            return $this->jsonError('Debes subir un archivo, pegar una URL de audio o pegar un enlace de YouTube.', 422);
        }

        if (($request->filled('youtube_url') || $request->filled('youtubeUrl')) && !$this->youtubeIdFromUrl((string) ($request->input('youtube_url') ?: $request->input('youtubeUrl')))) {
            return $this->jsonError('El enlace de YouTube no parece válido.', 422);
        }

        $episode = Episodio::create([
            'id_podcast' => $podcast->id_podcast,
            'titulo' => trim($validated['titulo']),
            'descripcion' => $validated['descripcion'] ?? null,
            'fecha_publicacion' => Carbon::now(),
            'duracion' => $validated['duracion'] ?? null,
            'estado' => $estado,
            'numero_episodio' => $validated['numero_episodio'] ?? null,
        ]);

        $this->saveAudioFromRequest($request, $episode);
        $this->recordHistory($podcast->id_podcast, 'crear_episodio', 'Se creó el episodio ' . $episode->titulo . '.');

        return $this->jsonOk($this->formatEpisode($episode->fresh('archivoAudio', 'podcast.categoria')), 'Episodio creado correctamente.', 201);
    }

    public function updateEpisode(Request $request, int $idEpisode): JsonResponse
    {
        $payload = $this->currentUserPayload($request);

        if ($payload instanceof JsonResponse) {
            return $payload;
        }

        $episode = Episodio::with('podcast')->find($idEpisode);

        if (!$episode || !$episode->podcast) {
            return $this->jsonError('Episodio no encontrado.', 404);
        }

        $permissionError = $this->assertPodcastOwner($episode->podcast, (int) $payload['sub']);

        if ($permissionError) {
            return $permissionError;
        }

        $validated = $request->validate([
            'titulo' => ['nullable', 'string', 'max:150'],
            'descripcion' => ['nullable', 'string'],
            'duracion' => ['nullable', 'date_format:H:i:s'],
            'estado' => ['nullable', 'string'],
            'numero_episodio' => ['nullable', 'integer', 'min:1'],
            'audio' => ['nullable', 'file', 'mimes:mp3,wav,m4a,ogg,aac', 'max:102400'],
            'audio_file' => ['nullable', 'file', 'mimes:mp3,wav,m4a,ogg,aac', 'max:102400'],
            'url_archivo' => ['nullable', 'string', 'max:2048'],
            'audio_url' => ['nullable', 'string', 'max:2048'],
            'youtube_url' => ['nullable', 'string', 'max:2048'],
            'youtubeUrl' => ['nullable', 'string', 'max:2048'],
            'formato' => ['nullable', 'string', 'max:20'],
            'tamano_mb' => ['nullable', 'numeric', 'min:0'],
        ]);

        if (($request->filled('youtube_url') || $request->filled('youtubeUrl')) && !$this->youtubeIdFromUrl((string) ($request->input('youtube_url') ?: $request->input('youtubeUrl')))) {
            return $this->jsonError('El enlace de YouTube no parece válido.', 422);
        }

        $episode->fill([
            'titulo' => isset($validated['titulo']) ? trim($validated['titulo']) : $episode->titulo,
            'descripcion' => array_key_exists('descripcion', $validated) ? $validated['descripcion'] : $episode->descripcion,
            'duracion' => array_key_exists('duracion', $validated) ? $validated['duracion'] : $episode->duracion,
            'estado' => isset($validated['estado']) ? $this->normalizedEpisodeStatus($validated['estado']) : $episode->estado,
            'numero_episodio' => array_key_exists('numero_episodio', $validated) ? $validated['numero_episodio'] : $episode->numero_episodio,
        ])->save();

        $this->saveAudioFromRequest($request, $episode);
        $this->recordHistory($episode->id_podcast, 'editar_episodio', 'Se actualizó el episodio ' . $episode->titulo . '.');

        return $this->jsonOk($this->formatEpisode($episode->fresh('archivoAudio', 'podcast.categoria')), 'Episodio actualizado correctamente.');
    }

    public function deleteEpisode(Request $request, int $idEpisode): JsonResponse
    {
        $payload = $this->currentUserPayload($request);

        if ($payload instanceof JsonResponse) {
            return $payload;
        }

        $episode = Episodio::with('podcast')->find($idEpisode);

        if (!$episode || !$episode->podcast) {
            return $this->jsonError('Episodio no encontrado.', 404);
        }

        $permissionError = $this->assertPodcastOwner($episode->podcast, (int) $payload['sub']);

        if ($permissionError) {
            return $permissionError;
        }

        $episode->estado = 'eliminado';
        $episode->save();
        $this->recordHistory($episode->id_podcast, 'eliminar_episodio', 'Se eliminó el episodio ' . $episode->titulo . '.');

        return $this->jsonOk($this->formatEpisode($episode->fresh('archivoAudio', 'podcast.categoria')), 'Episodio eliminado correctamente.');
    }

    public function myHistory(Request $request): JsonResponse
    {
        $payload = $this->currentUserPayload($request);

        if ($payload instanceof JsonResponse) {
            return $payload;
        }

        $idUsuario = (int) $payload['sub'];
        $items = HistorialPodcast::with('podcast')
            ->whereHas('podcast', fn ($query) => $query->where('id_usuario_propietario', $idUsuario))
            ->orderByDesc('fecha_registro')
            ->get()
            ->map(fn (HistorialPodcast $history) => $this->formatHistory($history))
            ->values();

        return $this->jsonOk([
            'count' => $items->count(),
            'results' => $items,
        ]);
    }

    public function myStats(Request $request): JsonResponse
    {
        $payload = $this->currentUserPayload($request);

        if ($payload instanceof JsonResponse) {
            return $payload;
        }

        $idUsuario = (int) $payload['sub'];
        $podcastIds = Podcast::where('id_usuario_propietario', $idUsuario)->pluck('id_podcast');
        $episodeIds = Episodio::whereIn('id_podcast', $podcastIds)->where('estado', '!=', 'eliminado')->pluck('id_episodio');

        $playsByEpisode = Episodio::query()
            ->whereIn('episodios.id_episodio', $episodeIds)
            ->leftJoin('reproducciones_podcast', 'reproducciones_podcast.id_episodio', '=', 'episodios.id_episodio')
            ->select(
                'episodios.id_episodio',
                'episodios.titulo',
                DB::raw('COUNT(reproducciones_podcast.id_reproduccion) as reproducciones')
            )
            ->groupBy('episodios.id_episodio', 'episodios.titulo')
            ->orderByDesc('reproducciones')
            ->get();

        $deviceRows = ReproduccionPodcast::whereIn('id_podcast', $podcastIds)
            ->select('dispositivo', DB::raw('COUNT(*) as total'))
            ->groupBy('dispositivo')
            ->orderByDesc('total')
            ->get();

        return $this->jsonOk([
            'podcasts' => $podcastIds->count(),
            'episodes' => $episodeIds->count(),
            'publishedEpisodes' => Episodio::whereIn('id_podcast', $podcastIds)->where('estado', 'publicado')->count(),
            'draftEpisodes' => Episodio::whereIn('id_podcast', $podcastIds)->where('estado', 'borrador')->count(),
            'totalPlays' => ReproduccionPodcast::whereIn('id_podcast', $podcastIds)->count(),
            'playsByEpisode' => $playsByEpisode,
            'devices' => $deviceRows,
        ]);
    }

    public function dashboard(Request $request): JsonResponse
    {
        $payload = $this->currentUserPayload($request);

        if ($payload instanceof JsonResponse) {
            return $payload;
        }

        $idUsuario = (int) $payload['sub'];
        $podcasts = Podcast::with('categoria')
            ->where('id_usuario_propietario', $idUsuario)
            ->orderByDesc('fecha_creacion')
            ->get();

        $podcastIds = $podcasts->pluck('id_podcast');
        $episodes = Episodio::with('archivoAudio', 'podcast.categoria')
            ->whereIn('id_podcast', $podcastIds)
            ->where('estado', '!=', 'eliminado')
            ->orderByDesc('fecha_publicacion')
            ->limit(10)
            ->get();

        return $this->jsonOk([
            'summary' => [
                'podcasts' => $podcasts->count(),
                'episodes' => Episodio::whereIn('id_podcast', $podcastIds)->where('estado', '!=', 'eliminado')->count(),
                'publishedEpisodes' => Episodio::whereIn('id_podcast', $podcastIds)->where('estado', 'publicado')->count(),
                'draftEpisodes' => Episodio::whereIn('id_podcast', $podcastIds)->where('estado', 'borrador')->count(),
                'totalPlays' => ReproduccionPodcast::whereIn('id_podcast', $podcastIds)->count(),
            ],
            'podcasts' => $podcasts->map(fn (Podcast $podcast) => $this->formatPodcast($podcast))->values(),
            'episodes' => $episodes->map(fn (Episodio $episode) => $this->formatEpisode($episode))->values(),
        ]);
    }
}
