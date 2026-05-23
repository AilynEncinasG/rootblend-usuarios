# chat-service

Módulo de integración con Firebase Realtime Database para el chat en vivo de ROOTBLEND.

## Responsabilidad
- manejar configuración de Firebase
- definir reglas del Realtime Database
- documentar la estructura del chat
- servir como base para integrar el chat en el frontend

## No se dockeriza
Este módulo no expone un backend propio como Django o Laravel.
Firebase actúa como servicio externo administrado.

## Archivos importantes
- .env.example
- firebase.config.example.json
- rules/database.rules.json
- docs/eventos-chat.md

## Seguridad actual
- Las reglas ya no aceptan escrituras publicas anonimas (`auth != null`).
- El frontend inicia sesion anonima en Firebase antes de escribir para poder usar esas reglas.
- Para endurecer a 10/10, el siguiente paso es emitir custom tokens desde backend con claims de usuario/canal/moderador.

## Estructura esperada
/chats/{chatId}/messages/{messageId}
