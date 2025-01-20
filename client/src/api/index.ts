import axios from 'axios';
import { Auth0ClientOptions } from "@auth0/auth0-spa-js"
import { ShapeStream } from "@electric-sql/client"
import { Item } from "~/@types.zod.ts"


export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_SERVER_URL,
  headers: {
    'Authorization': `Bearer ${localStorage['token']}`
  }
});

export const todosStream = new ShapeStream<Item>({
  url: `${import.meta.env.VITE_BASE_SERVER_URL}/electric/`,
  params: {
    table: 'todos',
  },
  headers: {
    'Authorization': `Bearer ${localStorage['token']}`
  }
})

export const auth0Options: Auth0ClientOptions = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID
}