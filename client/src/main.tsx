import { createRoot } from "react-dom/client";
import { Board } from "@/components/board.tsx";
import './styles.scss'
import { Auth0Provider, withAuthenticationRequired } from '@auth0/auth0-react';
import { auth0Options } from "@/api"



const rootDomNode = document.querySelector<HTMLDivElement>('#app')!;
localStorage['client-id'] ??= crypto.randomUUID()
const root = createRoot(rootDomNode);
root.render(<Auth0Provider {...auth0Options}><Board/></Auth0Provider>);


