import { getRequestURL, H3Event, handleCors } from "h3"
import { cors } from "nitro-cors"


export default eventHandler(async (event: H3Event) => {

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
  if (!event.context.isAdmin) {
    originUrl.searchParams.set('where', `creator_id='${event.context.user.sub}'`)
  }


  let resp = await fetch(originUrl.toString())


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
})

