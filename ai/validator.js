import fetch from "node-fetch";

export async function validateStream(stream) {
  try {
    const res = await fetch(stream.url, { method: "HEAD" });

    const valid =
      res.ok &&
      (res.headers.get("content-type")?.includes("video") ||
        res.headers.get("content-type")?.includes("mpegurl") ||
        res.status === 200);

    return {
      ...stream,
      status: valid ? "live" : "dead"
    };
  } catch (e) {
    return {
      ...stream,
      status: "dead"
    };
  }
}
