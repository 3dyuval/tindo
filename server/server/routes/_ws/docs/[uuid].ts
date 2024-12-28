import { defineHooks } from "crossws"
import { defineWebSocketHandler } from "h3"


export const websocket = {


  hooks: defineHooks({
    upgrade({ url, headers }) {
      console.log("upgrade", url, headers);
    },
  })
};

export default defineWebSocketHandler(websocket.hooks);
