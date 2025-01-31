"use client";

import { BookmarkCardBottomBar } from "./subcomponents/BookmarkCardBottomBar";
import BookmarkCardContext from "./BookmarkCardContext";
import { BookmarkCardContextProps } from "@/types/props";
import { BookmarkCardDescriptions } from "./subcomponents/BookmarkCardDescriptions";
import { BookmarkCardTagGroup } from "./subcomponents/BookmarkCardTagGroup";
import { BookmarkCardTitle } from "./subcomponents/BookmarkCardTitle";
import { ReactNode } from "react";
import styles from "./styles.module.css";

export function BookmarkCard( props: { contents : ReactNode , contextProps: BookmarkCardContextProps}) {
  const {contextProps, contents} = props;
  return (
    <>
    <BookmarkCardContext.Provider value={contextProps}>    
      <div className={styles["card"]}>
       {contents}
      </div>
      </BookmarkCardContext.Provider>
    </>
  );
}
    
BookmarkCard.Title = BookmarkCardTitle
BookmarkCard.Descriptions = BookmarkCardDescriptions
BookmarkCard.TagGroup = BookmarkCardTagGroup
BookmarkCard.BottomBar = BookmarkCardBottomBar