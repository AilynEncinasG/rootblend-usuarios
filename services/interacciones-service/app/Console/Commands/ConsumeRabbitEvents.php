<?php

namespace App\Console\Commands;

use App\Models\CanalInteraccion;
use App\Models\ConfiguracionNotificacion;
use App\Models\EventoNotificable;
use App\Models\Notificacion;
use App\Models\Seguimiento;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Throwable;

class ConsumeRabbitEvents extends Command
{
    protected $signature = 'rabbitmq:consume-interacciones {--once : Consume mensajes disponibles y termina}';

    protected $description = 'Consume eventos ROOTBLEND desde RabbitMQ para interacciones-service.';

    public function handle(): int
    {
        if (!filter_var(env('RABBITMQ_ENABLED', true), FILTER_VALIDATE_BOOL)) {
            $this->warn('RabbitMQ desactivado para interacciones-service.');
            return self::SUCCESS;
        }

        while (true) {
            try {
                $processed = $this->consumeBatch();

                if ($this->option('once')) {
                    $this->info("ROOTBLEND_INTERACCIONES_CONSUME_ONCE processed={$processed}");
                    return self::SUCCESS;
                }

                if ($processed === 0) {
                    sleep(2);
                }
            } catch (Throwable $exception) {
                $this->error('ROOTBLEND_INTERACCIONES_CONSUMER_RETRY error=' . $exception->getMessage());
                sleep(5);
            }
        }
    }

    private function consumeBatch(): int
    {
        $queue = env('RABBITMQ_INTERACCIONES_STREAM_QUEUE', 'rootblend.interacciones.stream');
        $messages = $this->rabbitRequest(
            'POST',
            '/queues/' . $this->encodedVhost() . '/' . rawurlencode($queue) . '/get',
            [
                'count' => 10,
                'ackmode' => 'ack_requeue_false',
                'encoding' => 'auto',
                'truncate' => 50000,
            ]
        );

        if (!is_array($messages)) {
            return 0;
        }

        $processed = 0;

        foreach ($messages as $message) {
            if (!is_array($message)) {
                continue;
            }

            $this->handleMessage($message);
            $processed++;
        }

        return $processed;
    }

    private function handleMessage(array $message): void
    {
        $payload = $message['payload'] ?? '';
        $routingKey = (string) ($message['routing_key'] ?? '');

        try {
            $envelope = is_array($payload)
                ? $payload
                : json_decode((string) $payload, true, 512, JSON_THROW_ON_ERROR);

            $result = $this->processEnvelope($envelope);
            $this->info(
                'ROOTBLEND_INTERACCIONES_EVENT_OK ' .
                'event_id=' . ($envelope['event_id'] ?? '') . ' ' .
                'event_type=' . ($envelope['event_type'] ?? '') . ' ' .
                'status=' . ($result['status'] ?? 'processed')
            );
        } catch (Throwable $exception) {
            $this->error('ROOTBLEND_INTERACCIONES_EVENT_ERROR error=' . $exception->getMessage());
            $this->publishDeadLetter((string) $payload, $routingKey ?: 'stream.failed');
        }
    }

    private function processEnvelope(array $envelope): array
    {
        $eventId = (string) ($envelope['event_id'] ?? '');
        $eventType = (string) ($envelope['event_type'] ?? '');
        $sourceService = (string) ($envelope['source_service'] ?? '');
        $data = $envelope['data'] ?? [];

        if (!is_array($data)) {
            throw new \RuntimeException('El campo data del evento debe ser un objeto.');
        }

        if ($eventId && DB::table('processed_events')->where('event_id', $eventId)->exists()) {
            return ['status' => 'duplicate'];
        }

        if ($eventType === 'stream.started') {
            return DB::transaction(function () use ($eventId, $eventType, $sourceService, $data) {
                $result = $this->processStreamStarted($data);
                $this->markProcessed($eventId, $eventType, $sourceService);
                return $result;
            });
        }

        if ($eventType === 'stream.ended') {
            return DB::transaction(function () use ($eventId, $eventType, $sourceService, $data) {
                $result = $this->processStreamEnded($data);
                $this->markProcessed($eventId, $eventType, $sourceService);
                return $result;
            });
        }

        throw new \RuntimeException('Tipo de evento no soportado por interacciones-service.');
    }

    private function processStreamStarted(array $data): array
    {
        $idCanal = (int) ($data['id_canal'] ?? 0);

        if (!$idCanal) {
            throw new \RuntimeException('id_canal invalido.');
        }

        $nombreCanal = trim((string) ($data['nombre_canal'] ?? ('Canal ' . $idCanal)));
        $titulo = trim((string) ($data['titulo'] ?? 'Nuevo directo'));

        CanalInteraccion::updateOrCreate(
            ['id_canal' => $idCanal],
            [
                'nombre_canal' => $nombreCanal,
                'tipo_canal' => trim((string) ($data['tipo_canal'] ?? 'streamer')),
                'estado_transmision' => 'online',
            ]
        );

        $evento = EventoNotificable::create([
            'id_canal' => $idCanal,
            'tipo_evento' => 'inicio_directo',
            'descripcion' => $nombreCanal . ' inicio una transmision: ' . $titulo,
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
                'titulo' => $nombreCanal . ' esta en vivo',
                'mensaje' => 'El canal que sigues inicio el directo: ' . $titulo,
                'tipo' => 'directo',
                'fecha_envio' => Carbon::now(),
                'leida' => false,
            ]);

            $created++;
        }

        return ['status' => 'processed', 'notificaciones_creadas' => $created];
    }

    private function processStreamEnded(array $data): array
    {
        $idCanal = (int) ($data['id_canal'] ?? 0);

        if (!$idCanal) {
            throw new \RuntimeException('id_canal invalido.');
        }

        CanalInteraccion::where('id_canal', $idCanal)->update([
            'estado_transmision' => 'offline',
        ]);

        return ['status' => 'processed', 'estado_transmision' => 'offline'];
    }

    private function markProcessed(string $eventId, string $eventType, string $sourceService): void
    {
        if (!$eventId) {
            return;
        }

        DB::table('processed_events')->insert([
            'event_id' => $eventId,
            'event_type' => $eventType,
            'source_service' => $sourceService ?: null,
            'processed_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }

    private function publishDeadLetter(string $payload, string $routingKey): void
    {
        try {
            $this->rabbitRequest(
                'POST',
                '/exchanges/' . $this->encodedVhost() . '/rootblend.events.dlx/publish',
                [
                    'properties' => ['content_type' => 'application/json', 'delivery_mode' => 2],
                    'routing_key' => $routingKey,
                    'payload' => $payload,
                    'payload_encoding' => 'string',
                ]
            );
        } catch (Throwable $exception) {
            $this->error('ROOTBLEND_INTERACCIONES_DLQ_ERROR error=' . $exception->getMessage());
        }
    }

    private function rabbitRequest(string $method, string $path, array $body): array
    {
        $url = rtrim(env('RABBITMQ_MANAGEMENT_URL', 'http://rabbitmq:15672/api'), '/') . $path;
        $auth = base64_encode(env('RABBITMQ_USER', 'rootblend') . ':' . env('RABBITMQ_PASSWORD', 'rootblend123'));
        $context = stream_context_create([
            'http' => [
                'method' => $method,
                'timeout' => 10,
                'header' => implode("\r\n", [
                    'Content-Type: application/json',
                    'Accept: application/json',
                    'Authorization: Basic ' . $auth,
                ]),
                'content' => json_encode($body, JSON_UNESCAPED_UNICODE),
            ],
        ]);

        $response = @file_get_contents($url, false, $context);

        if ($response === false) {
            throw new \RuntimeException('RabbitMQ Management API no respondio.');
        }

        $decoded = json_decode($response, true);

        return is_array($decoded) ? $decoded : [];
    }

    private function encodedVhost(): string
    {
        return rawurlencode(env('RABBITMQ_VHOST', '/'));
    }
}
