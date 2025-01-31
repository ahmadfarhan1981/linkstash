import styles from  '../styles.module.css'
import { useBookmarkCardContext } from '../BookmarkCardContext';
export function BookmarkCardDescriptions(){
    const {bookmarkData} = useBookmarkCardContext();
    return (
        <div className={styles["description"]}>{bookmarkData.description}</div>
    )
}