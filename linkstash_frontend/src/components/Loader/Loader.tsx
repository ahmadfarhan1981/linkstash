"use client";
import { ReactNode } from "react";
import styles from "./Loader.module.css";

export function Loader({
  isLoading,
  text="",
  children,
}: {
  isLoading: boolean;
  text?: string;
  children: ReactNode;
}): ReactNode {
  if (isLoading ) {
    return (
      <div className="w-auto items-center justify-between flex flex-col">
        <div className={styles["ball-loader"]/*.concat(" border-2")*/}>
          <div className={[styles["ball-loader-ball"], styles.ball1].join(" ")}></div>
          <div className={[styles["ball-loader-ball"], styles.ball2].join(" ")}></div>
          <div className={[styles["ball-loader-ball"], styles.ball3].join(" ")}></div>
        </div>
        {text && <div>{text}</div>}
      </div>
    );
  } else {
    return children;
  }
}
