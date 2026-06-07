import fs from "fs";

const REQUIRED_DIRS = [
  "ai",
  "scripts",
  "sources",
  "db",
  "output"
];

const REQUIRED_FILES = [
  {
    path: "ai/validator.js",
    content: `
export async function validateStream(stream) {
  try {
    const res = await fetch(stream.url, { method: "HEAD" });

    const ok =
      res.ok &&
      (res.headers.get("content-type")?.includes("mpegurl") ||
       res.headers.get("content-type")?.includes("video") ||
       res.status === 200);

    return { ...stream, status: ok ? "live" : "dead" };
  } catch {
    return { ...stream, status: "dead" };
  }
}
`.trim()
  },
  {
    path: "ai/classifier.js",
    content: `
export function classifyStream(stream) {
  const n = stream.name.toLowerCase();

  if (n.includes("news")) return "news";
  if (n.includes("sport")) return "sports";
  if (n.includes("movie")) return "movies";
  if (n.includes("music")) return "music";

  return "other";
}
`.trim()
  }
];

export function selfHeal() {
  console.log("🧠 Running self-healing preflight...");

  // 1. Ensure folders exist
  for (const dir of REQUIRED_DIRS) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created missing folder: ${dir}`);
    }
  }

  // 2. Ensure files exist
  for (const file of REQUIRED_FILES) {
    if (!fs.existsSync(file.path)) {
      fs.writeFileSync(file.path, file.content, "utf8");
      console.log(`🛠️ Rebuilt missing file: ${file.path}`);
    }
  }

  // 3. Ensure db/output safety
  if (!fs.existsSync("db/streams.json")) {
    fs.writeFileSync("db/streams.json", "{}", "utf8");
  }

  console.log("✅ Self-heal complete");
}
