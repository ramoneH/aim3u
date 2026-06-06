import fs from "fs";

const db = JSON.parse(fs.readFileSync("./db/streams.json", "utf8"));

function build(category, items) {
  let out = "#EXTM3U\n";

  items.forEach(i => {
    out += `#EXTINF:-1,${i.name}\n`;
    out += `${i.url}\n`;
  });

  return out;
}

Object.keys(db).forEach(cat => {
  const m3u = build(cat, db[cat]);
  fs.writeFileSync(`./output/${cat}.m3u`, m3u);
});

console.log("M3U files built.");
