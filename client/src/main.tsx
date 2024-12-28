import { createRoot } from "react-dom/client";
import { Board } from "./components/board.tsx";
import './styles.scss'


const rootDomNode = document.querySelector<HTMLDivElement>('#app')!;

function main() {
  const root = createRoot(rootDomNode);
  root.render(<Board/>);
}

main()


//
//
// appRoot.innerHTML = `<tin-column title="Column 1"></tin-column>`