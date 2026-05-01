# ROOTBLEND - Ruta del frontend mock

Este frontend esta armado con datos mock para que puedas navegar la experiencia completa antes de conectar el backend real.

## Entrada publica

- `/` Home publico / home logueado.
- `/streams` explorar transmisiones en vivo.
- `/categories` explorar categorias.
- `/search?q=gaming` resultados de busqueda.
- `/channels/cyberpunk-2077` perfil publico de canal.
- `/streams/cyberpunk-2077` stream en vivo con panel de chat.
- `/streams/cyberpunk-2077/chat` vista de stream con chat.
- `/streams/cyberpunk-2077/guest` vista de stream para usuario no logueado.
- `/podcasts` pagina principal de podcasts.
- `/podcasts/fuera-orbita` detalle de podcast y episodios.

## Cuenta

- `/login` login mock. Cualquier dato inicia sesion.
- `/register` registro mock. Crea sesion local.
- `/forgot-password` recuperar contrasena.
- `/account/menu` menu de usuario.
- `/profile` perfil personal.
- `/profile/edit` editar perfil.
- `/settings` preferencias de cuenta.
- `/notifications` notificaciones.
- `/subscriptions` seguidos y suscripciones.

## Creador streamer

- `/creator/activate` activar canal de creador. Mantiene la regla: streamer o podcaster, no ambos.
- `/creator/dashboard` redirecciona segun el rol elegido.
- `/creator/streamer/dashboard` panel del streamer.
- `/creator/streamer/streams/new` crear/configurar stream.
- `/creator/streamer/live-control` control de transmision.
- `/creator/streamer/channel/edit` editar informacion del canal.
- `/creator/streamer/stats` estadisticas de stream.
- `/creator/streamer/highlights` momentos destacados.
- `/creator/streamer/highlights/new` subir momento destacado.
- `/creator/streamer/highlights/1/edit` editar/eliminar momento.

## Creador podcaster

- `/creator/podcaster/dashboard` panel del podcaster.
- `/creator/podcaster/podcasts/new` crear podcast.
- `/creator/podcaster/podcasts/fuera-orbita` administrar podcast.
- `/creator/podcaster/episodes/new` subir episodio.
- `/creator/podcaster/episodes` lista de episodios.
- `/creator/podcaster/stats` estadisticas de podcast.
- `/creator/podcaster/history` historial del podcast.
- `/creator/podcaster/episodes/ep-42/edit` editar episodio.
- `/creator/podcaster/episodes/ep-42/delete` eliminar episodio.

## Estados y demo distribuida

- `/loading-demo` skeleton global.
- `/no-streams` sin streams en vivo.
- `/empty-search` sin resultados de busqueda.
- `/service-down` servicio no disponible parcialmente.
- `/gateway-error` error 502 amigable.
- `/confirm-delete` confirmacion de eliminacion.
- `/invalid-file` archivo invalido.
- `/access-restricted` acceso restringido.
- `/system-status` panel visual de estado de servicios.

## Moderacion

- `/moderation/assign` asignar moderador desde el chat.
- `/moderation/assign/confirm` confirmacion de asignacion.
- `/moderation/assigned` moderador asignado.
- `/moderation/moderators` lista de moderadores.
- `/moderation/delete-message` eliminar mensaje.
- `/moderation/silence` silenciar usuario.
- `/moderation/block` bloquear usuario.
- `/moderation/sanctions` usuarios sancionados.
- `/moderation` panel del moderador.
- `/moderation/permissions` permisos y funciones del moderador.
