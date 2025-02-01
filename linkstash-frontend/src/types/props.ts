import { Bookmark } from "./backend";

export type BookmarkCardContextProps = {
    bookmarkData: Bookmark;
    handleDelete: (_id: number) => void;
    handleArchive: (_id: number) => void;
}