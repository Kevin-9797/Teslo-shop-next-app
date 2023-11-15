import { FC, useReducer } from "react";
import { UIContext, uiReducer } from "./";

export interface UIState {
  sidemenuOpen: boolean;
}
interface Props {
  children: JSX.Element;
}

export const UI_INITIAL_STATE: UIState = {
  sidemenuOpen: false,
};

export const UIProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

  const toggleSidemenu = () => {
    dispatch({ type: '[UI] - ToggleMenu'})
  }

  return (
    <UIContext.Provider
      value={{
        ...state,
        toggleSidemenu
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
