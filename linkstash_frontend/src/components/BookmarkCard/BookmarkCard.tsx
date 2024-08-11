/* eslint-disable github/a11y-no-title-attribute */
"use client";

import { BiSolidArchiveIn, BiSolidEditAlt, BiSolidTrash } from "react-icons/bi";
import { MyTag, MyTagGroup } from "@/components";
import { formatDistanceToNow, formatRFC7231 } from "date-fns";

import { AiFillRead } from "react-icons/ai";
import { Bookmark } from "@/types";
import Link from "next/link";
import styles from "./styles.module.css";

//TODO compose the component 
export function BookmarkCard({
  bookmarkData,
  handleDelete,
  handleArchive,
}: {
  bookmarkData: Bookmark;
  handleDelete: (_id: number) => void;
  handleArchive: (_id: number) => void;
}) {
  const emptyTag = <div className={styles["no-tags"]}>No tags</div>;
  return (
    <>
      <div className={styles["card"]}>
        <div className={styles["title"]}>
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
      </div>
    </>
  );
}
