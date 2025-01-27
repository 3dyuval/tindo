import { onRequestCORSMiddleware } from "nitro-cors"


export default onRequestCORSMiddleware({
  origin: [process.env.NITRO_ALLOW_ORIGIN],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: '*',
  preflight: {
    statusCode: 204,
  }
})

