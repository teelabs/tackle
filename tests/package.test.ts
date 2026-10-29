import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("package artifacts", () => {
  it("loads ESM and CommonJS builds and declarations", async () => { const esm = await import("../dist/index.js"); const cjs = createRequire(import.meta.url)("../dist/index.cjs"); expect(typeof esm.buildPolicy).toBe("function"); expect(typeof cjs.buildPolicy).toBe("function"); expect(readFileSync("dist/index.d.ts", "utf8")).toContain("createAuthorizationEngine"); expect(existsSync("dist/index.d.cts")).toBe(true); });
});
