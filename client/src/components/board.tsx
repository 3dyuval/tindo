import React, { useState } from "react";
import './board.scss'
import './toolbar.scss'
import './item.scss'
import clsx from "clsx";
import type { Item } from '~/@types.zod'
import { useAtom } from '@xoid/react'
import { $items } from "../todos.store";


export function Board() {

  const [category, setCategory] = useState<string | null>('kanban');
  const [selected, setSelected] = useState<string | null>(null);
  const [stacked, setStacked] = useState<boolean>(false);

  const boardTypes = {
    'kanban': ['todo', 'doing', 'done'],
    'memo': ['memo', 'idea', 'note', 'quote', 'joke'],
    'mood': ['happy', 'sad', 'angry', 'scared', 'tired'],
    'work': ['work', 'home', 'school', 'errands', 'chores'],
    'personal': ['personal', 'family', 'friends', 'pets', 'hobbies']
  }

  const isLoading = false;
  const items = useAtom($items)

  return (<>
        <div className="toolbar">
          <button onClick={() => setStacked(!stacked)}>Stacked</button>
          <select onChange={(e) => setCategory(e.target.value)}>
            {Object.entries((boardTypes)).map(([type, categories]) => (
                <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className={clsx('board', { stacked })}>
          {Object.entries(boardTypes)
              .filter(([type]) => type === category)
              .flatMap(([type, categories]) => categories.map((category) => (
                  <div key={category}
                       className={clsx('column', { selected: selected === category })}
                       onClick={() => setSelected(category)}>
                    <div className="toolbar">
                      <h2>{category}</h2>
                      <AddTodo
                          category={category}
                          type={type}
                      />
                    </div>
                    <ul>
                      {
                        isLoading
                            ? <Skeleton
                                category={category}
                                type={type}
                            />
                            : items.filter(i => i.category === category)
                                .map((item) => <Item {...item} categories={boardTypes[type]}/>)
                      }
                    </ul>
                  </div>
              )))}
        </div>
      </>
  )
}

function Skeleton({ type, category }: { category: string, type: string }) {
  return [...Array(3)].map((_, i) => (
      <Item id={crypto.randomUUID()} category={category} type={type}/>
  ))
}

function Item(props: Item) {
  const { body, creator_id, created_at, updated_at, id } = props

  return <li className="item box" key={id}>
    {JSON.stringify(body, null, 2)}
    <div className="toolbar">
      <p>Created by {creator_id}</p>
      <p>Created at {created_at}</p>
      <p>Updated at {updated_at}</p>
      <EditItem {...props} />
    </div>
  </li>
}


function EditItem(props: Item & { categories: string[] }) {

  const [editing, setEditing] = useState(false)
  const [_, { getItemActions }] = useAtom($items, true)

  const { categories, category, id, body } = props
  // const { setCategory } = getItemActions(id)

  function setCategory(newCategory: string) {
    return
  }

  return (<>
    <button className="secondary" type="button" onClick={() => setEditing(true)}>...</button>
    <div className="dialog" style={{ display: editing ? 'flex' : 'none' }}>
      <div className="dialog-content">
        <div>
          <select onChange={(e) => setCategory(e.target.value)} value={category}>
            {categories.map(category => <option key={category} value={category}>{category}</option>)}
          </select>
        </div>
        <div className="toolbar">
          <button className="tertiary" onClick={() => setEditing(false)}>❎</button>
          <button className="secondary" type="submit">☑️</button>
        </div>
      </div>
    </div>
  </>)
}

function AddTodo(props: { category: string, type: string }) {

  const [, { add }] = useAtom($items, true)

  function addItem() {
    const todoTitle = prompt('What do you want to do?')

    if (todoTitle) {

      add({
        id: crypto.randomUUID(),
        category: props.category,
        type: props.type,
        body: {
          title: todoTitle
        }
      })
    }
  }

  return (<>
    <button onClick={addItem}>Add Item</button>
  </>)
}