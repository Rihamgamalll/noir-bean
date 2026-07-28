import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { currentSession, fail } from "@/lib/http";
import { hashPassword, verifyPassword } from "@/lib/security";

const updateSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  phone: z.string().max(40).nullable().optional(),
  preferredLanguage: z.enum(["ar", "en"]).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).max(128).optional(),
});
export async function GET(){
  const s=currentSession(); if(!s) return fail("Unauthorized",401);
  const [rows]:any=await db.execute("SELECT id,name,email,phone,role,preferred_language AS preferredLanguage,created_at AS createdAt FROM users WHERE id=? LIMIT 1",[s.userId]);
  if(!rows[0]) return fail("User not found",404); return NextResponse.json({user:rows[0]});
}
export async function PATCH(r:Request){
  const s=currentSession(); if(!s) return fail("Unauthorized",401);
  const p=updateSchema.safeParse(await r.json().catch(()=>null)); if(!p.success) return fail("Invalid profile data");
  if(p.data.newPassword){
    const [rows]:any=await db.execute("SELECT password_hash FROM users WHERE id=?",[s.userId]);
    if(!rows[0]||!p.data.currentPassword||!verifyPassword(p.data.currentPassword,rows[0].password_hash)) return fail("Current password is incorrect",403);
  }
  await db.execute(`UPDATE users SET name=COALESCE(?,name), phone=?, preferred_language=COALESCE(?,preferred_language), password_hash=COALESCE(?,password_hash) WHERE id=?`,[
    p.data.name??null,p.data.phone===undefined?null:p.data.phone,p.data.preferredLanguage??null,p.data.newPassword?hashPassword(p.data.newPassword):null,s.userId
  ]);
  return GET();
}