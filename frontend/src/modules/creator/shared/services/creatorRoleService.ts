export type CreatorRole = "streamer" | "podcaster";

const CREATOR_ROLE_KEY = "creator_role";

export function getCreatorRole(): CreatorRole | null {
  const role = localStorage.getItem(CREATOR_ROLE_KEY);

  if (role === "streamer" || role === "podcaster") {
    return role;
  }

  return null;
}

export function setCreatorRole(role: CreatorRole) {
  localStorage.setItem(CREATOR_ROLE_KEY, role);
  window.dispatchEvent(new Event("creator-role-changed"));
}

export function clearCreatorRole() {
  localStorage.removeItem(CREATOR_ROLE_KEY);
  window.dispatchEvent(new Event("creator-role-changed"));
}

export function getCreatorDashboardPath(role: CreatorRole | null) {
  if (role === "podcaster") return "/creator/podcaster/dashboard";
  return "/creator/streamer/dashboard";
}