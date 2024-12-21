/* eslint-disable compat/compat */

import { ReadonlyURLSearchParams } from "next/navigation";


export function setUrlParam(param:string, value:string, searchParams:ReadonlyURLSearchParams){
    const params = new URLSearchParams(searchParams.toString());
    params.set(param, value);
    window.history.pushState(null, "", `?${params.toString()}`);
}