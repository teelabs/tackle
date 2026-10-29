import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    express: "src/express.ts",
    react: "src/react.ts",
    drizzle: "src/drizzle.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  outExtensions: ({ format }) => ({ js: format === "cjs" ? ".cjs" : ".js" }),
});
