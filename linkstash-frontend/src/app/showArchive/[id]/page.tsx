"use client";

import { ApiCallOptions, Archive, Bookmark } from "@/types";
import { AuthenticatedSection, BookmarkCard, Loader } from "@/components";
import { useAuthentication, useBookmarks } from "@/hooks";
import { useEffect, useState } from "react";

import { BiSolidTrashAlt } from "react-icons/bi";
import Link from "next/link";
import { Roboto } from "next/font/google";
import { TfiNewWindow } from "react-icons/tfi";
import { formatRFC7231 } from "date-fns";
import { makeApiCall } from "@/scripts";
import { useRouter } from "next/navigation";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  style: ["italic", "normal"],
});
export default function Home({ params }: { params: { id: number } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [archiveData, setArchiveData] = useState("");
  const { AuthenticationState } = useAuthentication();

  const [archive, setArchive] = useState<Archive | null>(null);
  const template = { __html: archiveData };
  const [bookmark, setBookmark] = useState<Bookmark>();
  useEffect(() => {
    if (!AuthenticationState.isLoggedIn) return;

    const success = (response: any) => {
      setBookmark(response.data);
    };

    const getBookmarksOption: ApiCallOptions = {
      endpoint: `/bookmarks/${params.id}`,
      method: "GET",
      headers: {
        Authorization: "Bearer ".concat(AuthenticationState.token),
      },
      successCallback: success,
    };
    makeApiCall(getBookmarksOption);

    const getArchiveSuccess = async (response: any) => {
      const { Content } = response.data;
      setArchive(response.data);
      setArchiveData(Content);
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
  }, [AuthenticationState.isLoggedIn, AuthenticationState.token, params.id]);

  const { deleteBookmark, deleteArchive } = useBookmarks();
  const router = useRouter();
  return (
    <>
      <AuthenticatedSection>
        <Loader isLoading={isLoading}>
          {bookmark ? (
            <>
              {/* <div className="w-full">{false && bookmark && <BookmarkCard bookmarkData={bookmark!} handleDelete={(id)=>{deleteBookmark(id,()=>{})}} handleArchive={ (_id) => {}} ></BookmarkCard>}</div> */}
              <div className="grid">
                <h1>
                  Archive of &lsquo;<b>{bookmark.title}</b>&rsquo;{" "}
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteArchive(Number.parseInt(bookmark.id!), () => {
                        router.push("/bookmarks");
                      });
                    }}
                  >
                    <BiSolidTrashAlt
                      className="react-icons text-black hover:cursor-pointer"
                      aria-label="Delete archive"
                      title="Delete archive"
                    />
                  </Link>
                </h1>
              </div>
              <p id="metadata">
                Retrieved {archive && formatRFC7231(archive.DateRetrieved)}
              </p>{" "}
              <p id="title" dir="auto">
                {bookmark.url}
              </p>{" "}
              <div id="links">
                <a href={bookmark.url!} target="new">
                  View original
                  <TfiNewWindow
                    className="react-icons align-baseline"
                    aria-label="Open link in new window"
                    title="Open link in new window"
                  />
                </a>
              </div>
              <div
                dangerouslySetInnerHTML={template}
                className={`readability border-2 ${roboto.className}`}
              ></div>
            </>
          ) : (
            <p className="text-center">No bookmark found. Please try again.</p>
          )}
        </Loader>
      </AuthenticatedSection>
    </>
  );
}
