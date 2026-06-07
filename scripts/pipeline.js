import fs from "fs";
import { selfHeal } from "./selfHeal.js";
import { validateStream } from "../ai/validator.js";
import { classifyStream } from "../ai/classifier.js";

// 🔧 RUN SELF-HEAL FIRST
selfHeal();

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
  console.log("🚀 Running AI pipeline...");

  for (const category of Object.keys(registry)) {
    for (const stream of registry[category]) {
      const validated = await validateStream(stream);

      if (validated.status === "live") {
        const cat = classifyStream(validated);

        if (!results[cat]) results[cat] = [];
        results[cat].push(validated);
      }
    }
  }

  fs.writeFileSync("./db/streams.json", JSON.stringify(results, null, 2));

  console.log("✅ Pipeline complete");
}

run();
