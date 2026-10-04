import { z } from "zod";
import { suggestIdentity } from "@/lib/identity";
import { apiError } from "@/lib/api";
const schema=z.object({text:z.string().min(3).max(500),seed:z.number().int().optional()}).strict();
export async function POST(req:Request){const parsed=schema.safeParse(await req.json().catch(()=>null));if(!parsed.success)return apiError("INVALID_INPUT","Describe the idol in 3-500 characters",422,parsed.error.flatten());const names=suggestIdentity(parsed.data.text);return Response.json({influencer:{description:parsed.data.text,niche:"Digital culture",style:"Editorial",voice:"Distinct and concise",postingFrequency:"manual"},names});}
