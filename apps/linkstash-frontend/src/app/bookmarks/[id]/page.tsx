"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { ApiCallOptions, Bookmark } from "@/types";
import {
  AuthenticatedSection,
  BookmarkForm,
  BookmarkFormData,
} from "@/components";
import { makeApiCall } from "@/scripts";
import { useAuthentication } from "@/hooks";


export default function Home() {
  const params = useParams();
  const id = Number.parseInt((params as { id: string }).id) ;
  const router = useRouter()
  const { AuthenticationState } = useAuthentication();
  const {isLoggedIn, token} = AuthenticationState;
  const [isBookmarkFetched, setIsBookmarkFetched] = useState(false);
  const [bookmark, setBookmark] = useState<Bookmark>();

  useEffect(() => {
    {
      if (!isLoggedIn) return;
      const success = (response: any) => {
        setBookmark(response.data);
        setIsBookmarkFetched(true);
      };

      const option: ApiCallOptions = {
        endpoint: `/bookmarks/${id}`,
        method: "GET",
        headers: {
          Authorization: "Bearer ".concat(token),
        },
        successCallback: success,
      };
      makeApiCall(option);
    }
  }, [isLoggedIn, token, id]);

  useEffect(() => {
    if (!isBookmarkFetched) return;

    setFormData({
      url: bookmark?.url,
      title: bookmark?.title,
      description: bookmark?.description,
      tagList: bookmark?.tagList,
    });
  }, [bookmark, isBookmarkFetched]);

  async function editBookmark(form: BookmarkFormData) {
    const success = async (_response: any) => {
      router.push("/bookmarks");
    };
    const options: ApiCallOptions = {
      endpoint: `/bookmarks/${id}`,
      method: "PATCH",
      headers: {
        Authorization: "Bearer ".concat(token),
      },
      body: form,
      successCallback: success,
    };
    await makeApiCall(options);
  }
  const [formData, setFormData] = useState<BookmarkFormData>({});

  return (
    <>
      <AuthenticatedSection className="inline w-full" loginPrefixComponent={<>Please login to continue</>}>
      <BookmarkForm
        title="Edit a bookmark"
        formData={formData}
        handleSubmit={editBookmark}
        setFormData={setFormData}
        submitButtonText="Edit bookmark"
      />
      </AuthenticatedSection>
    </>
  );
}
