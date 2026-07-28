import { NextResponse } from "next/server"; import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export const runtime="nodejs"; export async function GET(){const [rows]=await db.query("SELECT id,slug,name_en AS nameEn,name_ar AS nameAr,sort_order AS sortOrder FROM categories ORDER BY sort_order");return NextResponse.json({categories:rows})}
