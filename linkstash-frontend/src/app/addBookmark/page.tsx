"use client";

import { ApiCallOptions, TagListItem } from "@/types";
import {
  BookmarkForm,
  BookmarkFormData
} from "@/components";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { makeApiCall } from "@/scripts/index";
import { useAuthentication } from "@/hooks/useAuthentication";

/**
 * TODO indicator when fetching url metadata
 *  *
 */

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { AuthenticationState } = useAuthentication();

  const [allTags, setAllTags] = useState<TagListItem[]>([]);
  const [isTagFetched, setIsTagFetched] = useState(false);
  
  useEffect(() => {
    if (!AuthenticationState.isLoggedIn || isTagFetched) return;
    const success = async (response: any) => {
      const result = response.data.map((element: TagListItem) => {
        return { id: String(element.id), name: element.name } as TagListItem;
      });
      setAllTags(result);
      setIsTagFetched(true);
    };
    const options: ApiCallOptions = {
      endpoint: "/tags",
      method: "GET",
      headers: {
        Authorization: "Bearer ".concat(AuthenticationState.token),
      },
      successCallback: success,
    };
    makeApiCall(options, false, true);
  }, [AuthenticationState.isLoggedIn, AuthenticationState.token, isTagFetched]);

  const addBookmark = async (data: BookmarkFormData): Promise<void> =>  {
    const success = async (_response: any) => {
      if(url){//if called by bookmarklet
        window.close();
      }else{
        router.push("/bookmarks");  
      }
      
    };
    const options: ApiCallOptions = {
      endpoint: "/bookmarks",
      method: "POST",
      headers: {
        Authorization: "Bearer ".concat(AuthenticationState.token),
      },
      body: data,
      successCallback: success,
    };
    await makeApiCall(options);
  }


  const url = searchParams.get("url");
  const [formData, setFormData] = useState<BookmarkFormData>(url?{url:url}:{});    
  return (
    <>
      <BookmarkForm submitButtonText="Add bookmark" formData={formData} isLoading={!isTagFetched} handleSubmit={addBookmark} setFormData={setFormData} allTags={allTags}></BookmarkForm>      
    </>
  );
}
