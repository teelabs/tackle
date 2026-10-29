import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("runnable examples", () => {
  it("executes every example successfully", () => {
    for (const file of readdirSync("examples").filter(name => name.endsWith(".ts")).sort()) {
      const output = execFileSync(process.execPath, ["node_modules/tsx/dist/cli.mjs", `examples/${file}`], { encoding: "utf8" });
      expect(output.length).toBeGreaterThan(0);
    }
  });
});
