const path = require("path");

// On Windows, ensure SWC wasm fallback is used under Windows Application Control
if (process.platform === "win32") {
  process.env.NEXT_TEST_WASM_DIR = path.resolve(__dirname, "../node_modules/@next/swc-wasm-nodejs");
}

// Hand off to Next.js CLI
require("next/dist/bin/next");

