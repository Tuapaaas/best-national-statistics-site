// NusaData — hand-in program for the best-national-statistics-site bounty.
// Node 22, standard library only. It takes this repository's app/ (the site)
// and screenshots/ (its renders) and hands them to the grader: both folders
// are copied into the output directory and a dossier.json is written there
// with the vendored make.fun library, so the judge can read the site's text
// and screenshots. Run it as `MAKEFUN_OUTPUT_DIR=out node main.ts`; in the
// grader's container /output is used instead. The run is deterministic: the
// same repository always produces the same bytes.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const appDir = join(repoRoot, "app");
const shotsDir = join(repoRoot, "screenshots");

if (!existsSync(appDir)) throw new Error("app/ is missing from the repository");
if (!existsSync(join(appDir, "index.html"))) throw new Error("app/index.html is missing");

mkdirSync(outDir, { recursive: true });
cpSync(appDir, join(outDir, "app"), { recursive: true });
mkdirSync(join(outDir, "screenshots"), { recursive: true });
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outDir, "screenshots"), { recursive: true });
}

writeFileSync(
  join(outDir, "dossier.json"),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

// Verify the hand-in before reporting success: the dossier must parse, and
// every screenshot must be within the gate's size cap. A broken hand-in
// should fail loudly here, not silently on the server.
const dossier = JSON.parse(readFileSync(join(outDir, "dossier.json"), "utf8"));
if (dossier.schema !== "makefun/dossier/v1") throw new Error("dossier.json has an unexpected schema");
const shotNames = readdirSync(join(outDir, "screenshots")).filter((n) => !n.startsWith("."));
if (shotNames.length < 3 || shotNames.length > 4) {
  throw new Error(`expected 3 or 4 screenshots, found ${shotNames.length}`);
}
for (const name of shotNames) {
  const size = statSync(join(outDir, "screenshots", name)).size;
  if (size > 262144) throw new Error(`screenshot ${name} is ${size} bytes, over the 256 KiB cap`);
}
console.log(
  `hand-in written to ${outDir}: app/ + ${shotNames.length} screenshots + dossier.json (${statSync(join(outDir, "dossier.json")).size} bytes)`,
);
