export function classifyStream(stream) {
  const name = stream.name.toLowerCase();

  if (name.includes("news")) return "news";
  if (name.includes("sport")) return "sports";
  if (name.includes("movie")) return "movies";
  if (name.includes("edu")) return "education";

  return "uncategorized";
}
