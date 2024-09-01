import { RawAxiosRequestHeaders } from "axios";

export type ApiEndpoint =
  | "/whoAmI"
  | "/bookmarks"
  | "/users/login/"
  | `/bookmarks/${number}/archive`
  | `/bookmarks/${number}`
  | '/tags'
  | '/users'
export type ApiMethod = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";
export type ApiCallOptions = {
  endpoint: ApiEndpoint;
  method: ApiMethod;
  headers?: RawAxiosRequestHeaders;
  body?: any;
  timeout?: number;
  requestParams?: Record<string, any>;
  successCallback: Function;
  failureCallback?: (err: any) => void;
  finallyCallback?: () => void;
};
