import { fromNodeMiddleware } from "h3";
import { auth } from 'express-oauth2-jwt-bearer'

type User = {
  id: string,
  roles: string[]
}
export async function useAuth(): Promise<User> {

  const event = useEvent();

  // get the user from cache/db using the user id from auth middleware
  console.log('useAuth', event.auth)
  return { id: event.auth.sub, roles: event.auth.roles }
}