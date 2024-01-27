/* eslint-disable compat/compat */
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const ogs = require("open-graph-scraper");
  const url:string = req.url as string
  const { searchParams } = new URL( url );
  if (!searchParams.get("url"))
    return Response.json({ error: "Must provide URL" }, { status: 500 });

  const options = { url: searchParams.get("url") };
  const data = await ogs(options);
  const { result } = data;
  const success = result.success;
  const status = success ? 202 : 500;
  const body = success ? { data: result } : { error: result.error };
  return Response.json(body, { status: status });
}
