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
                       className={clsx('category', { selected: selected === category })}
                       onClick={() => setSelected(category)}>
                    <h2>{category}</h2>
                    <ul>
                      <AddTodo
                          category={category}
                          type={type}
                      />
                      {
                        isLoading
                            ? <Skeleton
                                category={category}
                                type={type}
                            />
                            : items.filter(i => i.category === category)
                                .map((item) => <Item {...item} />)
                      }
                    </ul>
                  </div>
              )))}
        </div>
      </>
  )
}

function Skeleton({ type, category }: { category: string, type: string }) {
  return [...Array(10)].map((_, i) => (
      <Item id={crypto.randomUUID()} category={category} type={type}/>
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