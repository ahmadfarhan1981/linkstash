import { DEFAULT_TOKEN_COOKIE_NAME, DEFAULT_USERID_COOKIE_NAME } from "./constants";

export function  getTokenCookieName():string{
    return  process.env.TOKEN_COOKIE_NAME?process.env.TOKEN_COOKIE_NAME:DEFAULT_TOKEN_COOKIE_NAME;
}

export function  getUserIdCookieName():string{
    return  process.env.USERID_COOKIE_NAME?process.env.USERID_COOKIE_NAME:DEFAULT_USERID_COOKIE_NAME;
}