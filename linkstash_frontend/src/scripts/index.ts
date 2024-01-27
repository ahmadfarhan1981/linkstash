export * from './server_scripts'

/**
 * Will generate a CSS class name that will apply both the global css and also the style modules's css class
 * 
 * @param styles the imported style module
 * @param name name of the css class 
 * @returns a string that has base css class and also the style's version of the class if available.
 */
export function generateClassNames (styles:any, name:string):string{
    return styles[name]?styles[name].concat(" ").concat(name):name
}


import axios, { AxiosHeaders, AxiosRequestConfig, RawAxiosRequestHeaders } from "axios"
import { getBackendURL } from './server_scripts'
import { ChangeEvent, SetStateAction } from 'react'


export type ApiEndpoint = "/whoAmI" | "/bookmarks" |"/users/login/"
export type ApiMethod = "GET" | "POST" | "DELETE" |"PATCH" | "PUT"
export type ApiCallOptions = {
    endpoint : ApiEndpoint,
    method: ApiMethod,
    headers: RawAxiosRequestHeaders,
    body: any,
    successCallback : Function,
    failureCallback: Function,
    finallyCallback: Function,

}
export async function makeApiCall(options:ApiCallOptions){
    const processedEndpoint = options.endpoint //TODO process url parameters
    const url =  (await getBackendURL()).concat(processedEndpoint) ;
    const config: AxiosRequestConfig = {
        method: options.method,
        url: url,
        data: options.body,
        timeout: 3000,
        headers: {
          "Content-Type": "application/json",
          ...options.headers
        },
      };
  
      axios(config)
        .then((response)=>options.successCallback(response))
        .catch((error)=>options.failureCallback(error))
        .finally(()=>options.finallyCallback());

}

export function handleFormChange(event: ChangeEvent<HTMLInputElement>, setter:SetStateAction<any>)  {
  const { name, value } = event.target;
  setter((prevFormData: any) => ({ ...prevFormData, [name]: value }));
};
