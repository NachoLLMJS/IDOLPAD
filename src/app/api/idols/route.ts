import { listIdols } from "@/server/store";
import { apiError } from "@/lib/api";
export async function GET(req:Request){const wallet=new URL(req.url).searchParams.get("wallet")||undefined;return Response.json({items:await listIdols(wallet)})}
export async function POST(){return apiError("SIGNED_SESSION_REQUIRED","Creating an idol record requires wallet nonce authentication. Local writes are disabled",401)}
