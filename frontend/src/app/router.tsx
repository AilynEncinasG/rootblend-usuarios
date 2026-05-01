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
import ResetPasswordPage from "../modules/auth/pages/ResetPasswordPage";

import UserMenuPage from "../modules/account/pages/UserMenuPage";
import ProfilePage from "../modules/account/pages/ProfilePage";
import EditProfilePage from "../modules/account/pages/EditProfilePage";
import SettingsPage from "../modules/account/pages/SettingsPage";
import ChangePasswordPage from "../modules/account/pages/ChangePasswordPage";
import NotificationsPage from "../modules/account/pages/NotificationsPage";
import SubscriptionsPage from "../modules/account/pages/SubscriptionsPage";
import FollowingPage from "../modules/account/pages/FollowingPage";

import CreatorActivatePage from "../modules/creator/shared/CreatorActivatePage";
import CreatorDashboardRedirectPage from "../modules/creator/shared/CreatorDashboardRedirectPage";
import StatsRedirectPage from "../modules/creator/shared/StatsRedirectPage";
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

function CreatorOnly({
  role,
  children,
}: {
  role: "streamer" | "podcaster";
  children: ReactNode;
}) {
  const currentRole = localStorage.getItem("creator_role");

  if (currentRole !== "streamer" && currentRole !== "podcaster") {
    return <Navigate to="/creator/activate" replace />;
  }

  if (currentRole !== role) {
    return (
      <Navigate
        to={currentRole === "streamer" ? "/creator/streamer" : "/creator/podcaster"}
        replace
      />
    );
  }

  return <>{children}</>;
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
      <Route path="/reset-password" element={<GuestOnly><ResetPasswordPage /></GuestOnly>} />
      <Route path="/reset-password/:token" element={<GuestOnly><ResetPasswordPage /></GuestOnly>} />

      <Route path="/account/menu" element={<Private><UserMenuPage /></Private>} />
      <Route path="/profile" element={<Private><ProfilePage /></Private>} />
      <Route path="/profile/edit" element={<Private><EditProfilePage /></Private>} />
      <Route path="/settings" element={<Private><SettingsPage /></Private>} />
      <Route path="/change-password" element={<Private><ChangePasswordPage /></Private>} />
      <Route path="/notifications" element={<Private><NotificationsPage /></Private>} />
      <Route path="/following" element={<Private><FollowingPage /></Private>} />
      <Route path="/subscriptions" element={<Private><SubscriptionsPage /></Private>} />

      <Route path="/creator/activate" element={<Private><CreatorActivatePage /></Private>} />
      <Route path="/creator/dashboard" element={<Private><CreatorDashboardRedirectPage /></Private>} />
      <Route path="/stats" element={<Private><StatsRedirectPage /></Private>} />
      <Route path="/creator/streamer" element={<Private><CreatorOnly role="streamer"><StreamerDashboardPage /></CreatorOnly></Private>} />
      <Route path="/creator/streamer/dashboard" element={<Private><CreatorOnly role="streamer"><StreamerDashboardPage /></CreatorOnly></Private>} />
      <Route path="/creator/streamer/create-stream" element={<Private><CreatorOnly role="streamer"><CreateStreamPage /></CreatorOnly></Private>} />
      <Route path="/creator/streamer/streams/new" element={<Private><CreatorOnly role="streamer"><CreateStreamPage /></CreatorOnly></Private>} />
      <Route path="/creator/streamer/control" element={<Private><CreatorOnly role="streamer"><LiveControlPage /></CreatorOnly></Private>} />
      <Route path="/creator/streamer/live-control" element={<Private><CreatorOnly role="streamer"><LiveControlPage /></CreatorOnly></Private>} />
      <Route path="/creator/streamer/channel" element={<Private><CreatorOnly role="streamer"><EditChannelPage /></CreatorOnly></Private>} />
      <Route path="/creator/streamer/channel/edit" element={<Private><CreatorOnly role="streamer"><EditChannelPage /></CreatorOnly></Private>} />
      <Route path="/creator/streamer/stats" element={<Private><CreatorOnly role="streamer"><StreamStatsPage /></CreatorOnly></Private>} />
      <Route path="/creator/streamer/highlights" element={<Private><CreatorOnly role="streamer"><HighlightsPage /></CreatorOnly></Private>} />
      <Route path="/creator/streamer/highlights/new" element={<Private><CreatorOnly role="streamer"><HighlightUploadPage /></CreatorOnly></Private>} />
      <Route path="/creator/streamer/highlights/:highlightId/edit" element={<Private><CreatorOnly role="streamer"><HighlightEditPage /></CreatorOnly></Private>} />

      <Route path="/creator/podcaster" element={<Private><CreatorOnly role="podcaster"><PodcasterDashboardPage /></CreatorOnly></Private>} />
      <Route path="/creator/podcaster/dashboard" element={<Private><CreatorOnly role="podcaster"><PodcasterDashboardPage /></CreatorOnly></Private>} />
      <Route path="/creator/podcaster/create-podcast" element={<Private><CreatorOnly role="podcaster"><CreatePodcastPage /></CreatorOnly></Private>} />
      <Route path="/creator/podcaster/podcasts/new" element={<Private><CreatorOnly role="podcaster"><CreatePodcastPage /></CreatorOnly></Private>} />
      <Route path="/creator/podcaster/podcasts/:podcastId/manage" element={<Private><CreatorOnly role="podcaster"><ManagePodcastPage /></CreatorOnly></Private>} />
      <Route path="/creator/podcaster/podcasts/:podcastId" element={<Private><CreatorOnly role="podcaster"><ManagePodcastPage /></CreatorOnly></Private>} />
      <Route path="/creator/podcaster/episodes/new" element={<Private><CreatorOnly role="podcaster"><UploadEpisodePage /></CreatorOnly></Private>} />
      <Route path="/creator/podcaster/episodes" element={<Private><CreatorOnly role="podcaster"><EpisodesListPage /></CreatorOnly></Private>} />
      <Route path="/creator/podcaster/stats" element={<Private><CreatorOnly role="podcaster"><PodcastStatsPage /></CreatorOnly></Private>} />
      <Route path="/creator/podcaster/history" element={<Private><CreatorOnly role="podcaster"><PodcastHistoryPage /></CreatorOnly></Private>} />
      <Route path="/creator/podcaster/episodes/:episodeId/edit" element={<Private><CreatorOnly role="podcaster"><EditEpisodePage /></CreatorOnly></Private>} />
      <Route path="/creator/podcaster/episodes/:episodeId/delete" element={<Private><CreatorOnly role="podcaster"><DeleteEpisodePage /></CreatorOnly></Private>} />

      <Route path="/interactions" element={<Private><InteractionsPage /></Private>} />

      <Route path="/loading" element={<LoadingDemoPage />} />
      <Route path="/loading-demo" element={<LoadingDemoPage />} />
      <Route path="/empty/streams" element={<NoStreamsPage />} />
      <Route path="/no-streams" element={<NoStreamsPage />} />
      <Route path="/empty/search" element={<EmptySearchPage />} />
      <Route path="/empty-search" element={<EmptySearchPage />} />
      <Route path="/partial-unavailable" element={<ServiceDownPage />} />
      <Route path="/service-down" element={<ServiceDownPage />} />
      <Route path="/502" element={<GatewayErrorPage />} />
      <Route path="/gateway-error" element={<GatewayErrorPage />} />
      <Route path="/confirm-delete" element={<ConfirmDeletePage />} />
      <Route path="/invalid-file" element={<InvalidFilePage />} />
      <Route path="/restricted" element={<AccessRestrictedPage />} />
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
