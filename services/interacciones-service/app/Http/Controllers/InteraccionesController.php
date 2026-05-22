<?php

namespace App\Http\Controllers;

use App\Models\CanalInteraccion;
use App\Models\ConfiguracionNotificacion;
use App\Models\EventoNotificable;
use App\Models\Notificacion;
use App\Models\Seguimiento;
use App\Models\Suscripcion;
use App\Models\UsuarioInteraccion;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InteraccionesController extends Controller
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

    private function currentUser(Request $request): UsuarioInteraccion|JsonResponse
    {
        $header = $request->header('Authorization', '');
        $token = str_starts_with($header, 'Bearer ') ? trim(substr($header, 7)) : '';
        $payload = $this->decodeAccessToken($token);

        if (!$payload || empty($payload['sub'])) {
            return $this->jsonError('No autenticado.', 401);
        }

        $idUsuario = (int) $payload['sub'];
        $correo = (string) ($payload['email'] ?? ('usuario' . $idUsuario . '@rootblend.local'));
        $nombre = trim(strtok($correo, '@') ?: ('Usuario ' . $idUsuario));

        return UsuarioInteraccion::updateOrCreate(
            ['id_usuario' => $idUsuario],
            [
                'nombre_usuario' => $nombre,
                'correo' => $correo,
                'estado' => 'activo',
            ]
        );
    }

    private function ensureNotificationConfig(int $idUsuario): void
    {
        ConfiguracionNotificacion::firstOrCreate(
            ['id_usuario' => $idUsuario],
            [
                'notificar_directos' => true,
                'notificar_suscripciones' => true,
                'notificar_promociones' => false,
                'canal_web' => true,
            ]
        );
    }

    private function ensureUserMirrorById(int $idUsuario): UsuarioInteraccion
    {
        return UsuarioInteraccion::firstOrCreate(
            ['id_usuario' => $idUsuario],
            [
                'nombre_usuario' => 'Usuario ' . $idUsuario,
                'correo' => 'rootblend-user-' . $idUsuario . '@local.rootblend',
                'estado' => 'activo',
            ]
        );
    }

    private function ensureChannelFromRequest(Request $request): CanalInteraccion|JsonResponse
    {
        $idCanal = (int) $request->input('id_canal');

        if (!$idCanal) {
            return $this->jsonError('Debes enviar id_canal.', 400);
        }

        return CanalInteraccion::updateOrCreate(
            ['id_canal' => $idCanal],
            [
                'nombre_canal' => trim((string) $request->input('nombre_canal', 'Canal ' . $idCanal)),
                'tipo_canal' => trim((string) $request->input('tipo_canal', 'streamer')),
                'estado_transmision' => trim((string) $request->input('estado_transmision', 'offline')),
            ]
        );
    }

    private function interactionState(int $idUsuario, int $idCanal): array
    {
        $seguimiento = Seguimiento::where('id_usuario', $idUsuario)
            ->where('id_canal', $idCanal)
            ->first();

        $suscripcion = Suscripcion::where('id_usuario', $idUsuario)
            ->where('id_canal', $idCanal)
            ->first();

        return [
            'id_usuario' => $idUsuario,
            'id_canal' => $idCanal,
            'siguiendo' => (bool) ($seguimiento?->activo),
            'suscrito' => (bool) ($suscripcion?->activa),
            'seguimiento' => $seguimiento,
            'suscripcion' => $suscripcion,
        ];
    }

    private function createNotificationForUser(
        int $idUsuario,
        int $idCanal,
        string $tipoEvento,
        string $titulo,
        string $mensaje,
        ?string $descripcion = null
    ): void {
        $this->ensureUserMirrorById($idUsuario);

        $config = ConfiguracionNotificacion::firstOrCreate(
            ['id_usuario' => $idUsuario],
            [
                'notificar_directos' => true,
                'notificar_suscripciones' => true,
                'notificar_promociones' => false,
                'canal_web' => true,
            ]
        );

        if (!$config->canal_web) {
            return;
        }

        $evento = EventoNotificable::create([
            'id_canal' => $idCanal,
            'tipo_evento' => $tipoEvento,
            'descripcion' => $descripcion ?: $mensaje,
            'fecha_evento' => Carbon::now(),
            'estado' => 'generado',
        ]);

        Notificacion::create([
            'id_usuario' => $idUsuario,
            'id_evento' => $evento->id_evento,
            'titulo' => $titulo,
            'mensaje' => $mensaje,
            'tipo' => $tipoEvento,
            'fecha_envio' => Carbon::now(),
            'leida' => false,
        ]);
    }

    public function getChannelState(Request $request): JsonResponse
    {
        $user = $this->currentUser($request);

        if ($user instanceof JsonResponse) {
            return $user;
        }

        $idCanal = (int) $request->query('id_canal');

        if (!$idCanal) {
            return $this->jsonError('Debes enviar id_canal.', 400);
        }

        return $this->jsonOk($this->interactionState((int) $user->id_usuario, $idCanal));
    }

    public function follow(Request $request): JsonResponse
    {
        $user = $this->currentUser($request);

        if ($user instanceof JsonResponse) {
            return $user;
        }

        $validated = $request->validate([
            'id_canal' => ['required', 'integer'],
            'nombre_canal' => ['required', 'string'],
            'tipo_canal' => ['nullable', 'string'],
            'estado_transmision' => ['nullable', 'string'],
            'id_usuario_propietario' => ['nullable', 'integer'],
        ]);

        $channel = $this->ensureChannelFromRequest($request);

        if ($channel instanceof JsonResponse) {
            return $channel;
        }

        $this->ensureNotificationConfig((int) $user->id_usuario);

        Seguimiento::updateOrCreate(
            ['id_usuario' => $user->id_usuario, 'id_canal' => $channel->id_canal],
            ['fecha_seguimiento' => Carbon::now(), 'activo' => true]
        );

        if (
            !empty($validated['id_usuario_propietario']) &&
            (int) $validated['id_usuario_propietario'] !== (int) $user->id_usuario
        ) {
            $this->createNotificationForUser(
                (int) $validated['id_usuario_propietario'],
                (int) $validated['id_canal'],
                'nuevo_seguidor',
                'Nuevo seguidor',
                $user->nombre_usuario . ' empezó a seguir tu canal ' . $validated['nombre_canal'] . '.',
                'Un usuario siguió el canal.'
            );
        }

        return $this->jsonOk(
            $this->interactionState((int) $user->id_usuario, (int) $channel->id_canal),
            'Canal seguido correctamente.'
        );
    }

    public function unfollow(Request $request, int $idCanal): JsonResponse
    {
        $user = $this->currentUser($request);

        if ($user instanceof JsonResponse) {
            return $user;
        }

        Seguimiento::where('id_usuario', $user->id_usuario)
            ->where('id_canal', $idCanal)
            ->update(['activo' => false]);

        return $this->jsonOk(
            $this->interactionState((int) $user->id_usuario, $idCanal),
            'Dejaste de seguir el canal.'
        );
    }

    public function subscribe(Request $request): JsonResponse
    {
        $user = $this->currentUser($request);

        if ($user instanceof JsonResponse) {
            return $user;
        }

        $validated = $request->validate([
            'id_canal' => ['required', 'integer'],
            'nombre_canal' => ['required', 'string'],
            'tipo_canal' => ['nullable', 'string'],
            'estado_transmision' => ['nullable', 'string'],
            'tipo_plan' => ['nullable', 'string'],
            'id_usuario_propietario' => ['nullable', 'integer'],
        ]);

        $channel = $this->ensureChannelFromRequest($request);

        if ($channel instanceof JsonResponse) {
            return $channel;
        }

        $this->ensureNotificationConfig((int) $user->id_usuario);

        Suscripcion::updateOrCreate(
            ['id_usuario' => $user->id_usuario, 'id_canal' => $channel->id_canal],
            [
                'fecha_suscripcion' => Carbon::now(),
                'tipo_plan' => (string) ($validated['tipo_plan'] ?? 'mensual'),
                'activa' => true,
                'fecha_vencimiento' => Carbon::now()->addDays(30),
            ]
        );

        if (
            !empty($validated['id_usuario_propietario']) &&
            (int) $validated['id_usuario_propietario'] !== (int) $user->id_usuario
        ) {
            $this->createNotificationForUser(
                (int) $validated['id_usuario_propietario'],
                (int) $validated['id_canal'],
                'nueva_suscripcion',
                'Nueva suscripción',
                $user->nombre_usuario . ' se suscribió a tu canal ' . $validated['nombre_canal'] . '.',
                'Un usuario se suscribió al canal.'
            );
        }

        return $this->jsonOk(
            $this->interactionState((int) $user->id_usuario, (int) $channel->id_canal),
            'Suscripción registrada correctamente.'
        );
    }

    public function unsubscribe(Request $request, int $idCanal): JsonResponse
    {
        $user = $this->currentUser($request);

        if ($user instanceof JsonResponse) {
            return $user;
        }

        Suscripcion::where('id_usuario', $user->id_usuario)
            ->where('id_canal', $idCanal)
            ->update(['activa' => false]);

        return $this->jsonOk(
            $this->interactionState((int) $user->id_usuario, $idCanal),
            'Suscripción cancelada correctamente.'
        );
    }

    public function myFollows(Request $request): JsonResponse
    {
        $user = $this->currentUser($request);

        if ($user instanceof JsonResponse) {
            return $user;
        }

        $items = DB::table('seguimientos')
            ->join('canales_interaccion', 'canales_interaccion.id_canal', '=', 'seguimientos.id_canal')
            ->where('seguimientos.id_usuario', $user->id_usuario)
            ->where('seguimientos.activo', true)
            ->select(
                'seguimientos.*',
                'canales_interaccion.nombre_canal',
                'canales_interaccion.tipo_canal',
                'canales_interaccion.estado_transmision'
            )
            ->orderByDesc('seguimientos.fecha_seguimiento')
            ->get();

        return $this->jsonOk(['count' => $items->count(), 'results' => $items]);
    }

    public function mySubscriptions(Request $request): JsonResponse
    {
        $user = $this->currentUser($request);

        if ($user instanceof JsonResponse) {
            return $user;
        }

        $items = DB::table('suscripciones')
            ->join('canales_interaccion', 'canales_interaccion.id_canal', '=', 'suscripciones.id_canal')
            ->where('suscripciones.id_usuario', $user->id_usuario)
            ->where('suscripciones.activa', true)
            ->select(
                'suscripciones.*',
                'canales_interaccion.nombre_canal',
                'canales_interaccion.tipo_canal',
                'canales_interaccion.estado_transmision'
            )
            ->orderByDesc('suscripciones.fecha_suscripcion')
            ->get();

        return $this->jsonOk(['count' => $items->count(), 'results' => $items]);
    }

    public function notifications(Request $request): JsonResponse
    {
        $user = $this->currentUser($request);

        if ($user instanceof JsonResponse) {
            return $user;
        }

        $items = DB::table('notificaciones')
            ->join('eventos_notificables', 'eventos_notificables.id_evento', '=', 'notificaciones.id_evento')
            ->leftJoin('canales_interaccion', 'canales_interaccion.id_canal', '=', 'eventos_notificables.id_canal')
            ->where('notificaciones.id_usuario', $user->id_usuario)
            ->select(
                'notificaciones.*',
                'eventos_notificables.id_canal',
                'eventos_notificables.tipo_evento',
                'eventos_notificables.descripcion as descripcion_evento',
                'canales_interaccion.nombre_canal'
            )
            ->orderByDesc('notificaciones.fecha_envio')
            ->limit(80)
            ->get();

        return $this->jsonOk(['count' => $items->count(), 'results' => $items]);
    }

    public function notificationConfig(Request $request): JsonResponse
    {
        $user = $this->currentUser($request);

        if ($user instanceof JsonResponse) {
            return $user;
        }

        $config = ConfiguracionNotificacion::firstOrCreate(
            ['id_usuario' => $user->id_usuario],
            [
                'notificar_directos' => true,
                'notificar_suscripciones' => true,
                'notificar_promociones' => false,
                'canal_web' => true,
            ]
        );

        return $this->jsonOk([
            'configuracion' => $config,
        ]);
    }

    public function updateNotificationConfig(Request $request): JsonResponse
    {
        $user = $this->currentUser($request);

        if ($user instanceof JsonResponse) {
            return $user;
        }

        $validated = $request->validate([
            'notificar_directos' => ['sometimes', 'boolean'],
            'notificar_suscripciones' => ['sometimes', 'boolean'],
            'notificar_promociones' => ['sometimes', 'boolean'],
            'canal_web' => ['sometimes', 'boolean'],
        ]);

        $config = ConfiguracionNotificacion::firstOrCreate(
            ['id_usuario' => $user->id_usuario],
            [
                'notificar_directos' => true,
                'notificar_suscripciones' => true,
                'notificar_promociones' => false,
                'canal_web' => true,
            ]
        );

        $config->fill($validated);
        $config->save();

        return $this->jsonOk([
            'configuracion' => $config,
        ], 'Configuración de notificaciones actualizada correctamente.');
    }

    public function markNotificationRead(Request $request, int $idNotificacion): JsonResponse
    {
        $user = $this->currentUser($request);

        if ($user instanceof JsonResponse) {
            return $user;
        }

        $updated = Notificacion::where('id_notificacion', $idNotificacion)
            ->where('id_usuario', $user->id_usuario)
            ->update(['leida' => true]);

        if (!$updated) {
            return $this->jsonError('Notificación no encontrada.', 404);
        }

        return $this->jsonOk(['id_notificacion' => $idNotificacion], 'Notificación marcada como leída.');
    }

    public function streamStarted(Request $request): JsonResponse
    {
        $idCanal = (int) $request->input('id_canal');

        if (!$idCanal) {
            return $this->jsonError('Debes enviar id_canal.', 400);
        }

        $nombreCanal = trim((string) $request->input('nombre_canal', 'Canal ' . $idCanal));
        $titulo = trim((string) $request->input('titulo', 'Nuevo directo'));

        CanalInteraccion::updateOrCreate(
            ['id_canal' => $idCanal],
            [
                'nombre_canal' => $nombreCanal,
                'tipo_canal' => trim((string) $request->input('tipo_canal', 'streamer')),
                'estado_transmision' => 'online',
            ]
        );

        $evento = EventoNotificable::create([
            'id_canal' => $idCanal,
            'tipo_evento' => 'inicio_directo',
            'descripcion' => $nombreCanal . ' inició una transmisión: ' . $titulo,
            'fecha_evento' => Carbon::now(),
            'estado' => 'generado',
        ]);

        $followers = Seguimiento::where('id_canal', $idCanal)
            ->where('activo', true)
            ->get();

        $created = 0;

        foreach ($followers as $follow) {
            $config = ConfiguracionNotificacion::firstOrCreate(
                ['id_usuario' => $follow->id_usuario],
                [
                    'notificar_directos' => true,
                    'notificar_suscripciones' => true,
                    'notificar_promociones' => false,
                    'canal_web' => true,
                ]
            );

            if (!$config->notificar_directos || !$config->canal_web) {
                continue;
            }

            Notificacion::create([
                'id_usuario' => $follow->id_usuario,
                'id_evento' => $evento->id_evento,
                'titulo' => $nombreCanal . ' está en vivo',
                'mensaje' => 'El canal que sigues inició el directo: ' . $titulo,
                'tipo' => 'directo',
                'fecha_envio' => Carbon::now(),
                'leida' => false,
            ]);

            $created++;
        }

        return $this->jsonOk([
            'id_evento' => $evento->id_evento,
            'notificaciones_creadas' => $created,
        ], 'Evento de inicio de directo procesado.');
    }

    public function channelSummary(Request $request, int $idCanal): JsonResponse
    {
        $followers = Seguimiento::where('id_canal', $idCanal)
            ->where('activo', true)
            ->count();

        $subscriptions = Suscripcion::where('id_canal', $idCanal)
            ->where('activa', true)
            ->count();

        $channel = CanalInteraccion::where('id_canal', $idCanal)->first();

        return $this->jsonOk([
            'id_canal' => $idCanal,
            'nombre_canal' => $channel?->nombre_canal,
            'seguidores' => $followers,
            'suscriptores' => $subscriptions,
        ]);
    }
}