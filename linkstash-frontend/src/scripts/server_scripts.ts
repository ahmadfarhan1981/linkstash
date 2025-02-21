'use server'


import {trimEnd} from 'lodash-es';
export async function  getBackendURL():Promise<string>{

    return  trimEnd(process.env.BACKEND_URL?.trimEnd(), '/')
}



