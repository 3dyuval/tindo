import React, { useEffect, useState } from "react";
import './board.scss'
import './toolbar.scss'
import './item.scss'
import clsx from "clsx";
import type { Item, UserConfig } from '~/@types.zod'
import { itemSchema } from '~/@types.zod'
import { useAtom } from '@xoid/react'
import { $items } from "../todos.store";
import { format, formatRelative, parseISO } from 'date-fns'
import 'remixicon/fonts/remixicon.css'
import { useAuth0 } from '@auth0/auth0-react';
import { useShape } from "@electric-sql/react"
import { localdb, api, todoShape } from "@/api"


export function Board() {
  const { user, isAuthenticated, loginWithPopup, getIdTokenClaims, logout } = useAuth0();
  const { data: items, lastSyncedAt, isLoading } = useShape<Item>(todoShape)

  useEffect(() => {
    const _items = items.map(i => {
      return {
        key: i.id as string,
        changes: _items
      }
    })
    localdb.todos.bulkUpdate(_items)
  }, [items]);

  useEffect(() => {
    if (isAuthenticated) {
      getIdTokenClaims().then(token => localStorage['token'] = token.__raw)
      localStorage['client-id'] = user?.sub
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

  const LoginButton = () => {
    if (isAuthenticated) {
      return <button onClick={logout}>Logout</button>
    }
    return <button onClick={() => loginWithPopup()}>Login</button>
  }

  return (<div className="board-container">
        <div className="toolbar board-toolbar">
          <button onClick={() => setStacked(!stacked)}>Stacked</button>
          <LoginButton/>
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
                    {isLoading ? 'Syncing' : 'Synced ' + formatRelative(new Date(lastSyncedAt), new Date())}
                    <ul>
                      {(items || [])
                          .filter((i) => i.data?.category === category)
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
  const { id, data } = props

  const { config, ...item } = props

  itemSchema.parse(item)

  return <li className="item box" key={id}>
    <div className="item-header"><h3>{data.title}</h3><span>{data.priority}</span></div>
    <div className="toolbar">
      <p>Created by {props.creator_id.slice(0, 5)}</p>
      <p>Created at {format(parseISO(props.created_at), config.dateString)}</p>
      {props.updated_at && <p>Updated at {format(parseISO(props.updated_at), config.dateString)}</p>}
      {props.updated_by && <p>Updated by {format(parseISO(props.updated_by), config.dateString)}</p>}
      <EditItem {...props} />
    </div>
  </li>
}


function EditItem(props: Item & { config: UserConfig }) {

  const [editing, setEditing] = useState(false)
  // const [items, { getItemActions }] = useAtom($items, true)

  const { id, data, config } = props
  const categories = Object.values(config.boardTypes[data.type])
  // const {  remove, setBody } = getItemActions(items.findIndex(i => i.id === id))

  const remove: any = () => {
    api({ method: 'DELETE', url: `/todos/${id}` })
  }

  const setData: any = () => {
    api({ method: 'PUT', url: `/todos/${id}/data`, data })
  }

  function handleChangeTitle() {
    const title = prompt('What do you want to do?')
    if (title) {
      setData({ ...data, title })
    }
  }

  function handleSetCategory(event) {
    setData({ ...data, category: event.target.value })
  }

  function handleChangePriority(event) {
    const value = event.target.valueAsNumber
    setData({ ...data, priority: value })
  }


  return (<>
    <button className="secondary" type="button" onClick={() => setEditing(true)}>...</button>
    <div className="dialog" style={{ display: editing ? 'flex' : 'none' }}>
      <div className="dialog-content">
        <label>
          Title
          <input type="text" readOnly onClick={handleChangeTitle} value={data.title}/>
        </label>
        <label>
          Option
          <select onChange={handleSetCategory} value={data.category}>
            {categories.map(category => <option key={`${category}-select`} value={category}>{category}</option>)}
          </select>
        </label>
        <label>
          Priority
          <input type="number" onChange={handleChangePriority} defaultValue={data.priority} min={-3} max={3} step={1}/>
        </label>
        <label>
          Delete {id}
          <input type="button" onClick={() => remove(id)} className="danger" value="Delete"/>
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
  const [, { createTodo }] = useAtom($items, true)

  const categories = Object.values(config.boardTypes[type])


  function addItem() {

    const title = prompt('What do you want to do?')

    const item = itemSchema.safeParse({
      id: crypto.randomUUID(),
      creator_id: localStorage['client-id'],
      created_at: new Date().toISOString(),
      data: {
        category: category,
        type: type,
        title: title
      }
    })

    if (item.success) {
      api({ data: item.data, method: 'POST', url: '/todos' })
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
            {categories.map(category => <option key={`${category}-item`} value={category}>{category}</option>)}
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
