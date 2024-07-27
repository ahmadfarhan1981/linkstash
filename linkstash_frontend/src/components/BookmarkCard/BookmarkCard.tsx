/* eslint-disable github/a11y-no-title-attribute */
"use client";

import { MyTag, MyTagGroup } from "@/components";
import { formatDistanceToNow, formatRFC7231 } from "date-fns";
import { ApiCallOptions, Bookmark } from "@/types";
import Link from "next/link";
import styles from "./styles.module.css";
import {  makeApiCall } from "@/scripts";
import { useAuthentication } from "@/hooks";
import { BiSolidArchiveIn, BiSolidEditAlt, BiSolidTrash } from "react-icons/bi";
import { AiFillRead } from "react-icons/ai";





export function BookmarkCard({ bookmarkData, onDelete }: { bookmarkData: Bookmark, onDelete: (id:number)=>void }) {
  const emptyTag = <div className={styles["no-tags"]}>No tags</div>;
  const { AuthenticationState } = useAuthentication();
  function createArchive(){
    const success = (response: any) => {
      //asdasd
    };
    const option: ApiCallOptions = {
      endpoint: `/bookmarks/${Number.parseInt(bookmarkData.id!)}/archive`,
      method: "POST",
      headers: {
        Authorization: "Bearer ".concat(AuthenticationState.token),
      },
      successCallback: success,
    };
    makeApiCall(option);

  }
  

  return (
    <>
      <div className={styles["card"]}>
        <div className={styles["title"]}>
          
          <a href={bookmarkData.url} target="_blank" rel="noopener">
            {bookmarkData.title ? bookmarkData.title : bookmarkData.url}
          </a>
          &nbsp;
          {
          bookmarkData.archiveCount.count
          ? <Link href={`showArchive/${bookmarkData.id}`}><AiFillRead className="react-icons" aria-label="View archive"  title="View archive"/></Link> 
          : <BiSolidArchiveIn className="react-icons" aria-label="Create archive"  title="Create archive" />
          }
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

          <BiSolidEditAlt className="react-icons" aria-label="Edit"  title="Edit"/> | 
      
      
      
              <Link href="#" onClick={(e)=>{e.preventDefault(); onDelete(Number.parseInt(bookmarkData.id!)) }} >
                <BiSolidTrash className="react-icons" aria-label="Delete"  title="Delete" />
              </Link>
              
           
        </div>
      </div>
    </>
  );
}