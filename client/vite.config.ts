/// <reference types="vitest" />

import { defineConfig, UserConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';


export default defineConfig(() => {
  return {
    plugins: [
      wasm(),
      topLevelAwait()
    ],
    envDir: '../',
    server: {
      port: 8080,
      hmr: {
        port: 3002
      }
    }
  } satisfies UserConfig
})