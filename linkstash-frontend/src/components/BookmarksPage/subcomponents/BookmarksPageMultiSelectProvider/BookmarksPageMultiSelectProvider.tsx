"use client"

import { ReactNode, useState } from "react";

import { BookmarksPageMultiSelection } from "@/hooks";

export function BookmarksPageMultSelectProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {  
  const [selectedBookmarks, setSelectedBookmarks] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const toggleSelectionMode = () => {
    setIsSelectionMode((prev) => !prev);
    if(isSelectionMode){
      setSelectedBookmarks([]);
    }
  };
  const selectBookmark = (bookmarkId: number) => {
    setSelectedBookmarks((prev) => {
      if (prev.includes(bookmarkId)) {
        return prev.filter((id) => id !== bookmarkId);
      }
      return [...prev, bookmarkId];
    });
  };

  const clearSelection = () => {
    setSelectedBookmarks([]);
  }
  
  const value =  {
    selectedBookmarks,
    isSelectionMode,
    toggleSelectionMode,
    selectBookmark,
    clearSelection
  };
    return (
        <BookmarksPageMultiSelection.Provider value={value}>
            {children}
        </BookmarksPageMultiSelection.Provider>
    )
}