import {
  DEFAULT_FAILURE_CALLBACK,
  DEFAULT_FINALLY_CALLBACK,
  DEFAULT_HEADERS,
  DEFAULT_TIMEOUT_IN_MILISECONDS,
  EMPTY_BODY,
  EMPTY_PARAM,
  getBackendURL,
} from ".";
import axios, { AxiosRequestConfig } from "axios";

import { ApiCallOptions } from "@/types";
import { getPageFiles } from "next/dist/server/get-page-files";

export async function makeApiCall(
  options: ApiCallOptions,
  async: boolean = false
) {
  const processedEndpoint = options.endpoint;
  const url = (await getBackendURL()).concat(processedEndpoint);
  const config: AxiosRequestConfig = {
    method: options.method,
    url: url,
    data: options.body ? options.body : EMPTY_BODY,
    timeout: options.timeout ? options.timeout : DEFAULT_TIMEOUT_IN_MILISECONDS,
    headers: {
      ...DEFAULT_HEADERS,
      ...options.headers,
    },
    params: options.requestParams ? options.requestParams : EMPTY_PARAM,
  };
  console.log(config);
  async ? apiFetchAsync(config, options) : apiFetchSync(config, options);
}

async function apiFetchSync(
  config: AxiosRequestConfig,
  options: ApiCallOptions
) {
  try {
    const response = await axios(config);
    options.successCallback(response);
  } catch (error) {
    getFailureCallback(options)(error);
  } finally {
    getFinallyCallback(options)();
  }
}

async function apiFetchAsync(
  config: AxiosRequestConfig,
  options: ApiCallOptions
) {
  axios(config)
    .then((response) => options.successCallback(response))
    .catch((error) => getFailureCallback(options)(error))
    .finally(() => getFinallyCallback(options)());
}

function getFailureCallback(options: ApiCallOptions) {
  return options.failureCallback
    ? options.failureCallback
    : DEFAULT_FAILURE_CALLBACK;
}

function getFinallyCallback(options: ApiCallOptions) {
  return options.finallyCallback
    ? options.finallyCallback
    : DEFAULT_FINALLY_CALLBACK;
}
