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
  const todos = payload
      .filter(i => i.value)
      .map(item => ({
    body: item.value.data,
    creator_id: item.value.creator_id,
    created_at: item.value.created_at,
    updated_at: item.value.updated_at,
    id: item.value.id,
  })) as Item[]

  console.log('settings todos', todos)
  $items.update((prev) => [...prev, ...todos])
})


