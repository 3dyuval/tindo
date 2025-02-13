import axios from 'axios';
import { Auth0ProviderOptions } from "@auth0/auth0-react"
import Dexie, { EntityTable } from "dexie"
import { Item } from "~/@types.zod"
import { z } from "zod"

export const localdb = new Dexie('tindo') as Dexie & {
  todos: EntityTable<
      Item,
      'id'
  >
};


localdb.version(1).stores({
  todos: '++id, creator_id, created_at, updated_by, updated_at, data'
});


export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_SERVER_URL,
  headers: {
    'Authorization': `Bearer ${localStorage['token']}`
  }
});

export const todoShape = {
  url: `${import.meta.env.VITE_BASE_SERVER_URL}/shape/`,
  params: {
    table: 'todos'
  },
  headers: {
    'Authorization': `Bearer ${localStorage['token']}`
  }
}

export const auth0Options: Auth0ProviderOptions = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  cacheLocation: 'localstorage',
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: 'tindo-server',
    scope: 'openid profile email read:* write:* delete:*'
  }

}