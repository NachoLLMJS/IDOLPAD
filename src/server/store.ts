import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type IdolRecord = { id: string; wallet: string; name: string; symbol: string; description: string; status: "draft"|"launched"; createdAt: string; tokenAddress?: string };
type Data = { idols: IdolRecord[]; jobs: Record<string,{ id:string; type:"character"|"video"; status:string; wallet?:string; createdAt:string }> };
const initial: Data = { idols: [], jobs: {} };
let queue = Promise.resolve();
function file(){return path.join(process.cwd(),".data","idolpad.json")}
async function load():Promise<Data>{try{return JSON.parse(await readFile(file(),"utf8")) as Data}catch{return structuredClone(initial)}}
async function save(data:Data){await mkdir(path.dirname(file()),{recursive:true});await writeFile(file(),JSON.stringify(data,null,2),"utf8")}
export async function listIdols(wallet?:string){const data=await load();return wallet?data.idols.filter(i=>i.wallet.toLowerCase()===wallet.toLowerCase()):data.idols}
export async function addJob(job:Data["jobs"][string]){queue=queue.then(async()=>{const data=await load();data.jobs[job.id]=job;await save(data)});await queue;return job}
export async function getJob(id:string){return (await load()).jobs[id]??null}
