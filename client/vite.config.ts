import { defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig(() => {
  return {
    plugins: [react()],
    envDir: '../',
    server: {
      port: 8080
    }
  } satisfies UserConfig
})