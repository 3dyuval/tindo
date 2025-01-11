import { defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig(() => {
  return {
    plugins: [react()],
    server: {
      port: 8080
    },
    resolve: {
      alias: {
        '~/': '../',
        '@': './src'
      }
    }
  } satisfies UserConfig
})