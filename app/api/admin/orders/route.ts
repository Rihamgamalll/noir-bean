import { NextResponse } from "next/server";
import { requireAdmin, fail } from "@/lib/http";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!requireAdmin(request)) return fail("Unauthorized", 401);

  const [orders]: any = await db.query(
    "SELECT id,order_number AS orderNumber,customer_name AS customerName,customer_phone AS customerPhone,address,notes,total,status,created_at AS createdAt FROM orders ORDER BY created_at DESC LIMIT 250",
  );

  for (const order of orders) {
    const [items]: any = await db.execute(
      "SELECT product_name AS name,quantity,unit_price AS unitPrice,customization_json AS customization FROM order_items WHERE order_id=?",
      [order.id],
    );

    order.items = items.map((item: any) => ({
      ...item,
      ...(typeof item.customization === "string"
        ? JSON.parse(item.customization)
        : item.customization),
    }));
  }

  return NextResponse.json({ orders });
}
