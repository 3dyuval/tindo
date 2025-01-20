import { H3Event } from "h3"


export default eventHandler(async (event: H3Event) =>  {


  const handled = handleCors(event, {
    origin: [process.env.NITRO_ALLOW_ORIGIN],
    methods: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
  })

  if (handled) {
    return
  }


})