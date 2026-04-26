# Eventos del chat en vivo

## Estructura base en Firebase Realtime Database

/chats/{chatId}/messages/{messageId}

## Campos por mensaje
- usuarioId
- nombre
- mensaje
- timestamp

## Eventos esperados
- mensaje_enviado
- mensaje_editado
- mensaje_eliminado
- usuario_conectado
- usuario_desconectado

## Ejemplo de mensaje

{
  "usuarioId": "123",
  "nombre": "Ailyn",
  "mensaje": "Hola a todos",
  "timestamp": 1714000000
}