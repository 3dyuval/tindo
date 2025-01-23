import { atom } from 'xoid'
import { Item } from '~/@types.zod'
import { api, todosStream } from '@/api'

export const $items = atom([] as Array<Item>, (atom) => {

      async function add(item: Item) {

        await api({ data: item, method: 'POST', url: '/todos' })
            .then(response => {
              console.log(response.status === 201 ? 'success' : 'error')
            })
            .catch(console.error)

        // atom.update((items) => [...items, item])
      }

      function getItemActions(index: number) {
        const $item = atom.focus(index)
        return {
          setBody(body: Item['body']) {
            $item.update(item => ({ ...item, body }))
          },
          remove(id: string) {
            atom.update((items) => items.filter(i => i.id !== id))
          }
        }
      }

      return {
        add,
        getItemActions
      }
    }
)


todosStream.subscribe((payload) => {
  // console.log(todos)
  const todos = payload
      .filter(i => i.value)
      .map(item => ({
    body: item.value.data,
    created_by: item.value.creator_id,
    created_at: item.value.created_at,
    updated_at: item.value.updated_at,
    id: item.value.id,
  })) as Item[]

  $items.update((prevTodos) => [...prevTodos, ...todos])
})


