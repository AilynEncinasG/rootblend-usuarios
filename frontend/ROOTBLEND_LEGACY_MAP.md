# ROOTBLEND Legacy Map

Archivo analizado:

`src/modules/mock/RootblendScreens.legacy.tsx`

Total de líneas: **5868**

---

## Imports del legacy

- Línea 1: `import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";`
- Línea 2: `import { Link, Navigate, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";`
- Línea 3: `import styled from "styled-components";`
- Línea 4: `import {`
- Línea 43: `import {`
- Línea 59: `import { clearAuthStorage, getStoredUser, isAuthenticated } from "../auth/utils/authStorage";`
- Línea 60: `import {`
- Línea 69: `import {`
- Línea 75: `import {`
- Línea 88: `import LiveVideoPlayer from "../../components/stream/LiveVideoPlayer";`

---

## Páginas probables

| Nombre | Línea |
|---|---:|
| `HomePage` | 811 |
| `ExploreStreamsPage` | 1056 |
| `CategoriesPage` | 1187 |
| `SearchResultsPage` | 1286 |
| `ChannelPage` | 1367 |
| `StreamDetailPage` | 1517 |
| `StreamWithChatPage` | 1775 |
| `StreamGuestPage` | 1779 |
| `PodcastsPage` | 1820 |
| `PodcastDetailPage` | 1884 |
| `LoginPage` | 1930 |
| `RegisterPage` | 2030 |
| `ForgotPasswordPage` | 2181 |
| `ResetPasswordPage` | 2285 |
| `UserMenuPage` | 2410 |
| `ProfilePage` | 2441 |
| `EditProfilePage` | 2640 |
| `SettingsPage` | 2859 |
| `ChangePasswordPage` | 3044 |
| `NotificationsPage` | 3173 |
| `SubscriptionsPage` | 3190 |
| `FollowingPage` | 3236 |
| `CreatorActivatePage` | 3261 |
| `CreatorDashboardPage` | 3321 |
| `StatsRedirectPage` | 3326 |
| `StreamerDashboardPage` | 3331 |
| `CreateStreamPage` | 3479 |
| `LiveControlPage` | 3491 |
| `EditChannelPage` | 3513 |
| `StreamStatsPage` | 3524 |
| `HighlightsPage` | 3534 |
| `HighlightUploadPage` | 3543 |
| `HighlightEditPage` | 3547 |
| `PodcasterDashboardPage` | 3562 |
| `CreatePodcastPage` | 3596 |
| `ManagePodcastPage` | 3607 |
| `UploadEpisodePage` | 3618 |
| `EpisodesListPage` | 3629 |
| `PodcastStatsPage` | 3646 |
| `PodcastHistoryPage` | 3660 |
| `EditEpisodePage` | 3668 |
| `DeleteEpisodePage` | 3672 |
| `InteractionsPage` | 3685 |
| `LoadingDemoPage` | 3769 |
| `NoStreamsPage` | 3778 |
| `EmptySearchPage` | 3782 |
| `ServiceDownPage` | 3786 |
| `GatewayErrorPage` | 3796 |
| `ConfirmDeletePage` | 3800 |
| `InvalidFilePage` | 3813 |
| `AccessRestrictedPage` | 3817 |
| `NotFoundPage` | 3821 |
| `SystemStatusPage` | 3825 |
| `AssignModeratorPage` | 3877 |
| `ConfirmModeratorPage` | 3891 |
| `ModeratorAssignedPage` | 3895 |
| `ModeratorsListPage` | 3899 |
| `DeleteMessagePage` | 4002 |
| `SilenceUserPage` | 4011 |
| `BlockUserPage` | 4023 |
| `SanctionsPage` | 4036 |
| `ModeratorDashboardPage` | 4053 |
| `ModeratorPermissionsPage` | 4074 |


## Componentes probables

| Nombre | Línea |
|---|---:|
| `RootShell` | 236 |


## Helpers / funciones probables

| Nombre | Línea |
|---|---:|
| `pageLinks` | 96 |
| `formatApiError` | 105 |
| `firstValue` | 110 |
| `getInitials` | 123 |
| `clean` | 124 |
| `backendStreamToCard` | 140 |
| `backendCategoryToCard` | 161 |
| `activeCount` | 165 |
| `backendChannelToCard` | 179 |
| `getUserLabel` | 189 |
| `stored` | 190 |
| `firstStream` | 194 |
| `firstPodcast` | 198 |
| `getCreatorRole` | 207 |
| `role` | 208 |
| `setCreatorRole` | 212 |
| `getModerators` | 217 |
| `stored` | 218 |
| `parsed` | 222 |
| `saveModerators` | 232 |
| `navigate` | 237 |
| `loggedIn` | 241 |
| `creatorTarget` | 246 |
| `creatorLabel` | 247 |
| `myChannelTarget` | 248 |
| `loadShellData` | 253 |
| `channels` | 255 |
| `result` | 274 |
| `backendRole` | 277 |
| `normalizedRole` | 278 |
| `refreshCreatorRole` | 303 |
| `submitSearch` | 317 |
| `value` | 319 |
| `target` | 503 |
| `label` | 504 |
| `loggedIn` | 601 |
| `ownerMode` | 602 |
| `canModerate` | 603 |
| `sendMessage` | 605 |
| `currentUser` | 607 |
| `assignModerator` | 627 |
| `next` | 633 |
| `deleteMessage` | 650 |
| `silenceUser` | 671 |
| `blockUser` | 682 |
| `viewProfile` | 694 |
| `loggedIn` | 812 |
| `loadHomeData` | 827 |
| `liveCards` | 842 |
| `heroStream` | 874 |
| `initialCategory` | 1059 |
| `loadStreams` | 1071 |
| `liveCards` | 1083 |
| `filtered` | 1109 |
| `text` | 1111 |
| `bySearch` | 1112 |
| `byCategory` | 1113 |
| `loadCategories` | 1196 |
| `liveCards` | 1208 |
| `query` | 1288 |
| `normalizedQuery` | 1289 |
| `streamResults` | 1290 |
| `channelResults` | 1293 |
| `podcastResults` | 1296 |
| `categoryResults` | 1299 |
| `hasResults` | 1302 |
| `stream` | 1330 |
| `loadChannelPage` | 1377 |
| `selectedChannel` | 1395 |
| `isStreamer` | 1434 |
| `channelInitials` | 1435 |
| `mainStream` | 1436 |
| `loggedIn` | 1530 |
| `loadStreamDetail` | 1535 |
| `isLive` | 1611 |
| `isFinished` | 1612 |
| `stream` | 1780 |
| `podcast` | 1886 |
| `navigate` | 1931 |
| `submit` | 1938 |
| `result` | 1950 |
| `navigate` | 2031 |
| `submit` | 2040 |
| `result` | 2057 |
| `loginResult` | 2069 |
| `submit` | 2188 |
| `result` | 2197 |
| `navigate` | 2286 |
| `submit` | 2297 |
| `result` | 2320 |
| `navigate` | 2411 |
| `storedUser` | 2462 |
| `loadProfile` | 2471 |
| `result` | 2476 |
| `displayName` | 2506 |
| `email` | 2512 |
| `estado` | 2517 |
| `bio` | 2522 |
| `fechaRegistro` | 2526 |
| `ultimoAcceso` | 2530 |
| `navigate` | 2641 |
| `loadProfile` | 2656 |
| `result` | 2661 |
| `updateStoredUserName` | 2694 |
| `raw` | 2695 |
| `parsed` | 2700 |
| `submit` | 2715 |
| `result` | 2738 |
| `loadPreferences` | 2873 |
| `result` | 2878 |
| `preferences` | 2887 |
| `submit` | 2913 |
| `result` | 2921 |
| `submit` | 3053 |
| `result` | 3076 |
| `navigate` | 3262 |
| `existingRole` | 3263 |
| `submit` | 3266 |
| `resetDemoRole` | 3277 |
| `role` | 3322 |
| `role` | 3327 |
| `loadCreatorData` | 3340 |
| `totalStreams` | 3376 |
| `liveStreams` | 3377 |
| `scheduledStreams` | 3378 |
| `finishedStreams` | 3379 |
| `featuredStreams` | 3380 |
| `latestStream` | 3381 |
| `channelInitials` | 3382 |
| `roleName` | 3383 |
| `formatDate` | 3466 |
| `date` | 3469 |
| `location` | 3720 |
| `role` | 3721 |
| `isPodcasterArea` | 3722 |
| `links` | 3724 |
| `submit` | 3753 |
| `ownerMode` | 3903 |
| `addModerator` | 3905 |
| `cleanName` | 3908 |
| `next` | 3911 |
| `removeModerator` | 3917 |
| `next` | 3918 |


## Styled-components

| Nombre | Línea |
|---|---:|
| `AppFrame` | 4094 |
| `Topbar` | 4103 |
| `BrandLink` | 4122 |
| `SearchForm` | 4140 |
| `TopActions` | 4165 |
| `TopPopoverWrap` | 4172 |
| `DropdownPanel` | 4176 |
| `DropdownHeader` | 4190 |
| `DropdownItem` | 4204 |
| `NotificationMark` | 4234 |
| `DropdownMenuLoading` | 4242 |
| `DropdownMenuLink` | 4255 |
| `UnreadDot` | 4272 |
| `ShellGrid` | 4283 |
| `Sidebar` | 4301 |
| `SidebarSection` | 4315 |
| `SidebarTitle` | 4319 |
| `SidebarEmptyText` | 4327 |
| `SidebarLink` | 4335 |
| `ChannelMini` | 4360 |
| `MiniText` | 4382 |
| `ViewerDot` | 4403 |
| `MainArea` | 4409 |
| `RightRail` | 4418 |
| `HeroGrid` | 4424 |
| `HeroCopy` | 4436 |
| `Eyebrow` | 4458 |
| `HeroMedia` | 4468 |
| `FeaturedFlag` | 4480 |
| `HeroOverlay` | 4492 |
| `ButtonRow` | 4509 |
| `PrimaryLink` | 4517 |
| `GhostLink` | 4533 |
| `DangerLink` | 4548 |
| `PrimaryButton` | 4563 |
| `GhostButton` | 4579 |
| `DangerButton` | 4595 |
| `IconRound` | 4611 |
| `UserPill` | 4626 |
| `Avatar` | 4641 |
| `PromoPanel` | 4656 |
| `FilterRow` | 4671 |
| `FilterChip` | 4679 |
| `SectionBlock` | 4691 |
| `SectionHeader` | 4695 |
| `TextLink` | 4708 |
| `CardGrid` | 4714 |
| `ContentCard` | 4720 |
| `Thumb` | 4733 |
| `LiveBadge` | 4743 |
| `ViewBadge` | 4754 |
| `CardBody` | 4769 |
| `CardTitle` | 4773 |
| `MetaLine` | 4780 |
| `VerifiedDot` | 4790 |
| `Muted` | 4797 |
| `PodcastGrid` | 4803 |
| `PodcastTile` | 4809 |
| `PodcastCover` | 4821 |
| `RoundButton` | 4836 |
| `PageHeading` | 4849 |
| `Toolbar` | 4865 |
| `InputWrap` | 4876 |
| `Select` | 4895 |
| `CategoryGrid` | 4904 |
| `CategoryCard` | 4911 |
| `ChannelHero` | 4937 |
| `Tabs` | 4964 |
| `PlayerPanel` | 4971 |
| `VideoFrame` | 4975 |
| `VideoControls` | 4998 |
| `Progress` | 5011 |
| `StreamInfo` | 5026 |
| `InfoMain` | 5038 |
| `TagRow` | 5050 |
| `MetaTag` | 5057 |
| `InfoGrid` | 5070 |
| `Panel` | 5077 |
| `PanelHeader` | 5089 |
| `TwoCol` | 5103 |
| `ChatBox` | 5113 |
| `HeaderActionGroup` | 5122 |
| `ChatStatus` | 5132 |
| `ChatMessages` | 5143 |
| `ChatRow` | 5149 |
| `ChatBubble` | 5157 |
| `ChatName` | 5168 |
| `ChatActionButton` | 5191 |
| `ChatActionMenu` | 5206 |
| `ChatForm` | 5240 |
| `LoginNotice` | 5265 |
| `SidePanel` | 5272 |
| `SideListItem` | 5278 |
| `Divider` | 5298 |
| `ServicePill` | 5305 |
| `MetricGrid` | 5318 |
| `MetricCard` | 5325 |
| `AudioBar` | 5349 |
| `EpisodeRow` | 5362 |
| `AuthScreen` | 5384 |
| `AuthCard` | 5396 |
| `BrandBlock` | 5405 |
| `Label` | 5433 |
| `Field` | 5441 |
| `TextArea` | 5461 |
| `FormLine` | 5473 |
| `ChoiceGrid` | 5486 |
| `ChoiceButton` | 5493 |
| `SuccessBox` | 5503 |
| `NarrowPanel` | 5515 |
| `ProfileHeader` | 5523 |
| `MenuLine` | 5539 |
| `NotificationRow` | 5553 |
| `ProgressSteps` | 5576 |
| `ChannelDataPanel` | 5594 |
| `CreatorLayout` | 5619 |
| `CreatorSidebar` | 5629 |
| `CreatorMain` | 5637 |
| `QuickActions` | 5641 |
| `ModeratorToolbar` | 5648 |
| `ChartPanel` | 5660 |
| `UploadZone` | 5682 |
| `FormCard` | 5699 |
| `ToggleLine` | 5707 |
| `AlertPanel` | 5716 |
| `SkeletonGrid` | 5733 |
| `SkeletonCard` | 5739 |
| `StatePanel` | 5754 |
| `StateIcon` | 5773 |
| `DialogCard` | 5794 |
| `DangerIcon` | 5808 |
| `ServiceRow` | 5825 |
| `Table` | 5842 |
| `PermissionLine` | 5861 |


## Exports tipo const

_No encontrado._


## Reexports default encontrados

_No encontrado._


---

## Archivos que todavía dependen del legacy

| Archivo | Referencias |
|---|---:|
| `src/modules/account/pages/ChangePasswordPage.tsx` | 2 |
| `src/modules/account/pages/EditProfilePage.tsx` | 2 |
| `src/modules/account/pages/FollowingPage.tsx` | 2 |
| `src/modules/account/pages/NotificationsPage.tsx` | 2 |
| `src/modules/account/pages/ProfilePage.tsx` | 2 |
| `src/modules/account/pages/SettingsPage.tsx` | 2 |
| `src/modules/account/pages/SubscriptionsPage.tsx` | 2 |
| `src/modules/account/pages/UserMenuPage.tsx` | 2 |
| `src/modules/auth/pages/ForgotPasswordPage.tsx` | 2 |
| `src/modules/auth/pages/LoginPage.tsx` | 2 |
| `src/modules/auth/pages/RegisterPage.tsx` | 2 |
| `src/modules/auth/pages/ResetPasswordPage.tsx` | 2 |
| `src/modules/creator/podcaster/pages/CreatePodcastPage.tsx` | 2 |
| `src/modules/creator/podcaster/pages/DeleteEpisodePage.tsx` | 2 |
| `src/modules/creator/podcaster/pages/EditEpisodePage.tsx` | 2 |
| `src/modules/creator/podcaster/pages/EpisodesListPage.tsx` | 2 |
| `src/modules/creator/podcaster/pages/ManagePodcastPage.tsx` | 2 |
| `src/modules/creator/podcaster/pages/PodcasterDashboardPage.tsx` | 2 |
| `src/modules/creator/podcaster/pages/PodcastHistoryPage.tsx` | 2 |
| `src/modules/creator/podcaster/pages/PodcastStatsPage.tsx` | 2 |
| `src/modules/creator/podcaster/pages/UploadEpisodePage.tsx` | 2 |
| `src/modules/creator/shared/pages/CreatorActivatePage.tsx` | 2 |
| `src/modules/creator/shared/pages/CreatorDashboardPage.tsx` | 2 |
| `src/modules/creator/shared/pages/StatsRedirectPage.tsx` | 2 |
| `src/modules/creator/streamer/pages/CreateStreamPage.tsx` | 2 |
| `src/modules/creator/streamer/pages/EditChannelPage.tsx` | 2 |
| `src/modules/creator/streamer/pages/HighlightEditPage.tsx` | 2 |
| `src/modules/creator/streamer/pages/HighlightsPage.tsx` | 2 |
| `src/modules/creator/streamer/pages/HighlightUploadPage.tsx` | 2 |
| `src/modules/creator/streamer/pages/LiveControlPage.tsx` | 2 |
| `src/modules/creator/streamer/pages/StreamerDashboardPage.tsx` | 2 |
| `src/modules/creator/streamer/pages/StreamStatsPage.tsx` | 2 |
| `src/modules/interactions/pages/InteractionsPage.tsx` | 2 |
| `src/modules/mock/RootblendScreens.tsx` | 2 |
| `src/modules/moderation/pages/AssignModeratorPage.tsx` | 2 |
| `src/modules/moderation/pages/BlockUserPage.tsx` | 2 |
| `src/modules/moderation/pages/ConfirmModeratorPage.tsx` | 2 |
| `src/modules/moderation/pages/DeleteMessagePage.tsx` | 2 |
| `src/modules/moderation/pages/ModeratorAssignedPage.tsx` | 2 |
| `src/modules/moderation/pages/ModeratorDashboardPage.tsx` | 2 |
| `src/modules/moderation/pages/ModeratorPermissionsPage.tsx` | 2 |
| `src/modules/moderation/pages/ModeratorsListPage.tsx` | 2 |
| `src/modules/moderation/pages/SanctionsPage.tsx` | 2 |
| `src/modules/moderation/pages/SilenceUserPage.tsx` | 2 |
| `src/modules/podcasts/pages/PodcastDetailPage.tsx` | 2 |
| `src/modules/podcasts/pages/PodcastsPage.tsx` | 2 |
| `src/modules/public/pages/CategoriesPage.tsx` | 2 |
| `src/modules/public/pages/ChannelPage.tsx` | 2 |
| `src/modules/public/pages/ExploreStreamsPage.tsx` | 2 |
| `src/modules/public/pages/HomePage.tsx` | 2 |
| `src/modules/public/pages/SearchResultsPage.tsx` | 2 |
| `src/modules/streams/pages/ExploreStreamsPage.tsx` | 2 |
| `src/modules/streams/pages/StreamDetailPage.tsx` | 2 |
| `src/modules/streams/pages/StreamGuestPage.tsx` | 2 |
| `src/modules/streams/pages/StreamWithChatPage.tsx` | 2 |
| `src/modules/system/pages/AccessRestrictedPage.tsx` | 2 |
| `src/modules/system/pages/ConfirmDeletePage.tsx` | 2 |
| `src/modules/system/pages/EmptySearchPage.tsx` | 2 |
| `src/modules/system/pages/GatewayErrorPage.tsx` | 2 |
| `src/modules/system/pages/InvalidFilePage.tsx` | 2 |
| `src/modules/system/pages/LoadingDemoPage.tsx` | 2 |
| `src/modules/system/pages/NoStreamsPage.tsx` | 2 |
| `src/modules/system/pages/NotFoundPage.tsx` | 2 |
| `src/modules/system/pages/ServiceDownPage.tsx` | 2 |
| `src/modules/system/pages/SystemStatusPage.tsx` | 2 |
| `src/shared/layout/RootShell.tsx` | 2 |

---

## Recomendación de extracción

Orden recomendado:

1. Extraer helpers puros.
2. Extraer componentes visuales pequeños.
3. Extraer HomePage.
4. Extraer Auth.
5. Extraer Streams.
6. Extraer Podcasts.
7. Extraer Account / Creator / System / Moderation.
8. Eliminar `RootblendScreens.legacy.tsx`.

## Regla

No borrar el legacy hasta que no queden referencias productivas.
