import {atom, Atom} from 'xoid'
import {Item} from '~/@types.zod'

const initialItems = [] as Item[]

export const $items = atom(
    initialItems
    , (a) => ({
        add(item: Item) {
            a.update((items) => [...items, item])
        },
        getItemActions(id: string) {
            const $item = a.focus<Item>((items) => items.find(i => i.id === id))
            return {
                setCategory(category: string) {
                    $item.update(item => ({...item, category}))
                },
                setBody(body: Item['body']) {
                    $item.update(item => ({...item, body}))
                },
                remove() {
                    a.update((items) => items.filter(i => i.id !== id))
                },
            }
        }
    })
)

