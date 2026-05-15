export function toBrowserReachableUrl(url?: string | null) {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);
    const currentHostname = window.location.hostname;

    const isLocalBackendHost =
      parsedUrl.hostname === "localhost" ||
      parsedUrl.hostname === "127.0.0.1" ||
      parsedUrl.hostname === "0.0.0.0";

    const browserIsRemote =
      currentHostname !== "localhost" &&
      currentHostname !== "127.0.0.1";

    if (isLocalBackendHost && browserIsRemote) {
      parsedUrl.hostname = currentHostname;
      return parsedUrl.toString();
    }

    return url;
  } catch {
    return url;
  }
}