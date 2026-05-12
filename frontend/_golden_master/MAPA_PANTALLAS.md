# Mapa de pantallas ROOTBLEND

Golden master: `frontend/_golden_master/RootblendScreens.original.tsx`

Estados posibles: Pendiente, Extraida, Compila, Visual comparado, Funcional comparado, Aprobada.

| ID | Pantalla original | Linea aprox. original | Destino modular | Ruta | Estado codigo | Estado build | Estado visual | Estado funcional | Notas |
|---|---|---:|---|---|---|---|---|---|---|
| B01 | RootShell | 237 | `src/shared/layout/RootShell.tsx` | global | Extraida | Compila | Pendiente | Pendiente | Link Moderacion restaurado a `/moderation`. |
| B02 | HomePage | 812 | `src/modules/public/pages/HomePage.tsx` | `/` | Extraida | Compila | Pendiente | Pendiente | Auditar 1:1 contra hero, secciones y right panel. |
| B03 | ExploreStreamsPage | 1057 | `src/modules/streams/pages/ExploreStreamsPage.tsx` | `/streams` | Extraida | Compila | Pendiente | Pendiente | Ruta modular actual vive en streams. |
| B04 | CategoriesPage | 1188 | `src/modules/public/pages/CategoriesPage.tsx` | `/categories` | Extraida | Compila | Pendiente | Pendiente | - |
| B05 | SearchResultsPage | 1287 | `src/modules/public/pages/SearchResultsPage.tsx` | `/search?q=gaming` | Extraida | Compila | Pendiente | Pendiente | - |
| B06 | ChannelPage | 1368 | `src/modules/public/pages/ChannelPage.tsx` | `/channels/1` | Extraida | Compila | Pendiente | Pendiente | - |
| B07 | StreamDetailPage | 1518 | `src/modules/streams/pages/StreamDetailPage.tsx` | `/streams/1` | Extraida | Compila | Pendiente | Pendiente | - |
| B08 | StreamWithChatPage | 1776 | `src/modules/streams/pages/StreamWithChatPage.tsx` | `/streams/1/watch` | Extraida | Compila | Pendiente | Pendiente | Alias `/watch` agregado. |
| B09 | StreamGuestPage | 1780 | `src/modules/streams/pages/StreamGuestPage.tsx` | `/streams/1/guest` | Extraida | Compila | Pendiente | Pendiente | - |
| B10 | PodcastsPage | 1821 | `src/modules/podcasts/pages/PodcastsPage.tsx` | `/podcasts` | Extraida | Compila | Pendiente | Pendiente | - |
| B11 | PodcastDetailPage | 1885 | `src/modules/podcasts/pages/PodcastDetailPage.tsx` | `/podcasts/rootcast` | Extraida | Compila | Pendiente | Pendiente | - |
| B12 | LoginPage | 1931 | `src/modules/auth/pages/LoginPage.tsx` | `/login` | Extraida | Compila | Pendiente | Pendiente | - |
| B13 | RegisterPage | 2031 | `src/modules/auth/pages/RegisterPage.tsx` | `/register` | Extraida | Compila | Pendiente | Pendiente | - |
| B14 | ForgotPasswordPage | 2182 | `src/modules/auth/pages/ForgotPasswordPage.tsx` | `/forgot-password` | Extraida | Compila | Pendiente | Pendiente | - |
| B15 | ResetPasswordPage | 2286 | `src/modules/auth/pages/ResetPasswordPage.tsx` | `/reset-password` | Extraida | Compila | Pendiente | Pendiente | - |
| B16 | UserMenuPage | 2411 | `src/modules/account/pages/UserMenuPage.tsx` | `/user-menu` | Extraida | Compila | Pendiente | Pendiente | Alias `/user-menu` agregado. |
| B17 | ProfilePage | 2442 | `src/modules/account/pages/ProfilePage.tsx` | `/profile` | Extraida | Compila | Pendiente | Pendiente | - |
| B18 | EditProfilePage | 2641 | `src/modules/account/pages/EditProfilePage.tsx` | `/profile/edit` | Extraida | Compila | Pendiente | Pendiente | - |
| B19 | SettingsPage | 2860 | `src/modules/account/pages/SettingsPage.tsx` | `/settings` | Extraida | Compila | Pendiente | Pendiente | - |
| B20 | ChangePasswordPage | 3045 | `src/modules/account/pages/ChangePasswordPage.tsx` | `/change-password` | Extraida | Compila | Pendiente | Pendiente | - |
| B21 | NotificationsPage | 3174 | `src/modules/account/pages/NotificationsPage.tsx` | `/notifications` | Extraida | Compila | Pendiente | Pendiente | - |
| B22 | SubscriptionsPage | 3191 | `src/modules/account/pages/SubscriptionsPage.tsx` | `/subscriptions` | Extraida | Compila | Pendiente | Pendiente | - |
| B23 | FollowingPage | 3237 | `src/modules/account/pages/FollowingPage.tsx` | `/following` | Extraida | Compila | Pendiente | Pendiente | - |
| B24 | CreatorActivatePage | 3262 | `src/modules/creator/shared/CreatorActivatePage.tsx` | `/creator/activate` | Extraida | Compila | Pendiente | Pendiente | Existe duplicado en `shared/pages`; router usa el principal. |
| B25 | CreatorDashboardPage | 3322 | `src/modules/creator/shared/CreatorDashboardRedirectPage.tsx` | `/creator/dashboard` | Extraida | Compila | Pendiente | Pendiente | - |
| B26 | StatsRedirectPage | 3327 | `src/modules/creator/shared/StatsRedirectPage.tsx` | `/creator/stats` | Extraida | Compila | Pendiente | Pendiente | Alias `/creator/stats` agregado. |
| B27 | StreamerDashboardPage | 3332 | `src/modules/creator/streamer/pages/StreamerDashboardPage.tsx` | `/creator/streamer/dashboard` | Extraida | Compila | Pendiente | Pendiente | - |
| B28 | CreateStreamPage | 3481 | `src/modules/creator/streamer/pages/CreateStreamPage.tsx` | `/creator/streamer/create-stream` | Extraida | Compila | Pendiente | Pendiente | - |
| B29 | LiveControlPage | 3493 | `src/modules/creator/streamer/pages/LiveControlPage.tsx` | `/creator/streamer/live-control` | Extraida | Compila | Pendiente | Pendiente | - |
| B30 | EditChannelPage | 3515 | `src/modules/creator/streamer/pages/EditChannelPage.tsx` | `/creator/streamer/edit-channel` | Extraida | Compila | Pendiente | Pendiente | Alias agregado. |
| B31 | StreamStatsPage | 3526 | `src/modules/creator/streamer/pages/StreamStatsPage.tsx` | `/creator/streamer/stats` | Extraida | Compila | Pendiente | Pendiente | - |
| B32 | HighlightsPage | 3536 | `src/modules/creator/streamer/pages/HighlightsPage.tsx` | `/creator/streamer/highlights` | Extraida | Compila | Pendiente | Pendiente | - |
| B33 | HighlightUploadPage | 3545 | `src/modules/creator/streamer/pages/HighlightUploadPage.tsx` | `/creator/streamer/highlights/upload` | Extraida | Compila | Pendiente | Pendiente | Alias agregado. |
| B34 | HighlightEditPage | 3549 | `src/modules/creator/streamer/pages/HighlightEditPage.tsx` | `/creator/streamer/highlights/highlight-1/edit` | Extraida | Compila | Pendiente | Pendiente | - |
| B35 | PodcasterDashboardPage | 3564 | `src/modules/creator/podcaster/pages/PodcasterDashboardPage.tsx` | `/creator/podcaster/dashboard` | Extraida | Compila | Pendiente | Pendiente | - |
| B36 | CreatePodcastPage | 3598 | `src/modules/creator/podcaster/pages/CreatePodcastPage.tsx` | `/creator/podcaster/create-podcast` | Extraida | Compila | Pendiente | Pendiente | Alias `/creator/podcaster/create` agregado. |
| B37 | ManagePodcastPage | 3609 | `src/modules/creator/podcaster/pages/ManagePodcastPage.tsx` | `/creator/podcaster/manage` | Extraida | Compila | Pendiente | Pendiente | Alias agregado. |
| B38 | UploadEpisodePage | 3620 | `src/modules/creator/podcaster/pages/UploadEpisodePage.tsx` | `/creator/podcaster/upload-episode` | Extraida | Compila | Pendiente | Pendiente | Alias agregado. |
| B39 | EpisodesListPage | 3631 | `src/modules/creator/podcaster/pages/EpisodesListPage.tsx` | `/creator/podcaster/episodes` | Extraida | Compila | Pendiente | Pendiente | - |
| B40 | PodcastStatsPage | 3648 | `src/modules/creator/podcaster/pages/PodcastStatsPage.tsx` | `/creator/podcaster/stats` | Extraida | Compila | Pendiente | Pendiente | - |
| B41 | PodcastHistoryPage | 3662 | `src/modules/creator/podcaster/pages/PodcastHistoryPage.tsx` | `/creator/podcaster/history` | Extraida | Compila | Pendiente | Pendiente | - |
| B42 | EditEpisodePage | 3670 | `src/modules/creator/podcaster/pages/EditEpisodePage.tsx` | `/creator/podcaster/episodes/episode-1/edit` | Extraida | Compila | Pendiente | Pendiente | - |
| B43 | DeleteEpisodePage | 3674 | `src/modules/creator/podcaster/pages/DeleteEpisodePage.tsx` | `/creator/podcaster/episodes/episode-1/delete` | Extraida | Compila | Pendiente | Pendiente | - |
| B44 | InteractionsPage | 3687 | `src/modules/interactions/pages/InteractionsPage.tsx` | `/interactions` | Extraida | Compila | Pendiente | Pendiente | - |
| B45 | LoadingDemoPage | 3771 | `src/modules/system/pages/LoadingDemoPage.tsx` | `/loading` | Extraida | Compila | Pendiente | Pendiente | - |
| B46 | NoStreamsPage | 3780 | `src/modules/system/pages/NoStreamsPage.tsx` | `/no-streams` | Extraida | Compila | Pendiente | Pendiente | - |
| B47 | EmptySearchPage | 3784 | `src/modules/system/pages/EmptySearchPage.tsx` | `/empty-search` | Extraida | Compila | Pendiente | Pendiente | - |
| B48 | ServiceDownPage | 3788 | `src/modules/system/pages/ServiceDownPage.tsx` | `/service-down` | Extraida | Compila | Pendiente | Pendiente | - |
| B49 | GatewayErrorPage | 3798 | `src/modules/system/pages/GatewayErrorPage.tsx` | `/gateway-error` | Extraida | Compila | Pendiente | Pendiente | - |
| B50 | ConfirmDeletePage | 3802 | `src/modules/system/pages/ConfirmDeletePage.tsx` | `/confirm-delete` | Extraida | Compila | Pendiente | Pendiente | - |
| B51 | InvalidFilePage | 3815 | `src/modules/system/pages/InvalidFilePage.tsx` | `/invalid-file` | Extraida | Compila | Pendiente | Pendiente | - |
| B52 | AccessRestrictedPage | 3819 | `src/modules/system/pages/AccessRestrictedPage.tsx` | `/access-restricted` | Extraida | Compila | Pendiente | Pendiente | - |
| B53 | NotFoundPage | 3823 | `src/modules/system/pages/NotFoundPage.tsx` | `/404` | Extraida | Compila | Pendiente | Pendiente | - |
| B54 | SystemStatusPage | 3827 | `src/modules/system/pages/SystemStatusPage.tsx` | `/system-status` | Extraida | Compila | Pendiente | Pendiente | - |
| B55 | AssignModeratorPage | 3879 | `src/modules/moderation/pages/AssignModeratorPage.tsx` | `/moderation/assign` | Extraida | Compila | Pendiente | Pendiente | - |
| B56 | ConfirmModeratorPage | 3893 | `src/modules/moderation/pages/ConfirmModeratorPage.tsx` | `/moderation/confirm` | Extraida | Compila | Pendiente | Pendiente | Alias agregado. |
| B57 | ModeratorAssignedPage | 3897 | `src/modules/moderation/pages/ModeratorAssignedPage.tsx` | `/moderation/assigned` | Extraida | Compila | Pendiente | Pendiente | - |
| B58 | ModeratorsListPage | 3901 | `src/modules/moderation/pages/ModeratorsListPage.tsx` | `/moderation/moderators` | Extraida | Compila | Pendiente | Pendiente | - |
| B59 | DeleteMessagePage | 4004 | `src/modules/moderation/pages/DeleteMessagePage.tsx` | `/moderation/delete-message/incident-1` | Extraida | Compila | Pendiente | Pendiente | Param route agregado. |
| B60 | SilenceUserPage | 4013 | `src/modules/moderation/pages/SilenceUserPage.tsx` | `/moderation/silence/incident-2` | Extraida | Compila | Pendiente | Pendiente | Param route agregado. |
| B61 | BlockUserPage | 4025 | `src/modules/moderation/pages/BlockUserPage.tsx` | `/moderation/block/incident-3` | Extraida | Compila | Pendiente | Pendiente | Param route agregado. |
| B62 | SanctionsPage | 4038 | `src/modules/moderation/pages/SanctionsPage.tsx` | `/moderation/sanctions` | Extraida | Compila | Pendiente | Pendiente | - |
| B63 | ModeratorDashboardPage | 4055 | `src/modules/moderation/pages/ModeratorDashboardPage.tsx` | `/moderation/dashboard` | Extraida | Compila | Pendiente | Pendiente | Alias agregado; `/moderation` conserva destino original. |
| B64 | ModeratorPermissionsPage | 4076 | `src/modules/moderation/pages/ModeratorPermissionsPage.tsx` | `/moderation/permissions` | Extraida | Compila | Pendiente | Pendiente | - |
