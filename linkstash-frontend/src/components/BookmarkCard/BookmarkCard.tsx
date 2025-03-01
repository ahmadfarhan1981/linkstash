"use client";

import {ReactNode} from 'react';

import { BookmarkCardContextProps } from "@/types/props";

import { BookmarkCardBottomBar } from "./subcomponents/BookmarkCardBottomBar";
import BookmarkCardContext from "./BookmarkCardContext";
import { BookmarkCardDescriptions } from "./subcomponents/BookmarkCardDescriptions";
import { BookmarkCardTagGroup } from "./subcomponents/BookmarkCardTagGroup";
import { BookmarkCardTitle } from "./subcomponents/BookmarkCardTitle";
import styles from "./styles.module.css";

interface BookmarkCardProps extends BookmarkCardContextProps {
  children?: ReactNode; // Add `children` support
}

export const BookmarkCard = ( { children, ...contextProps }: BookmarkCardProps ) => {
  return (
    <BookmarkCardContext.Provider value={contextProps}>
      <div className={styles["card"]}>
        {children || defaultCard}
      </div>
    </BookmarkCardContext.Provider>
  );
};

BookmarkCard.Title = BookmarkCardTitle;
BookmarkCard.Descriptions = BookmarkCardDescriptions;
BookmarkCard.TagGroup = BookmarkCardTagGroup;
BookmarkCard.BottomBar = BookmarkCardBottomBar;

const defaultCard = (
  <>
    <BookmarkCard.Title />
    <BookmarkCard.Descriptions />
    <BookmarkCard.TagGroup />
    <BookmarkCard.BottomBar />
  </>
)