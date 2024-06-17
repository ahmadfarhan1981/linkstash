"use client";

import { MyTag, MyTagGroup } from "@/components";

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
          <a
            href="https://web.archive.org/web/20240104032528/https://www.joshwcomeau.com/css/interactive-guide-to-grid/"
            // title="Show snapshot on the Internet Archive Wayback Machine"
            target="_blank"
            rel="noopener"
          >
            Yesterday ∞
          </a>

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
