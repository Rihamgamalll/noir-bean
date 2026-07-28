import { NextResponse } from "next/server";
import { z } from "zod";
import { db, transaction } from "@/lib/db";
import { currentSession, fail } from "@/lib/http";
import { uuid } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  customerName: z.string().trim().min(2).max(120),
  customerPhone: z.string().trim().min(5).max(40),
  address: z.string().trim().min(5).max(500),
  notes: z.string().trim().max(2000).optional(),
  items: z.array(z.object({
    id: z.string().min(1).max(120),
    quantity: z.number().int().min(1).max(20),
    size: z.string().max(30).optional(),
    temperature: z.string().max(30).optional(),
    sugar: z.string().max(30).optional(),
  })).min(1).max(50),
});

export async function GET() {
  const session = currentSession();
  if (!session) return fail("Unauthorized", 401);

  const [orders]: any = await db.execute(
    "SELECT id,order_number AS orderNumber,customer_name AS customerName,customer_phone AS customerPhone,address,notes,subtotal,delivery_fee AS deliveryFee,total,status,created_at AS createdAt FROM orders WHERE user_id=? ORDER BY created_at DESC",
    [session.userId],
  );

  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail("Invalid order details");

  const slugs = parsed.data.items.map((item) => item.id);
  const placeholders = slugs.map(() => "?").join(",");

  try {
    const [rows]: any = await db.query(
      `SELECT id,slug,name_en,base_price,is_available FROM products WHERE slug IN (${placeholders})`,
      slugs,
    );

    const productMap = new Map(rows.map((product: any) => [product.slug, product]));
    let subtotal = 0;

    const safeItems = parsed.data.items.map((item) => {
      const product: any = productMap.get(item.id);
      if (!product || !product.is_available) throw new Error("Unavailable product");
      subtotal += Number(product.base_price) * item.quantity;
      return { input: item, product };
    });

    const deliveryFee = 0;
    const total = subtotal + deliveryFee;
    const orderId = uuid();
    const orderNumber = `NB-${Date.now().toString().slice(-9)}`;
    const session = currentSession();

    await transaction(async (connection) => {
      await connection.execute(
        "INSERT INTO orders(id,order_number,user_id,customer_name,customer_phone,address,notes,subtotal,delivery_fee,total) VALUES(?,?,?,?,?,?,?,?,?,?)",
        [
          orderId,
          orderNumber,
          session?.userId || null,
          parsed.data.customerName,
          parsed.data.customerPhone,
          parsed.data.address,
          parsed.data.notes || null,
          subtotal,
          deliveryFee,
          total,
        ],
      );

      for (const item of safeItems) {
        await connection.execute(
          "INSERT INTO order_items(id,order_id,product_id,product_name,quantity,unit_price,customization_json) VALUES(?,?,?,?,?,?,?)",
          [
            uuid(),
            orderId,
            item.product.id,
            item.product.name_en,
            item.input.quantity,
            item.product.base_price,
            JSON.stringify({
              size: item.input.size,
              temperature: item.input.temperature,
              sugar: item.input.sugar,
            }),
          ],
        );
      }
    });

    return NextResponse.json(
      { order: { id: orderId, orderNumber, total, status: "NEW" } },
      { status: 201 },
    );
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Could not create order", 400);
  }
}
