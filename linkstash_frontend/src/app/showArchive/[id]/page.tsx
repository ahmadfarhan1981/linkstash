"use client";

import { AuthenticatedSection, Loader } from "@/components";

import { ApiCallOptions } from "@/types";
import { makeApiCall } from "@/scripts";
import { useAuthentication } from "@/hooks";
import { useState } from "react";

export default function Home({ params }: { params: { id: number } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [archive, setArchive] = useState("");
  const { AuthenticationState } = useAuthentication();

  const success = async (response: any) => {
    const { Content } = response.data;
    setArchive(Content);
    setIsLoading(false);
  };
  const options: ApiCallOptions = {
    endpoint: `/bookmarks/${params.id}/archive`,
    method: "GET",
    headers: {
      Authorization: "Bearer ".concat(AuthenticationState.token),
    },
    body: {},
    successCallback: success,
    finallyCallback: () => {
      setIsLoading(false);
    },
  };

  makeApiCall(options);
  const __html = archive;
  // var __html = require('../../1/archive.html.archive');
  var template = { __html: __html };
  return (
    <>
      <AuthenticatedSection>
        <Loader isLoading={isLoading}>
          <div>
            <h1>Arvhive of website bla bla</h1>
          </div>
          <p id="metadata">Added 6 December 2023, 10:19:30</p>{" "}
          <p id="title" dir="auto">
            https://tedium.co/2023/11/17/3m-floppy-disks-history/
          </p>{" "}
          <div id="links">
            <a
              href="https://tedium.co/2023/11/17/3m-floppy-disks-history/"
              target="_blank"
              rel="noopener"
            >
              View Original
            </a>{" "}
            <a href="bookmark/5/archive">View Archive</a>
          </div>
          <div dangerouslySetInnerHTML={template} className="border-2"></div>
        </Loader>
      </AuthenticatedSection>
    </>
  );
}
