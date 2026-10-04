import { z } from "zod";
import { apiError } from "@/lib/api";
import { getMediaProvider, MediaProviderError } from "@/lib/media-provider";
const schema=z.object({mode:z.enum(["describe","template","upload"]),prompt:z.string().min(3).max(400),durationSec:z.union([z.literal(5),z.literal(10)]),resolution:z.enum(["480p","720p"])}).strict();
export async function GET(){return Response.json({items:[],budget:null,pricing:null,ready:false,reason:"Authenticate an owned idol and configure a media provider"})}
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;const parsed=schema.safeParse(await req.json().catch(()=>null));if(!parsed.success)return apiError("INVALID_INPUT","Video request is invalid",422,parsed.error.flatten());try{return Response.json(await getMediaProvider().createVideo({idolId:id,prompt:parsed.data.prompt,durationSec:parsed.data.durationSec,resolution:parsed.data.resolution}),{status:202})}catch(error){if(error instanceof MediaProviderError)return apiError(error.code,error.message,503);return apiError("GENERATION_FAILED","Video generation could not start. No credit was used",502)}}
