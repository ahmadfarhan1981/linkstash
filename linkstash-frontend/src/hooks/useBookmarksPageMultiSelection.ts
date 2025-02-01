import { createContext, useContext, useState } from "react";


type useBookmarksPageMultiSelectionReturnValue = {
    selectedBookmarks: number[];
    isSelectionMode: boolean;
    toggleSelectionMode: () => void;
    selectBookmark: (bookmarkId: number) => void;
};

export const BookmarksPageMultiSelection  = createContext<useBookmarksPageMultiSelectionReturnValue>({} as useBookmarksPageMultiSelectionReturnValue);


export function useBookmarksPageMultiSelection(): useBookmarksPageMultiSelectionReturnValue {
  const context = useContext(BookmarksPageMultiSelection);
  
  // if (!context) {
  //   throw new Error("useBookmarksPageMultiSelection must be used within a BookmarksPageMultiSelectProvider");
  // }

  return context;

  

}