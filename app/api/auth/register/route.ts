import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession,hashPassword,sessionCookie,uuid } from "@/lib/security";
import { fail } from "@/lib/http";
const schema=z.object({name:z.string().min(2).max(120),email:z.string().email().max(190),phone:z.string().max(40).optional().or(z.literal("")),password:z.string().min(8).max(128),language:z.enum(["ar","en"]).default("en"),adminCode:z.string().optional().or(z.literal(""))});
export async function POST(r:Request){const parsed=schema.safeParse(await r.json().catch(()=>null));if(!parsed.success)return fail("Invalid registration details");const v=parsed.data;const id=uuid();const isAdmin=!!process.env.ADMIN_PASSWORD&&v.adminCode===process.env.ADMIN_PASSWORD;const role=isAdmin?"ADMIN":"CUSTOMER";try{await db.execute("INSERT INTO users(id,name,email,phone,password_hash,role,preferred_language) VALUES(?,?,?,?,?,?,?)",[id,v.name,v.email.toLowerCase(),v.phone||null,hashPassword(v.password),role,v.language]);const res=NextResponse.json({user:{id,name:v.name,email:v.email.toLowerCase(),role}},{status:201});res.cookies.set(sessionCookie.name,createSession({userId:id,role}),sessionCookie);return res}catch(e:any){if(e?.code==="ER_DUP_ENTRY")return fail("Email already exists",409);return fail("Could not create account",500)}}
