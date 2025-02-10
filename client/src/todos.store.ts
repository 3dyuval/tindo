import { atom } from 'xoid'
import { Item } from '~/@types.zod'
import { api, todoShape } from '@/api'
import { useShape } from "@electric-sql/react"
import { ShapeStream } from "@electric-sql/client"

export const $items = atom([] as Array<Item>, (atom) => {

      async function createTodo(item: Item) {

        atom.update((items) => [...items, item])
        await api({ data: item, method: 'POST', url: '/todos' })
            .then(response => {
              console.log(response.status === 201 ? 'success' : 'error')
            }).catch(() => {
              atom.update((items) => items.filter(i => i.id !== item.id))
            })

      }

      async function updateTodo(item: Item) {
        atom.update((items) => [...items, item])
        await api({ data: item, method: 'PUT', url: `/todos/${item.id}` })
            .then(response => {
              console.log(response.status === 200 ? 'success' : 'error')
            }).
            catch(() => {
              atom.update((items) => items.filter(i => i.id !== item.id))
            })
      }

      async function deleteTodo(id: string) {
        await api({ method: 'DELETE', url: `/todos/${id}` })
            .then(response => {
              console.log(response.status === 204 ? 'success' : 'error')
            }).catch(() => {
              atom.update((items) => items.filter(i => i.id !== id))
            })
      }

      function getItemActions(index: number) {
        const $item = atom.focus(index)
        return {
          setBody(body: Item['body']) {
            const before = { ...$item.value }
            const after = {...$item.value, body}
            $item.set(after)

            updateTodo(after).catch(() => {
              $item.set(before)
            })

          },
          remove(id: string) {
            deleteTodo(id).catch((error) => {
              alert(JSON.stringify(error))
            })
            // atom.update((items) => items.filter(i => i.id !== id))
          }
        }
      }

      return {
        createTodo,
        updateTodo,
        getItemActions
      }
    }
)
//
// const todosStream = new ShapeStream<Item>(todoShape)
// todosStream.subscribe((payload) => {
//   const todos = payload
//       .filter(i => i.value)
//       .map(item => ({
//     body: item.value.data,
//     creator_id: item.value.creator_id,
//     created_at: item.value.created_at,
//     updated_at: item.value.updated_at,
//     id: item.value.id,
//   })) as Item[]
//
//   console.log('settings todos', todos)
  // $items.update((prev) => [...prev, ...todos])
// })


