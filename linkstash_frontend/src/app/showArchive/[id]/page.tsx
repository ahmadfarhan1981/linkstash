"use client";

import { AuthenticatedSection, BookmarkCard, Loader } from "@/components";
import { formatDistanceToNow, formatRFC7231 } from "date-fns"
import { ApiCallOptions, Archive, Bookmark } from "@/types";
import { makeApiCall } from "@/scripts";
import { useAuthentication, useBookmarks } from "@/hooks";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BiSolidArchiveIn, BiSolidTrashAlt } from "react-icons/bi";
import { TfiNewWindow } from "react-icons/tfi";

export default function Home({ params }: { params: { id: number } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [archive, setArchive] = useState("");
  const { AuthenticationState } = useAuthentication();

  const[a,setA]=useState<Archive|null>(null)
  
  
  // var __html = require('../../1/archive.html.archive');
  const template = { __html: archive };

  const [bookmark, setBookmark] = useState<Bookmark>();
  useEffect(() => {
    {
      if (!AuthenticationState.isLoggedIn) return;

      const success = (response: any) => {
        setBookmark(response.data);
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

      const getArchiveSuccess = async (response: any) => {
        setA(response.data)
        const { Content } = response.data;


        setArchive(Content);
        setIsLoading(false);
      };
      const getArchiveOptions: ApiCallOptions = {
        endpoint: `/bookmarks/${params.id}/archive`,
        method: "GET",
        headers: {
          Authorization: "Bearer ".concat(AuthenticationState.token),
        },
        body: {},
        successCallback: getArchiveSuccess,
        finallyCallback: () => {
          setIsLoading(false);
        },
      };
      makeApiCall(getArchiveOptions);
    }
  }, [AuthenticationState.isLoggedIn, AuthenticationState.token, params.id]);  

  //TODO useBookmark
  const { deleteBookmark } =
    useBookmarks();
  return (
    <>
      <AuthenticatedSection>
        <Loader isLoading={isLoading}>
          
          <div className="w-full">{false && bookmark && <BookmarkCard bookmarkData={bookmark!} onDelete={(id)=>{deleteBookmark(id)}} ></BookmarkCard>}</div>
          <div className="grid">
            <h1>Archive of &lsquo;<b>{bookmark?.title}</b>&rsquo;<BiSolidTrashAlt className="react-icons text-black hover:cursor-pointer" aria-label="Delete archive"  title="Delete archive" /></h1> 
          </div>
          <p id="metadata">Retrieved {a && formatRFC7231(a.DateRetrieved)}</p>{" "}
          <p id="title" dir="auto">
            {bookmark && bookmark.url}
          </p>{" "}
          <div id="links">
            {bookmark && <a href={bookmark.url!} target="new">View original<TfiNewWindow className="react-icons align-baseline" aria-label="Open link in new window"  title="Open link in new window" /></a>}
          </div>
          <div dangerouslySetInnerHTML={template} className="border-2"></div>
        </Loader>
      </AuthenticatedSection>
    </>
  );
}
