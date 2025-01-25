import React, { useEffect, useState } from "react";
import './board.scss'
import './toolbar.scss'
import './item.scss'
import clsx from "clsx";
import type { Item, UserConfig } from '~/@types.zod'
import { itemSchema } from '~/@types.zod'
import { useAtom } from '@xoid/react'
import { $items } from "../todos.store";
import { format, parseISO } from 'date-fns'
import 'remixicon/fonts/remixicon.css'
import { useAuth0 } from '@auth0/auth0-react';


export function Board() {
  const { user, isAuthenticated, loginWithPopup, getAccessTokenSilently, logout } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently().then(token => localStorage['token'] = token)
    }
  }, [isAuthenticated]);

  const [selectedBoardType, setSelectedBoardType] = useState<string | null>('kanban');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [stacked, setStacked] = useState<boolean>(false);

  const config: UserConfig = {
    boardTypes: {
      'kanban': ['todo', 'doing', 'done'],
      'memo': ['memo', 'idea', 'note', 'quote', 'joke'],
      'mood': ['happy', 'sad', 'angry', 'scared', 'tired'],
      'work': ['work', 'home', 'school', 'errands', 'chores'],
      'personal': ['personal', 'family', 'friends', 'pets', 'hobbies']
    },
    dateString: 'MM/dd/yy',
    disableConfirmAddItem: false
  }

  const items = useAtom<Item[]>($items)

  return (<div className="board-container">
        <div className="toolbar board-toolbar">
          <button onClick={() => setStacked(!stacked)}>Stacked</button>
          {<button onClick={isAuthenticated ? logout : loginWithPopup}>{isAuthenticated ? 'Logout' : 'Login'}</button>}
          <select onChange={(e) => setSelectedBoardType(e.target.value)} value={selectedBoardType}>
            {Object.entries((config.boardTypes)).map(([type, categories]) => (
                <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className={clsx('board', { stacked })}>
          {Object.entries(config.boardTypes)
              .filter(([type]) => type === selectedBoardType)
              .flatMap(([type, categories]) => categories.map((category) => (
                  <div key={category}
                       onClick={() => setSelectedCategory(category)}
                       className={clsx('column',
                           { selected: selectedCategory === category })}
                  >
                    <div className="toolbar">
                      <h2>{category}</h2>
                      <AddItem
                          config={config}
                          category={category}
                          type={type}
                      />
                    </div>
                    <ul>
                      {(items || [])
                          .filter((i) => i.body?.category === category)
                          .map((item) =>
                              <Item {...item} config={config} key={item.id}/>
                          )
                      }
                    </ul>
                  </div>
              )))
          }
        </div>
      </div>
  )
}

function Item(props: Item & { config: UserConfig }) {
  const { id, body } = props

  const { config, ...item } = props

  itemSchema.parse(item)

  return <li className="item box" key={id}>
    <div className="item-header"><h3>{body.title}</h3><span>{body.priority}</span></div>
    <div className="toolbar">
      <p>Created by {props.created_by.slice(0, 5)}</p>
      <p>Created at {format(parseISO(props.created_at), config.dateString)}</p>
      {props.updated_at && <p>Updated at {format(parseISO(props.updated_at), config.dateString)}</p>}
      {props.updated_by && <p>Updated by {format(parseISO(props.updated_by), config.dateString)}</p>}
      <EditItem {...props} />
    </div>
  </li>
}


function EditItem(props: Item & { config: UserConfig }) {

  const [editing, setEditing] = useState(false)
  const [items, { getItemActions }] = useAtom($items, true)

  const { id, body, config } = props
  const categories = Object.values(config.boardTypes[body.type])
  const {  remove, setBody } = getItemActions(items.findIndex(i => i.id === id))

  function handleChangeTitle() {
    const title = prompt('What do you want to do?')
    if (title) {
      setBody({ ...body, title })
    }
  }

  function handleSetCategory(event) {
    setBody({ ...body, category: event.target.value })
  }

  function handleChangePriority(event) {
    const value = event.target.valueAsNumber
    setBody({ ...body, priority: value })
  }


  return (<>
    <button className="secondary" type="button" onClick={() => setEditing(true)}>...</button>
    <div className="dialog" style={{ display: editing ? 'flex' : 'none' }}>
      <div className="dialog-content">
        <label>
          Title
          <input type="text" readOnly onClick={handleChangeTitle} value={body.title}/>
        </label>
        <label>
          Option
          <select onChange={handleSetCategory} value={body.category}>
            {categories.map(category => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>
        <label>
          Priority
          <input type="number" onChange={handleChangePriority} defaultValue={body.priority} min={-3} max={3} step={1}/>
        </label>
        <label>
          Delete
          <input type="button" onClick={() => remove(id)} className="danger" value="Delete" />
        </label>
        <div className="toolbar">
          <button className="ri-delete-back-fill x secondary" onClick={() => setEditing(false)}></button>
          <button className="ri-check-line tertiary" onClick={() => setEditing(false)}></button>
        </div>
      </div>
    </div>
  </>)
}

function AddItem(props: Item & { config: UserConfig, type: string, category: string }) {

  const { config, category, type } = props
  const [adding, setAdding] = useState(false)
  const [, { add }] = useAtom($items, true)

  const categories = Object.values(config.boardTypes[type])


  function addItem() {

    const title = prompt('What do you want to do?')

    const item = itemSchema.safeParse({
      id: crypto.randomUUID(),
      created_by: localStorage['client-id'],
      created_at: new Date().toISOString(),
      body: {
        category: category,
        type: type,
        title: title
      }
    })

    if (item.success) {
      add(item.data)
    } else {
      alert(JSON.stringify(item.error))
    }
  }

  if (!adding) {
    return <button onClick={addItem}>Add Item</button>
  }

  return (<>
    <button onClick={addItem} disabled>Add Item</button>
    <button className="secondary" type="button" onClick={() => setAdding(true)}>...</button>
    <div className="dialog" style={{ display: 'flex' }}>
      <div className="dialog-content">
        <div>
          <select defaultValue={category}>
            {categories.map(category => <option key={category} value={category}>{category}</option>)}
          </select>
        </div>
        <div className="toolbar">
          <button className="ri-delete-back-fill x secondary" onClick={() => setAdding(false)}></button>
          <button className="ri-check-line tertiary" onClick={() => setAdding(false)}></button>
        </div>
      </div>
    </div>
  </>)
}


function Skeleton({ type, category }: { category: string, type: string }) {
  return [...Array(3)].map((_, i) => (
      <Item id={crypto.randomUUID()} category={category} type={type}/>
  ))
}
