import { config } from 'dotenv'

export default defineNitroConfig({
  runtimeConfig: config({ path: '../.env'}),
  srcDir: ".",
  noPublicDir: true,
  compatibilityDate: "2024-12-25",
  openAPI: {
    meta: {
      title: 'Tindo',
      description: 'Too Do Dating',
      version: '1.0'
    }
  }
});