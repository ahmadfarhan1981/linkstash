'use client';

import {ApiCallOptions, Bookmark, BulkTagResult, TagListItem} from '@/types';
import {Toast, useToast} from '@/components/Providers/ToastProvider';
import {useAuthentication, useBookmarksPageMultiSelection} from '@/hooks';

import {AxiosResponse} from 'axios';
import {TagInput} from '@/components';

import {makeApiCall} from '@/scripts';
import {useListData} from 'react-stately';
import {useMemo} from 'react';



export function BulkToolbar({bookmarks, refetchData, tags}: {bookmarks: Bookmark[], refetchData: () => void, tags: TagListItem[]}) {
  const {
    selectedBookmarks,
    isSelectionMode,
    toggleSelectionMode,
    selectBookmark,
    clearSelection
  } = useBookmarksPageMultiSelection();

  const {AuthenticationState} = useAuthentication();
  const {token} = AuthenticationState;
  const selectedTags = useListData({
    initialItems: [],
    getKey: (item: TagListItem) => item.name,
  });
  const {onScreenCount, totalSelected} = useMemo(() => {
    const onScreenCount = bookmarks.filter((b) =>
      selectedBookmarks.includes(Number.parseInt(b.id!)),
    ).length;
    const totalSelected = selectedBookmarks.length;
    return {onScreenCount, totalSelected};
  }, [bookmarks, selectedBookmarks]);

  const {addToast} = useToast();



  function generateToastFromResult(response:AxiosResponse):Toast{
    const bulkTagResult:BulkTagResult = response.data;
    const successCount:number = bulkTagResult.success.length;
    const failureCount:number = bulkTagResult.failure.length;
    const result:Toast = {} as Toast;
    if(failureCount === 0){
      result.summary = (<span>Bulk actions successful</span>)
      result.details = (<span>✔ All {successCount} actions completed successfully</span>)
    }else{
      result.summary = (<span>⚠ {failureCount} item failed during bulk action</span>)
      result.details = (<div>{bulkTagResult.failure.map(failure => <div key={failure.bookmarkId + failure.tag}>⚠ BookmarkId : {failure.bookmarkId}. Tag: {failure.tag}. Message: {failure.message}</div>)}</div>)
    }
    result.timeout = 7000;
    return result;
  }
  const refetchDataAndResetForm = (response:AxiosResponse) => {
    addToast(generateToastFromResult(response));
    refetchData();
    selectedTags.remove( ... selectedTags.items.map(i=>i.id) );
    toggleSelectionMode();
  };

  const handleDelete = () => {
    const options: ApiCallOptions = {
      endpoint: '/bookmarks/bulk',
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer '.concat(token),
      },
      body: {ids: selectedBookmarks.map(x => x.toString())},
      successCallback: refetchDataAndResetForm,
    };
    makeApiCall(options, false);
  };

  const handleBulkAddTags = () =>{

    const options: ApiCallOptions = {
    endpoint: '/bookmarks/tags/bulk',
    method: 'POST',
    headers: {
      Authorization: 'Bearer '.concat(token),
    },
    body: {
      bookmarkIds: selectedBookmarks.map(x => x.toString()),
      tags: selectedTags.items.map(x => x.name)
    },
    successCallback: refetchDataAndResetForm,
  };

  makeApiCall(options, false);
  }

  const handleBulkRemoveTags = () =>{
    const options: ApiCallOptions = {
      endpoint: '/bookmarks/tags/bulk',
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer '.concat(token),
      },
      body: {
        bookmarkIds: selectedBookmarks.map(x => x.toString()),
        tags: selectedTags.items.map(x => x.name)
      },
      successCallback: refetchDataAndResetForm,
    };

    makeApiCall(options, false);
  }

  function selectAllBookmarks():void {
    bookmarks.forEach(value => {
      if (!selectedBookmarks.includes(Number.parseInt(value.id!)) ) selectBookmark(Number.parseInt(value.id!))
      }
    )
  }


  return (
    <div className="w-full">
      <button className="button small-button m-2" onClick={toggleSelectionMode}>
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
        {isSelectionMode ? 'Exit bulk selection mode' : 'Select Multiple'}
      </button>
      {isSelectionMode && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 ">
            <div
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="space-y-1">
                <p className="text-sm font-medium ">
                  Selected: {totalSelected}
                </p>
                <p className="text-sm text-gray-500">
                  On screen: {onScreenCount}
                </p>
                <p>
                  <button className={"underline hover:cursor-pointer"} onClick={selectAllBookmarks} > Select all on screen</button>
                <br />
                  <button className={"underline hover:cursor-pointer"} onClick={clearSelection} > Clear selection</button>
                </p>
              </div>
              {totalSelected > 0 ? (
                <div>
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
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Select items to perform actions
                </p>
              )}
            </div>
            {isSelectionMode &&(

              <div className="border-0">
                <hr  className={"mt-3 mb-2"}/>
                <div><h3>Bulk tag operations</h3></div>
                <div className="">
                  <TagInput
                    inputLabel="Tags for operation"
                    tagsToChooseFrom={tags}
                    description="Run action on with selected tags"
                    selectedTags={selectedTags}
                  />
                </div>
                <div className="">
                  <button
                    disabled={selectedTags.items.length === 0}
                    className="button small-button inline"
                    onClick={handleBulkAddTags}
                  >
                    <svg
                      className="inline"
                      role="presentation"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                    <span className="inline">Add to all</span>
                  </button>
                  <button
                    disabled={selectedTags.items.length === 0}
                    className="button small-button alert-button inline mx-2"
                    onClick={handleBulkRemoveTags}
                  >
                    <svg
                      className="inline"
                      role="presentation"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"

                    >
                      <path d="M5 12h14" />
                    </svg>
                    <span className="inline">Remove from all</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) }
    </div>
  );
}
