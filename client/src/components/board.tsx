import React, { useState } from "react";
import './board.scss'
import './toolbar.scss'
import './item.scss'
import clsx from "clsx";
import { $items } from "@/todos.store.ts";
import type { Item } from '~/@types.zod'
import { useAtom } from '@xoid/react'


export function Board() {

  const [selected, setSelected] = useState<string | null>(null);
  const [stacked, setStacked] = useState<boolean>(false);

  const boardTypes = {
    'kanban': ['todo', 'doing', 'done'],
    'memo': ['memo', 'idea', 'note', 'quote', 'joke'],
    'mood': ['happy', 'sad', 'angry', 'scared', 'tired'],
    'work': ['work', 'home', 'school', 'errands', 'chores'],
    'personal': ['personal', 'family', 'friends', 'pets', 'hobbies'],
  }

  const isLoading = false;
  const items = useAtom($items)

  return (<>
        <div className="toolbar">
          <button onClick={() => setStacked(!stacked)}>Stacked</button>
        </div>
        <div className={clsx('board', { stacked })}>
          {Object.entries(boardTypes).map(([type, categories]) => categories.map((category) => (
              <div key={category}
                   className={clsx('category', { selected: selected === category })}
                   onClick={() => setSelected(category)}>
                <h2>{category}</h2>
                <ul>
                  <AddTodo category={category} type={type}/>
                  {
                    isLoading
                        ? <Skeleton category={category} type={type}/>
                        : items
                            .filter(i => i.category === category)
                            .map(item => <Item {...item} />)
                  }
                </ul>
              </div>
          ))}
        </div>
      </>
  )
}

function Skeleton({ type, category }: { category: string, type: string }) {
  return [...Array(10)].map((_, i) => (
      <Item  id={crypto.randomUUID()} category={category} type={type} />
  ))
}

function Item({ body, creator_id, created_at, updated_at, id }: Item) {
  return <li className="item" key={id}>
    {JSON.stringify(body, null, 2)}
    <p>Created by {creator_id}</p>
    <p>Created at {created_at}</p>
    <p>Updated at {updated_at}</p>
  </li>
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