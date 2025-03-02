import {AxiosResponse, RawAxiosRequestHeaders} from 'axios';

export type ApiEndpoint =
  | "/whoAmI"
  | "/bookmarks"
  | "/users/login/"
  | `/bookmarks/${number}/archive`
  | `/bookmarks/${number}/archives`
  | `/bookmarks/${number}`
  | '/bookmarks/bulk'
  | '/bookmarks/bulk/tags'
  | '/bookmarks/bulk/archive'
  | '/tags'
  | '/users'
  | `/users/${string}`
  | `/users/${string}/permissions`
  | '/change-password'
  | '/signup'
  | '/import'
export type ApiMethod = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";
export type ApiCallOptions = {
  endpoint: ApiEndpoint;
  method: ApiMethod;
  headers?: RawAxiosRequestHeaders;
  body?: any;
  timeout?: number;
  requestParams?: Record<string, any>;
  successCallback: (response: AxiosResponse)=>void;
  failureCallback?: (err: any) => void;
  finallyCallback?: () => void;
};

export type BulkTagResult = {
  success: {bookmarkId: string, tag: string, message?: string}[],
  failure: {bookmarkId: string, tag: string, message: string}[],
};

type FetchTagsSortDirection = 'ASC' | 'DESC';
type FetchTagsSortBy = 'numBookmarks' | 'name';
export type FetchTagsOptions = {
  sortBy: FetchTagsSortBy
  sortDirection: FetchTagsSortDirection;
}