import { ApiCallOptions, TagListItem } from "@/types";
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
import {ListData} from 'react-stately'


// TODO refactor. this is a mess, move everything that can be done client side together, then only send everything to the server side, 
//      only process the endpoints client side, then pass to server to get the backend url
export async function makeApiCall(
  options: ApiCallOptions,
  async: boolean = false,
  printRequests: boolean = false
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
  if( printRequests ) console.log(JSON.stringify(config));
  async ? apiFetchAsync(config, options) : await apiFetchSync(config, options);
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


export function whereStringBuilder(filterBy:string, anyTagsList:ListData<TagListItem>, allTagsList:ListData<TagListItem>):string{
  const generateFilterList = (currentValue:TagListItem):string => {return `{"tagList": {"regexp":"\\"${currentValue.name }\\""}}`}

  const allTagsFilter = allTagsList.items.map(generateFilterList).join(",")
  const anyTagsFilter = anyTagsList.items.map(generateFilterList).join(",")
  const filterByFilter=filterBy ?`
                {
                    "title": {
                        "like": "%${filterBy}%"
                    }
                },
                {
                    "url": {
                        "like": "%${filterBy}%"
                    }
                },
                {
                    "description": {
                        "like": "%${filterBy}%"
                    }
                }`:""

  const whereString = `
   "where":{
      "and":[
         {
            "or": [{"and":[${allTagsFilter}]}, {"or":[${anyTagsFilter}]}]
         },
         {
            "or":[
                ${filterByFilter}
              ]
         }
      ]
   }

`
return whereString
}