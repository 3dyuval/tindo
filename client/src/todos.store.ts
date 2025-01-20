import { atom } from 'xoid'
import { Item } from '~/@types.zod'
import { api, todosStream } from '@/api'


const getLocalStorage = (key) => JSON.parse(localStorage.getItem(key))

const setLocalStorage = (key) => (state) =>
    localStorage.setItem(key, JSON.stringify(state))

const initialItems = getLocalStorage('items') || [] as Item[]

export const $items = atom(initialItems, (atom) => {

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
          setCategory(category: string) {
            $item.update(item => ({ ...item, category }))
          },
          setBody(body: Item['body']) {
            $item.update(item => ({ ...item, body }))
          },
          remove() {
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


// todosStream.subscribe((todos) => {
//   console.log(todos)
//   // const items = todos.map(({ value: item }) => ({ ...item, body: item?.data || {} }))
//   // console.log(items)
// })

$items.subscribe(setLocalStorage('items'))

