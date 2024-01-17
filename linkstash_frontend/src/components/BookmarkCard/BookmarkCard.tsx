"use client"

import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';

import {Bookmark} from '@/types'
import styles from "./styles.module.css";

// function fetchCard(){
//   const config:AxiosRequestConfig ={
//     URl:""
//   }
// }

export type BookmarkCardData = Bookmark | number

export default function BookmarkCard({bookmarkData}:{bookmarkData:BookmarkCardData}) {
  const [data, setData] = useState<Bookmark>({})
   
  useEffect( () => {
    if ( typeof bookmarkData === "number"){
      //TODO load bookmark data based on the bookmark ID
    }else{
      setData(bookmarkData)              
    }
  },[bookmarkData])
  

  return (
    
    <div className={styles["card"]}>
      <div className={styles["title"]}>
        <a
          href={(bookmarkData as Bookmark).url}
          target="_blank"
          rel="noopener"
        >
          {(bookmarkData as Bookmark).title}
        </a>
      </div>

      <div className={styles["description"]} >
        {(bookmarkData as Bookmark).description}
      </div>

      <div className={styles["tags"]}>
        <span>
          <a href="?q=%23css">#css</a>
          <a href="?q=%23web-dev">#web-dev</a>
        </span>
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
  );

    /**
     * 
     * <div className={styles["card"]}>
      <div className={styles["title"]}>
        <a
          href="https://www.joshwcomeau.com/css/interactive-guide-to-grid/"
          target="_blank"
          rel="noopener"
        >
          An Interactive Guide to CSS Grid
        </a>
      </div>

      <div className={styles["description"]} >
        CSS Grid is an incredibly powerful tool for building layouts on the web,
        but like all powerful tools, there's a significant learning curve. In
        this tutorial, we'll build a mental model for how CSS Grid works and how
        we can use it effectively. I'll share the biggest 💡 lightbulb moments
        I've had in my own learning journey.
      </div>

      <div className={styles["tags"]}>
        <span>
          <a href="?q=%23css">#css</a>
          <a href="?q=%23web-dev">#web-dev</a>
        </span>
      </div>

      <div className={styles["commands"]}>
        <a
          href="https://web.archive.org/web/20240104032528/https://www.joshwcomeau.com/css/interactive-guide-to-grid/"
          title="Show snapshot on the Internet Archive Wayback Machine"
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
     * 
     * 
     */




}
