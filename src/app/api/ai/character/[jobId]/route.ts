import { apiError } from "@/lib/api";
import { getJob } from "@/server/store";
export async function GET(_req:Request,{params}:{params:Promise<{jobId:string}>}){const {jobId}=await params;const job=await getJob(jobId);return job?Response.json(job):apiError("JOB_NOT_FOUND","No verified generation job exists with that ID",404)}
