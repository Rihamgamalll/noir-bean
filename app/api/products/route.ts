import { NextResponse } from "next/server"; import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export const runtime="nodejs";
export async function GET(){const [rows]=await db.query(`SELECT p.id,p.slug,p.name_en AS nameEn,p.name_ar AS nameAr,p.description_en AS descriptionEn,p.description_ar AS descriptionAr,p.image,p.base_price AS basePrice,p.type,p.is_available AS isAvailable,p.sort_order AS sortOrder,c.slug AS categorySlug,c.name_en AS categoryEn,c.name_ar AS categoryAr FROM products p JOIN categories c ON c.id=p.category_id ORDER BY p.sort_order,p.name_en`);return NextResponse.json({products:rows})}
