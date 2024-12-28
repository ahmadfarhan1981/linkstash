"use client";

import { AuthenticatedSection, LoadingSpinner } from "@/components";
import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "react-aria-components";

import { ApiCallOptions } from "@/types";
import { makeApiCall } from "@/scripts";
import { useAuthentication } from "@/hooks";
import { useState } from "react";

export default function FileUploadForm() {
  const { AuthenticationState } = useAuthentication();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setUploadStatus({
        type: "error",
        message: "Please select a file to upload.",
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append("file", file);

    const apiOptions: ApiCallOptions = {
      endpoint: "/import",
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Bearer ".concat(AuthenticationState.token),
        "content-type": "multipart/form-data",
      },
      timeout: process.env.IMPORT_TIMEOUT,
      successCallback: (_response: any) => {
        setUploadStatus({
          type: "success",
          message: "File uploaded successfully!",
        });
      },
      failureCallback: (err: any) => {
        setUploadStatus({
          type: "error",
          message: "Failed to upload file. Please try again." + err,
        });
      },
      finallyCallback:()=>{
        setIsUploading(false)
      },
    };    
    makeApiCall(apiOptions, true);    
  };

  return (
    <AuthenticatedSection>
    <Table
      aria-label="Import"
      className={"border-[1px] border-black border-solid w-full"}
    >
      <TableHeader className={"border-[1px] border-black bg-purple-100"}>
        <Column
          className={"justify-start justify-items-start w-7/12"}
          isRowHeader
        >
          Import
        </Column>
      </TableHeader>

      <TableBody>
        <Row>
          <Cell>
          <details>
  <summary>Accepts Netscape bookmark file format</summary>
  <div className="p-6">
    <p><b>Netscape bookmark file</b></p>
  <p>
      The Netscape bookmark file format is an HTML-based format used by many <br />
      browsers for exporting and importing bookmarks. It typically contains <br />
      bookmark data structured as nested lists of links, allowing browsers to <br />
      recreate bookmark folders and individual bookmarks.<br />
      Each bookmark is represented by an &lt;A&gt; tag with attributes like <br />
      <code>HREF</code> (for the URL), <code>ADD_DATE</code> (the date when the <br />
      bookmark was added), and sometimes others like <code>LAST_VISIT</code> <br />
      or <code>ICON</code> for associated metadata.<br />
    </p>

    <p>How to export from various systems:</p>

    <p><b>Firefox</b></p>
    <ol>
      <li>Click the Library button (or press <b>Ctrl+Shift+B</b>).</li>
      <li>Select <b>Bookmarks</b> and then <b>Show All Bookmarks</b>.</li>
      <li>Click on the <b>Import and Backup</b> button.</li>
      <li>Select <b>Export Bookmarks to HTML...</b> and save the file.</li>
    </ol>

    <p><b>Chrome</b></p>
    <ol>
      <li>Click the three-dot menu in the top-right corner and select <b>Bookmarks</b>, then <b>Bookmark Manager</b>.</li>
      <li>Click on the three-dot menu in the Bookmark Manager page.</li>
      <li>Select <b>Export bookmarks</b> and save the file.</li>
    </ol>

    <p><b>Pinboard</b></p>
    <ol>
      <li>Log in to your Pinboard account.</li>
      <li>Go to the <b>Settings</b> page.</li>
      <li>Under the <b>Export</b> section, click on the option to export your bookmarks as an HTML file.</li>
    </ol>

    <p><b>Linkding</b></p>
    <ol>
      <li>Log in to your Linkding instance.</li>
      <li>Go to the <b>Admin panel</b>.</li>
      <li>Click on the <b>Export Bookmarks</b> option to generate an HTML file in Netscape format.</li>
    </ol>
  </div>
</details>

          </Cell>
        </Row>
        <Row>
          <Cell>
            <div className="mx-auto mb-6 p-6 bg-white rounded shadow-md w-11/12">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="file-upload"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Select file to import
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className={
                      "file:button file:small-button block w-full text-sm text-gray-500 file:hover:scale-100"
                    }
                    // className="block w-full text-sm text-gray-500
                    //   file:mr-4 file:py-2 file:px-4
                    //   file:rounded-md file:border-0
                    //   file:text-sm file:font-semibold
                    //   file:bg-blue-50 file:text-blue-700
                    //   hover:file:bg-blue-100"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!file || isUploading}
                  className="button submit-button disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  // className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? <><LoadingSpinner />Uploading...</> : "Upload File"}
                </button>
              </form>
              {uploadStatus && (
                <div
                  className={`mt-4 p-4 rounded-md ${uploadStatus.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                  role="alert"
                >
                  <p>{uploadStatus.message}</p>
                </div>
              )}
            </div>
          </Cell>
        </Row>
      </TableBody>
    </Table>
    </AuthenticatedSection>
  );
}
