import { MyTag, MyTagGroup } from "@/components"

import Link from "next/link";
import styles from '../styles.module.css'
import { uniq } from "lodash";
import { useBookmarkCardContext } from "../BookmarkCardContext";

export function BookmarkCardTagGroup(){
    const emptyTag = <div className={styles["no-tags"]}>No tags</div>;
    const {bookmarkData} = useBookmarkCardContext();
    return (
        <div>
        <MyTagGroup label="Tags:" id={`${bookmarkData.id!}-tagGroup`} renderEmptyState={() => emptyTag}>
          {uniq(bookmarkData.tagList)?.map((tag) => (
            <MyTag className={styles["tags"]} key={`${bookmarkData.id!}-${tag}`} id={`${bookmarkData.id!}-${tag}`}>
              <Link onClick={(e)=>{e.preventDefault()}} href={`/tags/${tag}`}>{tag}</Link>
            </MyTag>
          ))}
        </MyTagGroup>
      </div>
    )
}