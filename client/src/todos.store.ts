import { atom } from 'xoid'
import { Item } from '~/@types.zod'


const getLocalStorage = (key) => JSON.parse(localStorage.getItem(key))

const setLocalStorage = (key) => (state) =>
    localStorage.setItem(key, JSON.stringify(state))

const initialItems = getLocalStorage('items') || [] as Item[]

export const $items = atom(
    initialItems
    , (a) => ({
      add(item: Item) {
        a.update((items) => [...items, item])
      },
      getItemActions: (index: number) => {
        const $item = a.focus(index)
        return {
          setCategory(category: string) {
            $item.update(item => ({ ...item, category }))
          },
          setBody(body: Item['body']) {
            $item.update(item => ({ ...item, body }))
          },
          remove() {
            a.update((items) => items.filter((i, _index) => index !== _index))
          }
        }
      }
    })
)

$items.subscribe(setLocalStorage('items'))

