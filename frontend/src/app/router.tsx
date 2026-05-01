import { Navigate, Route, Routes } from "react-router-dom";
import { type ReactNode } from "react";
import { AuthOnlyRoute, ProtectedRoute } from "./routeGuards";

import HomePage from "../modules/public/pages/HomePage";
import ExploreStreamsPage from "../modules/streams/pages/ExploreStreamsPage";
import CategoriesPage from "../modules/public/pages/CategoriesPage";
import SearchResultsPage from "../modules/public/pages/SearchResultsPage";
import ChannelPage from "../modules/public/pages/ChannelPage";
import StreamDetailPage from "../modules/streams/pages/StreamDetailPage";
import StreamWithChatPage from "../modules/streams/pages/StreamWithChatPage";
import StreamGuestPage from "../modules/streams/pages/StreamGuestPage";
import PodcastsPage from "../modules/podcasts/pages/PodcastsPage";
import PodcastDetailPage from "../modules/podcasts/pages/PodcastDetailPage";

import LoginPage from "../modules/auth/pages/LoginPage";
import RegisterPage from "../modules/auth/pages/RegisterPage";
import ForgotPasswordPage from "../modules/auth/pages/ForgotPasswordPage";

import UserMenuPage from "../modules/account/pages/UserMenuPage";
import ProfilePage from "../modules/account/pages/ProfilePage";
import EditProfilePage from "../modules/account/pages/EditProfilePage";
import SettingsPage from "../modules/account/pages/SettingsPage";
import ChangePasswordPage from "../modules/account/pages/ChangePasswordPage";
import NotificationsPage from "../modules/account/pages/NotificationsPage";
import SubscriptionsPage from "../modules/account/pages/SubscriptionsPage";

import CreatorActivatePage from "../modules/creator/shared/CreatorActivatePage";
import CreatorDashboardRedirectPage from "../modules/creator/shared/CreatorDashboardRedirectPage";
import StreamerDashboardPage from "../modules/creator/streamer/pages/StreamerDashboardPage";
import CreateStreamPage from "../modules/creator/streamer/pages/CreateStreamPage";
import LiveControlPage from "../modules/creator/streamer/pages/LiveControlPage";
import EditChannelPage from "../modules/creator/streamer/pages/EditChannelPage";
import StreamStatsPage from "../modules/creator/streamer/pages/StreamStatsPage";
import HighlightsPage from "../modules/creator/streamer/pages/HighlightsPage";
import HighlightUploadPage from "../modules/creator/streamer/pages/HighlightUploadPage";
import HighlightEditPage from "../modules/creator/streamer/pages/HighlightEditPage";

import PodcasterDashboardPage from "../modules/creator/podcaster/pages/PodcasterDashboardPage";
import CreatePodcastPage from "../modules/creator/podcaster/pages/CreatePodcastPage";
import ManagePodcastPage from "../modules/creator/podcaster/pages/ManagePodcastPage";
import UploadEpisodePage from "../modules/creator/podcaster/pages/UploadEpisodePage";
import EpisodesListPage from "../modules/creator/podcaster/pages/EpisodesListPage";
import PodcastStatsPage from "../modules/creator/podcaster/pages/PodcastStatsPage";
import PodcastHistoryPage from "../modules/creator/podcaster/pages/PodcastHistoryPage";
import EditEpisodePage from "../modules/creator/podcaster/pages/EditEpisodePage";
import DeleteEpisodePage from "../modules/creator/podcaster/pages/DeleteEpisodePage";

import InteractionsPage from "../modules/interactions/pages/InteractionsPage";

import LoadingDemoPage from "../modules/system/pages/LoadingDemoPage";
import NoStreamsPage from "../modules/system/pages/NoStreamsPage";
import EmptySearchPage from "../modules/system/pages/EmptySearchPage";
import ServiceDownPage from "../modules/system/pages/ServiceDownPage";
import GatewayErrorPage from "../modules/system/pages/GatewayErrorPage";
import ConfirmDeletePage from "../modules/system/pages/ConfirmDeletePage";
import InvalidFilePage from "../modules/system/pages/InvalidFilePage";
import AccessRestrictedPage from "../modules/system/pages/AccessRestrictedPage";
import NotFoundPage from "../modules/system/pages/NotFoundPage";
import SystemStatusPage from "../modules/system/pages/SystemStatusPage";

import AssignModeratorPage from "../modules/moderation/pages/AssignModeratorPage";
import ConfirmModeratorPage from "../modules/moderation/pages/ConfirmModeratorPage";
import ModeratorAssignedPage from "../modules/moderation/pages/ModeratorAssignedPage";
import ModeratorsListPage from "../modules/moderation/pages/ModeratorsListPage";
import DeleteMessagePage from "../modules/moderation/pages/DeleteMessagePage";
import SilenceUserPage from "../modules/moderation/pages/SilenceUserPage";
import BlockUserPage from "../modules/moderation/pages/BlockUserPage";
import SanctionsPage from "../modules/moderation/pages/SanctionsPage";
import ModeratorDashboardPage from "../modules/moderation/pages/ModeratorDashboardPage";
import ModeratorPermissionsPage from "../modules/moderation/pages/ModeratorPermissionsPage";

function Private({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

function GuestOnly({ children }: { children: ReactNode }) {
  return <AuthOnlyRoute>{children}</AuthOnlyRoute>;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/streams" element={<ExploreStreamsPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/channels/:channelId" element={<ChannelPage />} />
      <Route path="/channels/:channelId/streamer" element={<ChannelPage />} />
      <Route path="/streams/:streamId" element={<StreamDetailPage />} />
      <Route path="/streams/:streamId/chat" element={<StreamWithChatPage />} />
      <Route path="/streams/:streamId/guest" element={<StreamGuestPage />} />
      <Route path="/podcasts" element={<PodcastsPage />} />
      <Route path="/podcasts/:podcastId" element={<PodcastDetailPage />} />

      <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />
      <Route path="/forgot-password" element={<GuestOnly><ForgotPasswordPage /></GuestOnly>} />

      <Route path="/account/menu" element={<Private><UserMenuPage /></Private>} />
      <Route path="/profile" element={<Private><ProfilePage /></Private>} />
      <Route path="/profile/edit" element={<Private><EditProfilePage /></Private>} />
      <Route path="/settings" element={<Private><SettingsPage /></Private>} />
      <Route path="/change-password" element={<Private><ChangePasswordPage /></Private>} />
      <Route path="/notifications" element={<Private><NotificationsPage /></Private>} />
      <Route path="/subscriptions" element={<Private><SubscriptionsPage /></Private>} />

      <Route path="/creator/activate" element={<Private><CreatorActivatePage /></Private>} />
      <Route path="/creator/dashboard" element={<Private><CreatorDashboardRedirectPage /></Private>} />
      <Route path="/creator/streamer/dashboard" element={<Private><StreamerDashboardPage /></Private>} />
      <Route path="/creator/streamer/streams/new" element={<Private><CreateStreamPage /></Private>} />
      <Route path="/creator/streamer/live-control" element={<Private><LiveControlPage /></Private>} />
      <Route path="/creator/streamer/channel/edit" element={<Private><EditChannelPage /></Private>} />
      <Route path="/creator/streamer/stats" element={<Private><StreamStatsPage /></Private>} />
      <Route path="/creator/streamer/highlights" element={<Private><HighlightsPage /></Private>} />
      <Route path="/creator/streamer/highlights/new" element={<Private><HighlightUploadPage /></Private>} />
      <Route path="/creator/streamer/highlights/:highlightId/edit" element={<Private><HighlightEditPage /></Private>} />

      <Route path="/creator/podcaster/dashboard" element={<Private><PodcasterDashboardPage /></Private>} />
      <Route path="/creator/podcaster/podcasts/new" element={<Private><CreatePodcastPage /></Private>} />
      <Route path="/creator/podcaster/podcasts/:podcastId" element={<Private><ManagePodcastPage /></Private>} />
      <Route path="/creator/podcaster/episodes/new" element={<Private><UploadEpisodePage /></Private>} />
      <Route path="/creator/podcaster/episodes" element={<Private><EpisodesListPage /></Private>} />
      <Route path="/creator/podcaster/stats" element={<Private><PodcastStatsPage /></Private>} />
      <Route path="/creator/podcaster/history" element={<Private><PodcastHistoryPage /></Private>} />
      <Route path="/creator/podcaster/episodes/:episodeId/edit" element={<Private><EditEpisodePage /></Private>} />
      <Route path="/creator/podcaster/episodes/:episodeId/delete" element={<Private><DeleteEpisodePage /></Private>} />

      <Route path="/interactions" element={<Private><InteractionsPage /></Private>} />

      <Route path="/loading-demo" element={<LoadingDemoPage />} />
      <Route path="/no-streams" element={<NoStreamsPage />} />
      <Route path="/empty-search" element={<EmptySearchPage />} />
      <Route path="/service-down" element={<ServiceDownPage />} />
      <Route path="/gateway-error" element={<GatewayErrorPage />} />
      <Route path="/confirm-delete" element={<ConfirmDeletePage />} />
      <Route path="/invalid-file" element={<InvalidFilePage />} />
      <Route path="/access-restricted" element={<AccessRestrictedPage />} />
      <Route path="/system-status" element={<SystemStatusPage />} />

      <Route path="/moderation/assign" element={<Private><AssignModeratorPage /></Private>} />
      <Route path="/moderation/assign/confirm" element={<Private><ConfirmModeratorPage /></Private>} />
      <Route path="/moderation/assigned" element={<Private><ModeratorAssignedPage /></Private>} />
      <Route path="/moderation/moderators" element={<Private><ModeratorsListPage /></Private>} />
      <Route path="/moderation/delete-message" element={<Private><DeleteMessagePage /></Private>} />
      <Route path="/moderation/silence" element={<Private><SilenceUserPage /></Private>} />
      <Route path="/moderation/block" element={<Private><BlockUserPage /></Private>} />
      <Route path="/moderation/sanctions" element={<Private><SanctionsPage /></Private>} />
      <Route path="/moderation" element={<Private><ModeratorDashboardPage /></Private>} />
      <Route path="/moderation/permissions" element={<Private><ModeratorPermissionsPage /></Private>} />

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
