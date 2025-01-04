import { EventHandlerRequest, H3Event, getRequestHeader } from "h3"

export async function useUserData(event: H3Event<EventHandlerRequest>) {
  const auth = getRequestHeader(event, 'Authorization')
  const token = auth?.replace('Bearer ', '')
  if (token) {
    return {
      token: token,
      id: '5fceeb58-71e7-43fb-801d-466b4ead1959',
      roles: ['admin'],
    }
  }
}