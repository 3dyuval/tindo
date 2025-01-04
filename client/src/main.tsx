import { createRoot } from "react-dom/client";
import { Board } from "./components/board.tsx";
import './styles.scss'
import { Auth0Provider } from '@auth0/auth0-react';


const rootDomNode = document.querySelector<HTMLDivElement>('#app')!;


createRoot(rootDomNode).render(
    <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId= { import.meta.env.VITE_AUTH0_CLIENT_ID }
        authorizationParams={{
          redirect_uri: window.location.origin
        }}
    >
      <Board/>
    </Auth0Provider>
);