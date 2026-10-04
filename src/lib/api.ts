export function apiError(code:string,message:string,status=400,details?:unknown){return Response.json({error:{code,message,details}},{status})}
