import { EventHandlerRequest, H3Event, getRequestHeader } from "h3"

export async function useUserData(event: H3Event<EventHandlerRequest>) {
  const auth = getRequestHeader(event, 'Authorization')
  const token = auth?.replace('Bearer ', '')
  if (token) {
    return {
      token: token,
      id: 'ecf48956-f7ef-4b76-885c-58f76a4f3d66',
      roles: ['actor'],
    }
  }
}