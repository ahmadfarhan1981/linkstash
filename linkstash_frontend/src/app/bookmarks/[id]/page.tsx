"use client";

import { ApiCallOptions, Bookmark, TagListItem } from "@/types";
import {
  BookmarkForm,
  BookmarkFormData,
} from "@/components";
import { useEffect, useState } from "react";

import { makeApiCall } from "@/scripts";
import router from "next/router";
import { useAuthentication } from "@/hooks";
import { useListData } from "react-stately";

export default function Home({ params }: { params: { id: number } }) {
  const { AuthenticationState } = useAuthentication();

  const [allTags, setAllTags] = useState<TagListItem[]>([]);
  const [isTagFetched, setIsTagFetched] = useState(false);
  const [isBookmarkFetched, setIsBookmarkFetched] = useState(false);
  const [bookmark, setBookmark] = useState<Bookmark>();

  const tagList = useListData({
    initialItems: [],
    getKey: (item: TagListItem) => item.id,
  });

  useEffect(() => {
    {
      if (!AuthenticationState.isLoggedIn) return;

      const success = (response: any) => {
        setBookmark(response.data);
        setIsBookmarkFetched(true);
      };

      const option: ApiCallOptions = {
        endpoint: `/bookmarks/${params.id}`,
        method: "GET",
        headers: {
          Authorization: "Bearer ".concat(AuthenticationState.token),
        },
        successCallback: success,
      };
      makeApiCall(option);
    }
  }, [AuthenticationState.isLoggedIn, AuthenticationState.token, params.id]);

  useEffect(() => {
    if (!isBookmarkFetched) return;

    setFormData({
      url: bookmark?.url,
      title: bookmark?.title,
      description: bookmark?.description,
      tagList: bookmark?.tagList,
    });

    bookmark?.tagList?.map((tag) => {
      tagList.append({ id: tag, name: tag });
    });
  }, [bookmark, isBookmarkFetched]);

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

  async function editBookmark(form: BookmarkFormData) {
    const success = async (_response: any) => {
      router.push("/bookmarks");
    };
    const options: ApiCallOptions = {
      endpoint: `/bookmarks/${params.id}`,
      method: "PATCH",
      headers: {
        Authorization: "Bearer ".concat(AuthenticationState.token),
      },
      body: form,
      successCallback: success,
    };
    await makeApiCall(options);
  }

  const [formData, setFormData] = useState<BookmarkFormData>({});

  

  return (
    <>
      <BookmarkForm
        formData={formData}
        isLoading={!isTagFetched && ! isBookmarkFetched}
        handleSubmit={editBookmark}
        setFormData={setFormData}
        tagList={tagList}
        allTags={allTags}
      ></BookmarkForm>
    </>
  );
}
