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
- `/reset-password` y `/reset-password/demo-token` nueva contrasena demo.
- `/account/menu` menu de usuario.
- `/profile` perfil personal.
- `/profile/edit` editar perfil.
- `/settings` preferencias de cuenta.
- `/notifications` notificaciones.
- `/following` canales seguidos.
- `/subscriptions` canales suscritos.

La campana del navbar abre un panel desplegable de notificaciones sin cambiar de pagina. El avatar abre un menu desplegable tipo Twitch con Inicio, Perfil, Mi canal, Activar canal, Panel creador, Estadisticas, Configuracion, Notificaciones, Seguidos, Suscripciones, Cambiar contrasena y Cerrar sesion.

## Creador streamer

- `/creator/activate` activar canal de creador. Mantiene la regla: streamer o podcaster, no ambos.
- `/creator/dashboard` redirecciona segun el rol elegido.
- `/stats` redirecciona a estadisticas de streamer o podcaster segun el rol elegido.
- `/creator/streamer/dashboard` panel del streamer.
- `/creator/streamer` alias directo del panel streamer.
- `/creator/streamer/streams/new` crear/configurar stream.
- `/creator/streamer/create-stream` alias del formulario crear/configurar stream.
- `/creator/streamer/live-control` control de transmision.
- `/creator/streamer/control` alias del control de transmision.
- `/creator/streamer/channel/edit` editar informacion del canal.
- `/creator/streamer/channel` alias de editar canal.
- `/creator/streamer/stats` estadisticas de stream.
- `/creator/streamer/highlights` momentos destacados.
- `/creator/streamer/highlights/new` subir momento destacado.
- `/creator/streamer/highlights/1/edit` editar/eliminar momento.

Si el usuario activo eligio `streamer`, cualquier intento de entrar a `/creator/podcaster` devuelve automaticamente a `/creator/streamer`. El streamer puede ser tambien moderador de su propio canal y puede asignar moderadores por canal desde el chat o desde `/moderation/moderators`.

## Creador podcaster

- `/creator/podcaster/dashboard` panel del podcaster.
- `/creator/podcaster` alias directo del panel podcaster.
- `/creator/podcaster/podcasts/new` crear podcast.
- `/creator/podcaster/create-podcast` alias de crear podcast.
- `/creator/podcaster/podcasts/fuera-orbita` administrar podcast.
- `/creator/podcaster/podcasts/fuera-orbita/manage` alias administrar podcast.
- `/creator/podcaster/episodes/new` subir episodio.
- `/creator/podcaster/episodes` lista de episodios.
- `/creator/podcaster/stats` estadisticas de podcast.
- `/creator/podcaster/history` historial del podcast.
- `/creator/podcaster/episodes/ep-42/edit` editar episodio.
- `/creator/podcaster/episodes/ep-42/delete` eliminar episodio.

Si el usuario activo eligio `podcaster`, cualquier intento de entrar a `/creator/streamer` devuelve automaticamente a `/creator/podcaster`.

## Estados y demo distribuida

- `/loading` y `/loading-demo` skeleton global.
- `/empty/streams` y `/no-streams` sin streams en vivo.
- `/empty/search` y `/empty-search` sin resultados de busqueda.
- `/partial-unavailable` y `/service-down` servicio no disponible parcialmente.
- `/502` y `/gateway-error` error 502 amigable.
- `/confirm-delete` confirmacion de eliminacion.
- `/invalid-file` archivo invalido.
- `/restricted` y `/access-restricted` acceso restringido.
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

Un usuario puede ser solo moderador, o moderador y streamer, o moderador y podcaster. La moderacion no cambia su tipo de creador. Los permisos de moderador son por canal: si otro canal tambien quiere a ese usuario como moderador, el duenio de ese otro canal debe asignarlo. Para probar el caso "solo moderador" en demo, inicia sesion como `GamerX`, porque viene como moderador inicial del canal mock.

En `/streams/cyberpunk-2077`, cada mensaje del chat tiene un boton de acciones. Al abrirlo aparecen: ver perfil, hacer moderador, eliminar mensaje, silenciar usuario y bloquear usuario.

## Checklist rapido

1. Entra a `/login` e inicia sesion con cualquier dato.
2. Haz clic en el avatar: debe abrirse el menu desplegable.
3. Haz clic en la campana: debe abrirse el panel de notificaciones.
4. Ve a `/creator/activate`, elige Streamer y continua.
5. Entra a `/creator/streamer`.
6. Entra a `/moderation/moderators` para agregar o quitar moderadores.
7. Intenta entrar a `/creator/podcaster`: debe devolverte a `/creator/streamer`.
8. Entra a `/streams/cyberpunk-2077` y abre las acciones de un mensaje del chat.
