import { BiSolidEditAlt, BiSolidTrash } from 'react-icons/bi';
import { formatDistanceToNow, formatRFC7231 } from 'date-fns';

/* eslint-disable github/a11y-no-title-attribute */
import Link from 'next/link';
import styles from '../styles.module.css'
import { useBookmarkCardContext } from '../BookmarkCardContext';

export function BookmarkCardBottomBar(){
    const {bookmarkData, handleDelete} = useBookmarkCardContext();
    return (
        <div className={styles["commands"]}>          
          <span
            title={formatRFC7231(
              bookmarkData.created
                ? bookmarkData.created
                : new Date(-8640000000000000)
            )}
          >
            {formatDistanceToNow(
              bookmarkData.created
                ? bookmarkData.created
                : new Date(-8640000000000000),
              { addSuffix: true }
            )}{" "}
            ∞
          </span>
          <span className="separator">|</span>
          <Link href={`/bookmarks/${bookmarkData.id}`}>
            <BiSolidEditAlt
              className="react-icons"
              aria-label="Edit"
              title="Edit"
            />
          </Link>{" "}
          |
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleDelete(Number.parseInt(bookmarkData.id!));
            }}
          >
            <BiSolidTrash
              className="react-icons"
              aria-label="Delete"
              title="Delete"
            />
          </Link>
        </div>
    )
}