<?php

namespace App\Support;

use Throwable;

class RabbitMqPublisher
{
    public static function publish(string $eventType, array $data, ?string $routingKey = null): bool
    {
        if (!filter_var(env('RABBITMQ_ENABLED', true), FILTER_VALIDATE_BOOL)) {
            return false;
        }

        $routingKey = $routingKey ?: $eventType;
        $eventId = self::uuidV4();
        $envelope = [
            'event_id' => $eventId,
            'event_type' => $eventType,
            'source_service' => 'podcasts-service',
            'occurred_at' => gmdate('c'),
            'data' => $data,
        ];

        $body = [
            'properties' => [
                'content_type' => 'application/json',
                'delivery_mode' => 2,
                'message_id' => $eventId,
                'type' => $eventType,
            ],
            'routing_key' => $routingKey,
            'payload' => json_encode($envelope, JSON_UNESCAPED_UNICODE),
            'payload_encoding' => 'string',
        ];

        try {
            $response = self::request(
                'POST',
                '/exchanges/' . self::encodedVhost() . '/' . rawurlencode(env('RABBITMQ_EXCHANGE', 'rootblend.events')) . '/publish',
                $body
            );

            if (!($response['routed'] ?? false)) {
                error_log("ROOTBLEND_RABBITMQ_UNROUTED event_type={$eventType} routing_key={$routingKey} event_id={$eventId}");
                return false;
            }

            error_log("ROOTBLEND_RABBITMQ_PUBLISHED event_type={$eventType} routing_key={$routingKey} event_id={$eventId}");
            return true;
        } catch (Throwable $exception) {
            error_log("ROOTBLEND_RABBITMQ_PUBLISH_ERROR event_type={$eventType}: " . $exception->getMessage());
            return false;
        }
    }

    private static function request(string $method, string $path, array $body): array
    {
        $url = rtrim(env('RABBITMQ_MANAGEMENT_URL', 'http://rabbitmq:15672/api'), '/') . $path;
        $auth = base64_encode(env('RABBITMQ_USER', 'rootblend') . ':' . env('RABBITMQ_PASSWORD', 'rootblend123'));
        $payload = json_encode($body, JSON_UNESCAPED_UNICODE);
        $context = stream_context_create([
            'http' => [
                'method' => $method,
                'timeout' => 5,
                'header' => implode("\r\n", [
                    'Content-Type: application/json',
                    'Accept: application/json',
                    'Authorization: Basic ' . $auth,
                ]),
                'content' => $payload,
            ],
        ]);

        $response = @file_get_contents($url, false, $context);

        if ($response === false) {
            throw new \RuntimeException('RabbitMQ Management API no respondio.');
        }

        $decoded = json_decode($response, true);

        return is_array($decoded) ? $decoded : [];
    }

    private static function encodedVhost(): string
    {
        return rawurlencode(env('RABBITMQ_VHOST', '/'));
    }

    private static function uuidV4(): string
    {
        $data = random_bytes(16);
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);

        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}
