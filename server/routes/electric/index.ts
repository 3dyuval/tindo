import { useUser } from "~~/utils/useUser"
import { getRequestURL, H3Event, handleCors } from "h3"


export default eventHandler(async (event: H3Event) => {


  const handled = handleCors(event, {
    origin: [process.env.NITRO_ALLOW_ORIGIN],
    methods: '*'
  })


  const user = await useUser(event)
  if (!user) {
    return new Response(`user not found`, { status: 401 })
  }


  const url = getRequestURL(event)
  const originUrl = new URL(process.env.NITRO_ELECTRIC_URL)

  // Copy over the relevant query params that the Electric client adds
  // so that we return the right part of the Shape log.
  url.searchParams.forEach((value, key) => {
    if ([`live`, `table`, `handle`, `offset`, `cursor`].includes(key)) {
      originUrl.searchParams.set(key, value)
    }
  })

  // Only query data the user has access to unless they're an admin.
  if (!user.roles.includes(`admin`)) {
    originUrl.searchParams.set('where', `creator_id='${user.id}'`)
  }


  let resp = await fetch(originUrl.toString())

  new Headers(resp.headers).forEach(console.log)
  if (resp.headers.get(`content-encoding`)) {
    const headers = new Headers(resp.headers)
    headers.delete(`content-encoding`)
    headers.delete(`content-length`)
    // When proxying long-polling requests, content-encoding &
    // content-length are added erroneously (saying the body is
    // gzipped when it's not) so we'll just remove them to avoid
    // content decoding errors in the browser.
    //
    // Similar-ish problem to https://github.com/wintercg/fetch/issues/23
    resp = new Response(resp.body, {
      status: resp.status,
      statusText: resp.statusText,
      headers
    })
  }
  return resp
});

