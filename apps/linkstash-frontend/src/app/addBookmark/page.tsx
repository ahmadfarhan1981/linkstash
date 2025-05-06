"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ApiCallOptions } from "@/types";
import {
  AuthenticatedSection,
  BookmarkForm,
  BookmarkFormData
} from "@/components";
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
  const { token } = AuthenticationState;

  
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
        Authorization: "Bearer ".concat(token),
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
        <AuthenticatedSection className="inline w-full" loginPrefixComponent={<>Please login to continue</>} >
          <BookmarkForm title="Add a bookmark" submitButtonText="Add bookmark" formData={formData}  handleSubmit={addBookmark} setFormData={setFormData} ></BookmarkForm>      
      </AuthenticatedSection>
    </>
  );
}
