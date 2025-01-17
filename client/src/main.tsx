import { createRoot } from "react-dom/client";
import { Board } from "./components/board-swiper.tsx";
import './styles.scss'


const rootDomNode = document.querySelector<HTMLDivElement>('#app')!;

localStorage['client-id'] ??= crypto.randomUUID()


function main() {
  const root = createRoot(rootDomNode);
  root.render(<Board/>);
}

main()


//
//
// appRoot.innerHTML = `<tin-column title="Column 1"></tin-column>`