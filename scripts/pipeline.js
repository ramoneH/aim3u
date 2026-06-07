import fs from "fs";
import * as AI from "./aiCore.js";

if (!fs.existsSync("./db")) fs.mkdirSync("./db");
if (!fs.existsSync("./output")) fs.mkdirSync("./output");

const registry = JSON.parse(
  fs.readFileSync("./sources/registry.json", "utf8")
);

let results = {
  news: [],
  sports: [],
  movies: [],
  music: [],
  other: []
};

async function run() {
  console.log("🚀 AI pipeline starting (path-free mode)");

  for (const category of Object.keys(registry)) {
    for (const stream of registry[category]) {
      const validated = await AI.validateStream(stream);

      if (validated.status === "live") {
        const cat = AI.classifyStream(validated);

        results[cat].push(validated);
      }
    }
  }

  fs.writeFileSync(
    "./db/streams.json",
    JSON.stringify(results, null, 2)
  );

  console.log("✅ Pipeline complete");
}

run();
