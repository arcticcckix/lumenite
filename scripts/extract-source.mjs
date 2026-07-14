// Extracts raw source of every library component into a JSON map used by the
// "Code" tab on component pages. Runs before dev/build (see package.json).
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const libDir = join(root, "src/components/library");
const outFile = join(root, "src/lib/registry/source.json");

const map = {};
for (const f of readdirSync(libDir).filter((f) => f.endsWith(".tsx"))) {
  const slug = f.replace(/\.tsx$/, "");
  map[slug] = readFileSync(join(libDir, f), "utf8");
}

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(map, null, 0));
console.log(`extract-source: ${Object.keys(map).length} components → source.json`);
