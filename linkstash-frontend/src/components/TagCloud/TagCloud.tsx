/* eslint-disable github/a11y-no-title-attribute */
"use client";

import { fetchTagsOptions, useTags } from "@/hooks/useTags";
import { useEffect, useState } from "react";

import { ListData } from "react-stately";
import { TagInput } from "@/components/Default";
import { TagListItem } from "@/types";
import { useAuthentication } from "@/hooks";


type TagCloudConfig = {
  anyFilterTags: ListData<TagListItem>;
  allFilterTags: ListData<TagListItem>;
};

export function TagCloud({ anyFilterTags, allFilterTags }: TagCloudConfig) {
  const { fetchTags, tags } = useTags();
  const { AuthenticationState } = useAuthentication();
  const [fetchTagsOption, setFetchTagsOption] = useState<fetchTagsOptions>({
    sortBy: "numBookmarks",
    sortDirection: "DESC",
  });
  useEffect(() => {
    {
      if (!AuthenticationState.isLoggedIn) return;
      fetchTags({
        sortBy: fetchTagsOption.sortBy,
        sortDirection: fetchTagsOption.sortDirection,
      });
    }
  }, [
    AuthenticationState.isLoggedIn,
    AuthenticationState.token,
    fetchTagsOption.sortBy,
    fetchTagsOption.sortDirection,
    fetchTagsOption,
  ]);

  function FilterPane() {
    return (
      <div id="filterpane">
        {tags && tags.length > 0 && (
          <TagInput
            selectedTags={allFilterTags}
            tagsToChooseFrom={tags}
            // maxWidthInPixel={20}
            inputLabel={"Include all tags:"}
            selectedLabel={"All:"}
            description="Filter must incliude all:"
          />
        )}
        {tags && tags.length > 0 && (
          <TagInput
            selectedTags={anyFilterTags}
            tagsToChooseFrom={tags}
            // maxWidthInPixel={20}
            inputLabel={"Include any tags"}
            selectedLabel={"Any:"}
            description="Filter must include at least one:"
          />
        )}
      </div>
    );
  }
  const [showFilterPane, setShowFilterPane] = useState(false);
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
                    allFilterTags.append(tag);
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
