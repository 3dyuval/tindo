import { defineConfig, UserConfig } from 'vite'

export default defineConfig(() => {
  return {
    envDir: '../',
    server: {
      port: 8080,
    }
  } as UserConfig
})