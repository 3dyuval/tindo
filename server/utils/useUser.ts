import { EventHandlerRequest, H3Event, getRequestHeader } from "h3"

export async function useUser(event: H3Event<EventHandlerRequest>) {
  const auth = getRequestHeader(event, 'Authorization')
  const token = auth?.replace('Bearer ', '')

  let roles = []

  if (token === 'auth0|5f7c8ec7c33c6c004bbafe82') {
    roles.push('admin')
  }

  if (token) {
    return {
      token: token,
      id: token,
      roles: roles
    }
  }
}