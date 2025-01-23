import { z } from "zod"
import { EventHandlerRequest, H3Event } from "h3"


export async function useParamId(event: H3Event<EventHandlerRequest>) {
  const id = getRouterParam(event, 'id')

  if (!z.string().uuid().safeParse(id).success) {
    return new Response(`Invalid id: ${id}`, {
      status: 400
    });
  }

  return id

}