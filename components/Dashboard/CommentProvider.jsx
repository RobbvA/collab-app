'use client'

import React, { createContext, useState } from 'react';

export const CommentContext = createContext({
  openComposer: null,
  setOpenComposer: () => {},
});

export function CommentProvider({ children }) {
  const [openComposer, setOpenComposer] = useState(null);

  return (
    <CommentContext.Provider value={{ openComposer, setOpenComposer }}>
      {children}
    </CommentContext.Provider>
  );
}

export default CommentProvider;
