import { defineConfig } from "bunup";
import { exports } from "bunup/plugins";

export default defineConfig([
  {
    name: "@text-magic/parse-chinese",
    entry: ["index.ts"],
    plugins: [exports()],
    format: ["esm"],
  },
]);
