"use client";

import { createContext, useContext, useState } from "react";

const RedirectContext = createContext();

export const RedirectProvider = ({ children }) => {
  const [redirectUrl, setRedirectUrl] = useState(null);

  return (
    <RedirectContext.Provider value={{ redirectUrl, setRedirectUrl }}>
      {children}
    </RedirectContext.Provider>
  );
};

export const useRedirectContext = () => useContext(RedirectContext);
