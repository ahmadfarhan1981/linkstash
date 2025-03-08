/* eslint-disable github/a11y-no-title-attribute */
"use client";
import React, {useState} from 'react';

import {FetchTagsOptions, TagListItem} from '@/types';
import {useQuerySelector, useUpdateQuery} from '@/components/Providers/QueryStateProvider/QueryStateProvider';
import {TagInput} from '@/components';

type TagCloudConfig = {
  tags: TagListItem[];
  setFetchTagsOption: React.Dispatch<React.SetStateAction<FetchTagsOptions>>;
  simpleTags : string[];
};

export function TagCloud({  tags, setFetchTagsOption, simpleTags }: TagCloudConfig) {

  const anyTags =useQuerySelector('anyTags');
  const allTags = useQuerySelector('allTags');


  const updateQuery = useUpdateQuery();
  function FilterPane() {
    return (

      <div id="filterpane">
        {tags && tags.length > 0 && (
          <TagInput
            tagsToChooseFrom={simpleTags}
            selectedTags={allTags}
            onSelectedTagsChange={t=>updateQuery('allTags', t )}
            label={"Include all tags:"}
            selectedTagsLabel={"All"}
          />
        )}
        <hr />
        {tags && tags.length > 0 && (
          <TagInput
            tagsToChooseFrom={simpleTags}
            selectedTags={anyTags}
            onSelectedTagsChange={t=>updateQuery('anyTags', t )}
            label={"Include any tags:"}
            selectedTagsLabel={"Any:"}
          />
        )}

      </div>
    );
  }
  const [showFilterPane, setShowFilterPane] = useState(anyTags.length > 0 || allTags.length > 0);
  return (
    <div className="tag-cloud">
      <div id="tag_cloud_header">
        <p>
          Sort by:{" "}
          <button
            className="button"
            onClick={() => {
              setFetchTagsOption((prevState) => {
                if (prevState.sortBy !== "numBookmarks") {
                  return { sortBy: "numBookmarks", sortDirection: "DESC" };
                } else {
                  return {
                    sortBy: "numBookmarks",
                    sortDirection:
                      prevState.sortDirection === "DESC" ? "ASC" : "DESC",
                  };
                }
              });
            }}
          >
            Top tags
          </button>
          <button
            className="button"
            onClick={() => {
              setFetchTagsOption((prevState) => {
                if (prevState.sortBy !== "name") {
                  return { sortBy: "name", sortDirection: "ASC" };
                } else {
                  return {
                    sortBy: "name",
                    sortDirection:
                      prevState.sortDirection === "DESC" ? "ASC" : "DESC",
                  };
                }
              });
            }}
          >
            Alphabetical
          </button>
          ‧{" "}
        </p>
      </div>
      <button
        className="button"
        onClick={() => {
          setShowFilterPane((old) => {
            return !old;
          });
        }}
      >
        {showFilterPane ? "Hide" : "Show"} filter pane
      </button>
      <div className={"mb-3"} ></div>
      {showFilterPane ? <FilterPane></FilterPane> : null}

      <div className="text-gray-600">
        {tags &&
          tags.map((tag) => {
            return (
              <>
                <a id={`tagcloud-${tag.name}}`}
                  key={`tagcloud-${tag.name}}`}
                  href={`/tags/${tag.name}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowFilterPane(true);
                    updateQuery("allTags", [...allTags, tag.name]);
                  }}
                  className=""
                >
                  {tag.name}
                  {tag.numBookmarks ? `(${tag.numBookmarks})` : ""}{" "}
                </a>{" "}
                &nbsp;
              </>
            );
          })}
      </div>
    </div>
  );
}
