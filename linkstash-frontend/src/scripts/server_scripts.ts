'use server'



export async function  getBackendURL():Promise<string>{
    const _ = require('lodash')
    return  _.trimEnd(process.env.BACKEND_URL?.trimEnd(), '/')
}



