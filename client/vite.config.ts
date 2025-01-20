import { defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "node:path"

export default defineConfig(() => {
  return {
    plugins: [react()],
    server: {
      port: 8080
    },
    envDir: '../',
    resolve: {
      alias: {
        '~': path.resolve(__dirname, '../'),
        '@': path.resolve(__dirname, './src')
      }
    }
  } satisfies UserConfig
})