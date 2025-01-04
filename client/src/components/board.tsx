import React, { useEffect, useState } from "react";
import './board.scss'
import './toolbar.scss'
import './item.scss'

import clsx from "clsx";
import { useShape } from "@electric-sql/react"


export function Board() {

  const [selected, setSelected] = useState<string | null>(null);
  const [stacked, setStacked] = useState<boolean>(false);

  const columns = ['Todo', 'Doing', 'Done'];
  const url = import.meta.env.VITE_ELECTRIC_URL as string
  const { data, isLoading } = useShape({
    url,
    params: {
      table: 'todos'
    },
    onError: (error) => {
      alert(error)
    },
    headers: {
      Authorization: `Bearer 123`
    }
  })


  return (<>
        <div className="toolbar">
          <button onClick={() => setStacked(!stacked)}>Stacked</button>
        </div>
        <div className={clsx('board', { stacked })}>
          {columns.map((column) => (
              <div key={column}
                   className={clsx('column', { selected: selected === column })}
                   onClick={() => setSelected(column)}>
                <h2>{column}</h2>
                <ul>
                  {isLoading ? <Skeleton/> : data.map(Item)}
                </ul>
              </div>
          ))}
        </div>
      </>
  )
}

type ItemProps = {
  title: string
}

function Skeleton() {
  return [...Array(10)].map((_, i) => (
      <Item key={i} title={`Item ${i}`}/>
  ))
}

function Item(props: ItemProps) {
  return <li className="item">
    {props.title}
  </li>
}