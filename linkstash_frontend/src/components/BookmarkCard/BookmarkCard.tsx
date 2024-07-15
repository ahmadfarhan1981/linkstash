/* eslint-disable github/a11y-no-title-attribute */
"use client";

import { MyTag, MyTagGroup } from "@/components";
import { formatDistanceToNow, formatRFC7231 } from "date-fns";
import { Bookmark } from "@/types";
import Link from "next/link";
import styles from "./styles.module.css";

// function fetchCard(){
//   const config:AxiosRequestConfig ={
//     URl:""
//   }
// }

export function BookmarkCard({ bookmarkData }: { bookmarkData: Bookmark }) {
  const emptyTag = <div className={styles["no-tags"]}>No tags</div>;
  return (
    <>
      <div className={styles["card"]}>
        <div className={styles["title"]}>
          <a href={bookmarkData.url} target="_blank" rel="noopener">
            {bookmarkData.title ? bookmarkData.title : bookmarkData.url}
          </a>
        </div>

        <div className={styles["description"]}>{bookmarkData.description}</div>

        <div>
          <MyTagGroup label="Tags:" renderEmptyState={() => emptyTag}>
            {bookmarkData.tagList?.map((tag) => (
              <MyTag className={styles["tags"]} key={tag} id={tag}>
                <Link href={`/tags/${tag}`}>{tag}</Link>
              </MyTag>
            ))}
          </MyTagGroup>
        </div>

        
        <div className={styles["commands"]}>  
          <span title={formatRFC7231(bookmarkData.created?bookmarkData.created:new Date(-8640000000000000))}
            
          >
            {formatDistanceToNow(bookmarkData.created?bookmarkData.created:new Date(-8640000000000000), { addSuffix: true })} ∞
          </span>

          <span className="separator">|</span>

          <a href="/bookmarks/2281/edit?return_url=/bookmarks">Edit</a>

          <button
            className={styles["button"]}
            type="submit"
            name="archive"
            value="2281"
          >
            Archive
          </button>

          <button data-type="submit" data-name="remove" data-value="2281">
            Remove
          </button>
        </div>
      </div>
    </>
  );
}
