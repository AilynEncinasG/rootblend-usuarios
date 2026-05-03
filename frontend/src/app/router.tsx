import { type ReactNode, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthOnlyRoute, ProtectedRoute } from "./routeGuards";
import { getMyChannel, type Canal } from "../modules/streams/services/streamsService";

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

const MODERATORS_KEY = "rootblend:moderators:cyberpunk-2077";

type CreatorRole = "streamer" | "podcaster";

function getChannelRole(channel?: Canal | null): CreatorRole | null {
  const role = channel?.tipo_canal?.nombre_tipo;
  return role === "streamer" || role === "podcaster" ? role : null;
}

function syncCreatorRole(role: CreatorRole | null) {
  if (role) {
    localStorage.setItem("creator_role", role);
  } else {
    localStorage.removeItem("creator_role");
  }

  window.dispatchEvent(new Event("creator-role-changed"));
}

function getRouteUserLabel() {
  const rawUser = localStorage.getItem("auth_user");

  if (!rawUser) return "usuario_123";

  try {
    const user = JSON.parse(rawUser) as { nombre_visible?: string; correo?: string };
    return user.nombre_visible || user.correo || "usuario_123";
  } catch {
    return "usuario_123";
  }
}

function getRouteModerators() {
  const stored = localStorage.getItem(MODERATORS_KEY);

  if (!stored) return ["GamerX", "PixelKing", "LunaVibes"];

  try {
    const parsed = JSON.parse(stored) as string[];
    return Array.isArray(parsed) ? parsed : ["GamerX", "PixelKing", "LunaVibes"];
  } catch {
    return ["GamerX", "PixelKing", "LunaVibes"];
  }
}

function Private({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

function GuestOnly({ children }: { children: ReactNode }) {
  return <AuthOnlyRoute>{children}</AuthOnlyRoute>;
}

function RouteLoading() {
  return null;
}

function CreatorRoute({
  role,
  children,
}: {
  role: CreatorRole;
  children: ReactNode;
}) {
  const cachedRole = localStorage.getItem("creator_role") as CreatorRole | null;

  const [loading, setLoading] = useState(!cachedRole);
  const [currentRole, setCurrentRole] = useState<CreatorRole | null>(
    cachedRole === "streamer" || cachedRole === "podcaster" ? cachedRole : null
  );
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadRole() {
      setFailed(false);

      try {
        const result = await getMyChannel();

        if (!active) return;

        const backendRole = getChannelRole(result.canal);

        syncCreatorRole(backendRole);
        setCurrentRole(backendRole);
      } catch (error) {
        console.error("CREATOR_ROUTE_ERROR", error);

        if (!active) return;

        const fallbackRole = localStorage.getItem("creator_role");

        if (fallbackRole === "streamer" || fallbackRole === "podcaster") {
          setCurrentRole(fallbackRole);
          setFailed(false);
        } else {
          syncCreatorRole(null);
          setCurrentRole(null);
          setFailed(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRole();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <RouteLoading />;
  }

  if (failed || !currentRole) {
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

function StreamerRoute({ children }: { children: ReactNode }) {
  return (
    <Private>
      <CreatorRoute role="streamer">{children}</CreatorRoute>
    </Private>
  );
}

function PodcasterRoute({ children }: { children: ReactNode }) {
  return (
    <Private>
      <CreatorRoute role="podcaster">{children}</CreatorRoute>
    </Private>
  );
}

function ModeratorRoute({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isStreamerOwner, setIsStreamerOwner] = useState(false);
  const moderators = getRouteModerators();
  const userLabel = getRouteUserLabel();
  const canModerate = isStreamerOwner || moderators.includes(userLabel);

  useEffect(() => {
    let active = true;

    async function loadOwnerStatus() {
      setLoading(true);

      try {
        const result = await getMyChannel();
        if (!active) return;

        const role = getChannelRole(result.canal);
        syncCreatorRole(role);
        setIsStreamerOwner(role === "streamer");
      } catch {
        if (active) setIsStreamerOwner(false);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOwnerStatus();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <Private><RouteLoading /></Private>;
  }

  return <Private>{canModerate ? children : <Navigate to="/restricted" replace />}</Private>;
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
      <Route path="/creator/streamer" element={<StreamerRoute><StreamerDashboardPage /></StreamerRoute>} />
      <Route path="/creator/streamer/dashboard" element={<StreamerRoute><StreamerDashboardPage /></StreamerRoute>} />
      <Route path="/creator/streamer/create-stream" element={<StreamerRoute><CreateStreamPage /></StreamerRoute>} />
      <Route path="/creator/streamer/streams/new" element={<StreamerRoute><CreateStreamPage /></StreamerRoute>} />
      <Route path="/creator/streamer/control" element={<StreamerRoute><LiveControlPage /></StreamerRoute>} />
      <Route path="/creator/streamer/live-control" element={<StreamerRoute><LiveControlPage /></StreamerRoute>} />
      <Route path="/creator/streamer/channel" element={<StreamerRoute><EditChannelPage /></StreamerRoute>} />
      <Route path="/creator/streamer/channel/edit" element={<StreamerRoute><EditChannelPage /></StreamerRoute>} />
      <Route path="/creator/streamer/stats" element={<StreamerRoute><StreamStatsPage /></StreamerRoute>} />
      <Route path="/creator/streamer/highlights" element={<StreamerRoute><HighlightsPage /></StreamerRoute>} />
      <Route path="/creator/streamer/highlights/new" element={<StreamerRoute><HighlightUploadPage /></StreamerRoute>} />
      <Route path="/creator/streamer/highlights/:highlightId/edit" element={<StreamerRoute><HighlightEditPage /></StreamerRoute>} />

      <Route path="/creator/podcaster" element={<PodcasterRoute><PodcasterDashboardPage /></PodcasterRoute>} />
      <Route path="/creator/podcaster/dashboard" element={<PodcasterRoute><PodcasterDashboardPage /></PodcasterRoute>} />
      <Route path="/creator/podcaster/create-podcast" element={<PodcasterRoute><CreatePodcastPage /></PodcasterRoute>} />
      <Route path="/creator/podcaster/podcasts/new" element={<PodcasterRoute><CreatePodcastPage /></PodcasterRoute>} />
      <Route path="/creator/podcaster/podcasts/:podcastId/manage" element={<PodcasterRoute><ManagePodcastPage /></PodcasterRoute>} />
      <Route path="/creator/podcaster/podcasts/:podcastId" element={<PodcasterRoute><ManagePodcastPage /></PodcasterRoute>} />
      <Route path="/creator/podcaster/episodes/new" element={<PodcasterRoute><UploadEpisodePage /></PodcasterRoute>} />
      <Route path="/creator/podcaster/episodes" element={<PodcasterRoute><EpisodesListPage /></PodcasterRoute>} />
      <Route path="/creator/podcaster/stats" element={<PodcasterRoute><PodcastStatsPage /></PodcasterRoute>} />
      <Route path="/creator/podcaster/history" element={<PodcasterRoute><PodcastHistoryPage /></PodcasterRoute>} />
      <Route path="/creator/podcaster/episodes/:episodeId/edit" element={<PodcasterRoute><EditEpisodePage /></PodcasterRoute>} />
      <Route path="/creator/podcaster/episodes/:episodeId/delete" element={<PodcasterRoute><DeleteEpisodePage /></PodcasterRoute>} />

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

      <Route path="/moderation/assign" element={<ModeratorRoute><AssignModeratorPage /></ModeratorRoute>} />
      <Route path="/moderation/assign/confirm" element={<ModeratorRoute><ConfirmModeratorPage /></ModeratorRoute>} />
      <Route path="/moderation/assigned" element={<ModeratorRoute><ModeratorAssignedPage /></ModeratorRoute>} />
      <Route path="/moderation/moderators" element={<ModeratorRoute><ModeratorsListPage /></ModeratorRoute>} />
      <Route path="/moderation/delete-message" element={<ModeratorRoute><DeleteMessagePage /></ModeratorRoute>} />
      <Route path="/moderation/silence" element={<ModeratorRoute><SilenceUserPage /></ModeratorRoute>} />
      <Route path="/moderation/block" element={<ModeratorRoute><BlockUserPage /></ModeratorRoute>} />
      <Route path="/moderation/sanctions" element={<ModeratorRoute><SanctionsPage /></ModeratorRoute>} />
      <Route path="/moderation" element={<ModeratorRoute><ModeratorDashboardPage /></ModeratorRoute>} />
      <Route path="/moderation/permissions" element={<ModeratorRoute><ModeratorPermissionsPage /></ModeratorRoute>} />

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
