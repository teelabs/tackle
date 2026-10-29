import { readFileSync } from "node:fs";
import { join } from "node:path";
const required = ["README.md", "AGENTS.md", "CONTRIBUTING.md", "SECURITY.md", "CHANGELOG.md", "LICENSE", "docs/concepts.md", "docs/core-api.md", "docs/policy-authoring.md", "docs/policy-lifecycle.md", "docs/security-model.md", "docs/express.md", "docs/react.md", "docs/drizzle.md", "docs/integration-boundaries.md", "docs/troubleshooting.md", "docs/testing.md", "docs/versioning.md"];
for (const file of required) { const text = readFileSync(join(process.cwd(), file), "utf8"); if (!text.trim()) throw new Error(`${file} is empty`); }
console.log(`Checked ${required.length} documentation files.`);
type ApiSymbol = { name?: string; kind?: number; comment?: unknown; signatures?: Array<{ comment?: unknown }>; children?: ApiSymbol[] };
const api = JSON.parse(readFileSync(join(process.cwd(), "docs/api.json"), "utf8")) as { children?: ApiSymbol[] };
const publicSymbols = (api.children ?? []).flatMap(module => module.children ?? []);
const undocumented = publicSymbols.filter(symbol => ![512, 1024, 2048].includes(symbol.kind ?? 0) && !symbol.comment && !symbol.signatures?.some(signature => signature.comment)).map(symbol => symbol.name ?? "<unnamed>");
if (undocumented.length) throw new Error(`Undocumented public API symbols: ${undocumented.join(", ")}`);
console.log(`Checked ${publicSymbols.length} generated API symbols.`);
