"use client";

import { ApiCallOptions, Bookmark } from "@/types";
import { useAuthentication, useBookmarksPageMultiSelection } from "@/hooks";

import { makeApiCall } from "@/scripts";
import { useMemo } from "react";

export function BulkToolbar({ bookmarks, refetchData }: { bookmarks: Bookmark[], refetchData: () => void }) {
  const {
    selectedBookmarks,
    isSelectionMode,
    toggleSelectionMode
  } = useBookmarksPageMultiSelection();

  const {AuthenticationState} = useAuthentication();
  const {token} = AuthenticationState;

  const { onScreenCount, totalSelected } = useMemo(() => {
    const onScreenCount = bookmarks.filter((b) =>
      selectedBookmarks.includes(Number.parseInt(b.id!))
    ).length;
    const totalSelected = selectedBookmarks.length;
    return { onScreenCount, totalSelected };
  }, [bookmarks, selectedBookmarks]);

  const onDeletionSuccess = () => {
    refetchData();
    toggleSelectionMode();
  }

  const handleDelete = () => {
    const options: ApiCallOptions = {
      endpoint: "/bookmarks/bulk",
      method: "DELETE",
      headers: {
        Authorization: "Bearer ".concat(token),
      },
      body: { ids: selectedBookmarks.map(x=> x.toString()) },
      successCallback: onDeletionSuccess,
    };
    makeApiCall(options);
  };

  return (
    <div className="w-full ">
    <button
      className="button small-button m-2"
      onClick={toggleSelectionMode}
    >
      <svg
        role="presentation"
        xmlns="http://www.w3.org/2000/svg"
        className="inline-block mr-2 h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      {isSelectionMode ? "Exit Selection Mode" : "Select Multiple"}
    </button>

    {isSelectionMode && (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="space-y-1">
              <p className="text-sm font-medium ">Selected: {totalSelected}</p>
              <p className="text-sm text-gray-500">On screen: {onScreenCount}</p>
            </div>
            {totalSelected > 0 ? (
              <div className="flex space-x-2">
                <button
                  // className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                  className="button small-button my-2 alert-button"
                  onClick={handleDelete}
                >
                  <svg
                    role="presentation"
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline-block mr-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
                <button
                  // className="px-3 py-1 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
                  className="button small-button my-2"
                  
                >
                  <svg
                    role="presentation"
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline-block mr-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                  Archive
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Select items to perform actions</p>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
  );
}
