export function validateStream(stream) {
  return fetch(stream.url, { method: "HEAD" })
    .then(res => {
      const ok =
        res.ok &&
        (res.headers.get("content-type")?.includes("mpegurl") ||
         res.headers.get("content-type")?.includes("video") ||
         res.status === 200);

      return { ...stream, status: ok ? "live" : "dead" };
    })
    .catch(() => ({ ...stream, status: "dead" }));
}

export function classifyStream(stream) {
  const n = stream.name.toLowerCase();

  if (n.includes("news")) return "news";
  if (n.includes("sport")) return "sports";
  if (n.includes("movie")) return "movies";
  if (n.includes("music")) return "music";

  return "other";
}
