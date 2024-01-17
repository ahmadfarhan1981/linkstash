'use server'



export async function  getBackendURL():Promise<string>{
    const _ = require('lodash')
    return  _.trimEnd(process.env.BACKEND_URL?.trimEnd(), '/')
}

export async function  getTokenCookieName():Promise<string>{
    return  process.env.TOKEN_COOKIE_NAME?process.env.TOKEN_COOKIE_NAME:""
}

