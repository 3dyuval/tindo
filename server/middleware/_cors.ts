import { defineCORSEventHandler, onRequestCORSMiddleware } from "nitro-cors"


export default defineCORSEventHandler(event => {},
    {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: '*',
  preflight: {
    statusCode: 204,
  }
})

