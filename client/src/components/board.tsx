import React, { useRef, useState } from "react";
import './board.scss'
import './toolbar.scss'
import './item.scss'

import clsx from "clsx";
import { useShape } from "@electric-sql/react"
import { Todo } from "../../../@types.zod.ts"
import { useAuth0 } from '@auth0/auth0-react';


type KanBanTodo = Todo & { data: { title: string, column: string } }

export function Board() {

  const [selected, setSelected] = useState<string | null>(null);
  const [stacked, setStacked] = useState<boolean>(false);
  const columns = ['Todo', 'Doing', 'Done'];

  const { user, isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0();

  const token = useRef(null)
  getAccessTokenSilently().then(t => token.current = t)

  const { data, isLoading } = useShape<KanBanTodo>({
    url: import.meta.env.VITE_ELECTRIC_URL,
    params: {
      table: 'todos'
    },
    onError: (error) => {
      console.error(error)
      alert(error.message)
    },
    headers: {
      Authorization: `Bearer ${token.current}`
    }
  })


  return (<>
        <div className="toolbar">
          <button onClick={() => setStacked(!stacked)}>Stacked</button>
          {isAuthenticated ? user.sub : <button onClick={loginWithRedirect as any}>Login</button>}
        </div>
        <div className={clsx('board', { stacked })}>
          {columns.map((column) => (
              <div key={column}
                   className={clsx('column', { selected: selected === column })}
                   onClick={() => setSelected(column)}>
                <h2>{column}</h2>
                <ul>
                  {isLoading ? <Skeleton/> : data
                      .filter(i => i.data.column === column)
                      .map(i => <Item {...i} />)}
                </ul>
                <AddTodo column={column}/>
              </div>
          ))}
        </div>
      </>
  )
}

function Skeleton() {
  return [...Array(10)].map((_, i) => (
      <Item data={{ id: i, title: `Item ${i}` }}/>
  ))
}

function Item({ data, creator_id, created_at, updated_at }: KanBanTodo) {
  return <li className="item" key={data.id}>
    {JSON.stringify(data, null, 2)}
    <p>Created by {creator_id}</p>
    <p>Created at {created_at}</p>
    <p>Updated at {updated_at}</p>
  </li>
}

function AddTodo(props: { column: string }) {

  const url = import.meta.env.VITE_BASE_SERVER_URL
  const { getAccessTokenWithPopup } = useAuth0();

  async function addItem() {
    const todoTitle = prompt('What do you want to do?')
    if (todoTitle) {
      fetch(`${url}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAccessTokenWithPopup()}`

        },
        body: JSON.stringify({
          data: {
            title: todoTitle,
            column: props.column
          }
        })
      })
    }
  }

  return (<>
    <button onClick={addItem}>Add Item</button>
  </>)
}