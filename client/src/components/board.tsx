import React, { useState } from "react";
import './board.scss'
import './toolbar.scss'
import './item.scss'

import clsx from "clsx";


export function Board() {

  const [selected, setSelected] = useState<string | null>(null);
  const [stacked, setStacked] = useState<boolean>(false);

  const columns = ['Todo', 'Doing', 'Done'];

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
                  {[...Array(10)].map((_, i) => (
                      <Item key={i} title={`Item ${i}`}/>
                  ))}
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

function Item(props: ItemProps) {
  return <li className="item">
    {props.title}
  </li>
}