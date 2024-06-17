/* eslint-disable compat/compat */
import { NextRequest, NextResponse } from "next/server";
import ogs from "open-graph-scraper";

// eslint-disable-next-line no-unused-vars
export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);
  
  if (!searchParams.get("url"))
    return Response.json({ error: "Must provide URL" }, { status: 500 });

  const options = { url: searchParams.get("url")! };
  const { result } = await ogs(options);
  const success = result.success;
  const status = success ? 202 : 500;
  const body = success ? { data: result } : { error: result.error };
  return Response.json(body, { status: status });
}
