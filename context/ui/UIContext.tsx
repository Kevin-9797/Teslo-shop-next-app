import { createContext } from 'react';


interface ContextProps{
   sidemenuOpen: boolean;
   toggleSidemenu: () => void;


}

export const UIContext = createContext({} as ContextProps);