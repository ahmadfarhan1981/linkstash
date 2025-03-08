import { createContext, useContext } from "react";

import { BookmarkCardContextProps } from "@/types/props";

const BookmarkCardContext = createContext<BookmarkCardContextProps|null>(null)

export function useBookmarkCardContext (): BookmarkCardContextProps {
    const context  = useContext(BookmarkCardContext);
    if(!context){
        throw new Error (
            "Must be rendered as part of BookmarkCard"
        )
    }
    return context;
}

export default BookmarkCardContext;