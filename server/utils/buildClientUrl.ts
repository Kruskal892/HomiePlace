export const buildClientUrl = (path: string): string => {
  const clientUrl = new URL(process.env.CLIENT_URL ?? "");
  const localHttp =
    clientUrl.protocol === "http:" &&
    ["localhost", "127.0.0.1", "[::1]"].includes(clientUrl.hostname) &&
    process.env.NODE_ENV !== "production";
  if (
    (!localHttp && clientUrl.protocol !== "https:") ||
    clientUrl.username ||
    clientUrl.password ||
    clientUrl.search ||
    clientUrl.hash ||
    clientUrl.pathname !== "/"
  ) {
    throw new Error(
      "CLIENT_URL must be a trusted HTTPS origin (HTTP loopback is allowed in development).",
    );
  }

  const url = new URL(path, clientUrl);
  if (url.origin !== clientUrl.origin || url.username || url.password) {
    throw new Error("Client links must stay on the configured CLIENT_URL origin.");
  }
  return url.href;
};
