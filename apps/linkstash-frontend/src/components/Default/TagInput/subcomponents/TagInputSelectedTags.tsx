import React from "react";

import { useTagInputContext } from "@/components/Default/TagInput/TagInputContext";

export function TagInputSelectedTags() {
  const { selectedTags, removeTag, selectedTagsLabel } = useTagInputContext();

  return (
    <>
      {/* Display selected tags */}
      <div className={"mt-3 flex flex-wrap w-[200px] "}>
        {selectedTagsLabel && selectedTags.length > 0 && (
          <div className={"w-full"}>{selectedTagsLabel}:</div>
        )}
        {selectedTags.length === 0 ? (
          <span>**no tags specified**</span>
        ) : (
          selectedTags.map((tag) => (
            <>
              <button
                className={"mb-2"}
                onClick={(e) => {
                  e.preventDefault();
                  removeTag(tag);
                }}
              >
                <span
                  className={
                    "font-light underline " +
                    " " +
                    "bg-blue-100 hover:bg-purple-300 " +
                    "rounded " +
                    "border-purple-200 border-2 border-solid " +
                    "before:content-['#'] after:content-[' '] before:font-medium " +
                    "cursor-pointer " +
                    "py-0 px-1"
                  }
                >
                  {tag}
                  <span className={"font-bold"}>&times;</span>
                </span>
              </button>
              &nbsp;
            </>
          ))
        )}
      </div>
    </>
  );
}
