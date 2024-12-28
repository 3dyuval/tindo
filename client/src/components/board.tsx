import React, { useState } from "react";
import './board.scss'
import clsx from "clsx";


export function Board() {

  const [selected, setSelected] = useState<string | null>(null);

  const columns = ['Todo', 'Doing', 'Done'];

  return (<div className="board">
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
  )
}


function Item(props: ItemProps) {
  return <li className="item">
    {props.title}
  </li>
}