import { EventHandlerRequest, H3Event, getRequestHeader } from "h3"

export async function useUser(event: H3Event<EventHandlerRequest>) {
  const auth = getRequestHeader(event, 'Authorization')
  const token = auth?.replace('Bearer ', '')
  if (token) {
    return {
      token: token,
      id: '68cfecc0-798a-4b70-a703-9f1d0f93f216',
      roles: ['admin'],
    }
  }
}