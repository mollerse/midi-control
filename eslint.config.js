import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["src/index.js", "src/lib/web-midi-connect.js", "test/web/**/*.js"],
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    files: ["src/index-node.js", "src/lib/node-midi-connect.js", "test/node/**/*.js"],
    languageOptions: { globals: { ...globals.nodeBuiltin } },
  },
  {
    files: ["src/lib/midicontrol.js"],
    languageOptions: { globals: { ...globals["shared-node-browser"], ...globals.browser } },
  },
  {
    files: ["test/lib/**/*.js"],
    languageOptions: { globals: { ...globals["shared-node-browser"] } },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
