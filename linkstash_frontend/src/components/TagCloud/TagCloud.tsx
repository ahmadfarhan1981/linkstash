"use client";
import { useEffect, useState } from "react";
import { useAuthentication } from "@/hooks";
import { ApiCallOptions, TagListItem } from "@/types";
import { makeApiCall } from "@/scripts";
import { InputComponent, TagInput } from "@/components/Default";

import {useListData} from 'react-stately'
/* eslint-disable github/a11y-no-title-attribute */
export function TagCloud() {
  const { AuthenticationState } = useAuthentication();
  const [allTags, setAllTags] = useState();
  useEffect(() => {
    {
      if (!AuthenticationState.isLoggedIn) return;

      const success = (response: any) => {
        setAllTags(response.data);
      };

      const option: ApiCallOptions = {
        endpoint: `/tags`,
        method: "GET",
        headers: {
          Authorization: "Bearer ".concat(AuthenticationState.token),
        },
        successCallback: success,
      };
      makeApiCall(option);
    }
  }, [AuthenticationState.isLoggedIn, AuthenticationState.token]);

  const allFilterTags = useListData({
    initialItems: [],
    getKey: (item: TagListItem) => item.id,
  });
  const anyFilterTags = useListData({
    initialItems: [],
    getKey: (item: TagListItem) => item.id,
  });

  function FilterPane(){
    return ( <div id="filterpane">
      {allTags && allTags.length > 0  && <TagInput
                  selectedTags={allFilterTags}
                  tagsToChooseFrom={allTags}
                  // maxWidthInPixel={20}
                  inputLabel={"Include all tags:"}
                  selectedLabel={"All:"}
                  description="Filter must incliude all:"
                />}
       {allTags && allTags.length > 0  && <TagInput
                  selectedTags={anyFilterTags}
                  tagsToChooseFrom={allTags}
                  // maxWidthInPixel={20}
                  inputLabel={"Include any tags"}
                  selectedLabel={"Any:"}
                  description="Filter must include at least one:"
                />}
      </div>)
  }

  const [showFilterPane, setShowFilterPane] = useState(false);
  return (
    <div className="tag-cloud">
      {/* <h1>{JSON.stringify(allTags)}</h1> */}
      <div id="tag_cloud_header">
        <p>
          <a
            className="tag_heading_selected"
            title="show a cloud of your most-used tags"
            href="?mode=cloud"
          >
            top tags &nbsp;&nbsp;
          </a>
          <a href="?mode=list&amp;floor=1" title="show a list of all your tags">
            all tags
          </a>
          ‧{" "}
          <a
            href="?mode=list&amp;floor=2"
            title="show tags with at least 2 bookmarks"
          >
            2
          </a>
          ‧{" "}
          <a
            href="?mode=list&amp;floor=5"
            title="show tags with at least 5 bookmarks"
          >
            5
          </a>
          ‧{" "}
          <a
            href="?mode=list&amp;floor=10"
            title="show tags with at least 10 bookmarks"
          >
            10
          </a>
          ‧{" "}
          <a
            href="?mode=list&amp;floor=20"
            title="show tags with at least 20 bookmarks"
          >
            20
          </a>
          ‧ <a href="/u:paan/tags/">manage</a>
        </p>
      </div>
      <button onClick={()=>{setShowFilterPane((old)=>{return !old})}}>Show/hide</button>
      {showFilterPane?<FilterPane></FilterPane>:null}


      <div className="text-gray-600">
        {allTags &&
          allTags.map((tag) => {
            return (
              <>
                <a href={`/tags/${tag.name}`} className="14.0.7 tag">
                  {tag.name}
                  {`(${tag.bookmarkIds.length})`}{" "}
                </a>{" "}
                &nbsp;
              </>
            );
          })}
      </div>
    </div>
  );
}
