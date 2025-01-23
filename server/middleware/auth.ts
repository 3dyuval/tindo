export default eventHandler(async (event) => {

  const user = await useUser(event)

  if (!user) {
    return new Response(`invalid auth token`, { status: 401 })
  }

  event.context.user = user


})