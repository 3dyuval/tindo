import { User } from "../user"



export function wsMain() {

  const user = new User()

  const url = `${import.meta.env.VITE_BASE_SOCKET_URL}/docs/${user.uuid}`
  console.log("ws", "Connecting to", url, "...");
  const ws = new WebSocket(url);

  ws.addEventListener("message", async (event) => {
    let data = typeof event.data === "string" ? event.data : await event.data.text();
    const { user = "system", message = "" } = data.startsWith("{")
        ? JSON.parse(data)
        : { message: data };

    console.log(
        user,
        typeof message === "string" ? message : JSON.stringify(message),
    );

    document.querySelector<HTMLDivElement>('#app')!.innerHTML = message === "string" ? message : JSON.stringify(message)

  });

  ws.addEventListener('open', () => {
    console.log('[ws] connected.')
  })

  ws.addEventListener('close', () => {
    console.log('[ws] disconnected.')
  })
}