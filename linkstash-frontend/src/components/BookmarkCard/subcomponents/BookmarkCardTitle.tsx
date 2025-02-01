import { useEffect, useState } from "react";

import { AiFillRead } from "react-icons/ai";
import { BiSolidArchiveIn } from "react-icons/bi";
import Link from "next/link";
import styles from "../styles.module.css";
import { useBookmarkCardContext } from "../BookmarkCardContext";
import { useBookmarksPageMultiSelection } from "@/hooks";

export function BookmarkCardTitle() {
  const multiSelectionContext= useBookmarksPageMultiSelection();
  
  const {
    selectedBookmarks = [],
    isSelectionMode = false,
    selectBookmark = () => {},
  } = multiSelectionContext || {};
  
  const { bookmarkData, handleArchive } = useBookmarkCardContext();

  const [isSelected, setIsSelected] = useState(false);
  useEffect(() => {
    setIsSelected(selectedBookmarks.includes(Number.parseInt(bookmarkData.id!)));
  }, [bookmarkData.id, selectedBookmarks]);
  
  return (
    <div className={styles["title"]}>
      {isSelectionMode && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => selectBookmark(Number.parseInt(bookmarkData.id!))}
          className={styles.checkbox}
        />
      )}
      <a href={bookmarkData.url} target="_blank" rel="noopener">
        {bookmarkData.title ? bookmarkData.title : bookmarkData.url}
      </a>
      &nbsp;
      {bookmarkData.archiveCount.count ? (
        <Link href={`showArchive/${bookmarkData.id}`}>
          <AiFillRead
            className="react-icons"
            aria-label="View archive"
            title="View archive"
          />
        </Link>
      ) : (
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleArchive(Number.parseInt(bookmarkData.id!));
          }}
        >
          <BiSolidArchiveIn
            className="react-icons"
            aria-label="Create archive"
            title="Create archive"
          />
        </Link>
      )}
    </div>
  );
}
