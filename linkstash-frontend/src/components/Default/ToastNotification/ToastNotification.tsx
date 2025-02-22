import React, { useEffect, useState } from 'react';
import styles from './ToastNotification.module.css';




export function ToastNotification({
                                    summary,
                                    details,
                                    timeout = 7000, // default timeout of 5 seconds
                                    onClose = () => {}
                                  }:{summary:JSX.Element, details:JSX.Element, timeout?: number, onClose?: () => void}) {

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (timeout > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [timeout]);

  const handleClose = () => {
    onClose();
  };


  // Inline style to control maxHeight for smooth vertical expansion animation.
  const detailsStyle = {
    maxHeight: expanded ? '500px' : '0px'
  };

  return (
    <div className={`${styles.toast} shadow-lg`}>
      <div className="flex justify-between items-start">
        <div>
          <div className={styles.summary}>{summary}</div>
          <div className={styles.detailsContainer} style={detailsStyle}>
            <div className={styles.details}>
              {details}
            </div>
          </div>
        </div>
        <button onClick={handleClose} className={styles.closeBtn}>
          &times;
        </button>
      </div>
      <button onClick={() => setExpanded(!expanded)} className={styles.expandBtn}>
        {expanded ? 'Show Less' : 'Show More'}
      </button>
      <div
        className={styles.progressBar}
        style={{ animationDuration: `${timeout}ms` }}
      ></div>
    </div>
  );
}
