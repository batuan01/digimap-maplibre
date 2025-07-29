// context/AppContext.tsx
"use client";
import React, { createContext, useState, ReactNode } from "react";
import { AppState } from "@/types/stateTypes";
import { getDefaultAppState } from "@/hooks/2d/appState";

type AppContextProps = {
  appState: AppState;
  setAppState: React.Component<any, AppState>["setState"];
};

const AppContext = createContext<AppContextProps | null>(null);

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [appState, setAppState] = useState<AppState>(getDefaultAppState() as AppState);

  return (
    <AppContext.Provider value={{ appState, setAppState }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
