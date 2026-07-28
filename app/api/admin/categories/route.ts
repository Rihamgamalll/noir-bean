import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin, fail } from "@/lib/http";
import { uuid } from "@/lib/security";
const schema=z.object({slug:z.string().min(2).max(100),nameEn:z.string().min(2).max(120),nameAr:z.string().min(2).max(120),sortOrder:z.number().int().default(0)});
export async function GET(r:Request){if(!requireAdmin(r))return fail("Unauthorized",401);const [rows]:any=await db.query("SELECT id,slug,name_en AS nameEn,name_ar AS nameAr,sort_order AS sortOrder FROM categories ORDER BY sort_order,name_en");return NextResponse.json({categories:rows});}
export async function POST(r:Request){if(!requireAdmin(r))return fail("Unauthorized",401);const p=schema.safeParse(await r.json().catch(()=>null));if(!p.success)return fail("Invalid category");const x=p.data;await db.execute("INSERT INTO categories(id,slug,name_en,name_ar,sort_order) VALUES(?,?,?,?,?)",[uuid(),x.slug,x.nameEn,x.nameAr,x.sortOrder]);return NextResponse.json({ok:true},{status:201});}
