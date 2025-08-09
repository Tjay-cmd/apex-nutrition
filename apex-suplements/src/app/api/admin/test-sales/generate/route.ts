import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, limit } from 'firebase/firestore';

// Minimal role check placeholder; you can extend with your existing auth
async function assertAdmin(): Promise<void> {
  // In a real app, verify the authenticated user and role here
  return;
}

export async function POST(req: NextRequest) {
  try {
    await assertAdmin();

    const body = await req.json().catch(() => ({}));
    const days = Math.max(1, Math.min(7, body?.days ?? 7));
    const minCount = Math.max(5, Math.min(50, body?.countMin ?? 14));
    const maxCount = Math.max(minCount, Math.min(100, body?.countMax ?? 20));

    // Find a single active product
    const productSnap = await getDocs(query(collection(db, 'products'), limit(1)));
    if (productSnap.empty) {
      return NextResponse.json({ error: 'No product found to generate test sales.' }, { status: 400 });
    }
    const product = { id: productSnap.docs[0].id, ...(productSnap.docs[0].data() as any) };

    const batchId = `test_${Date.now()}`;
    const totalToCreate = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;

    // helper to random item
    const rand = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

    let created = 0;
    for (let i = 0; i < totalToCreate; i++) {
      const dayOffset = Math.floor(Math.random() * days); // 0..days-1
      const date = new Date();
      date.setDate(date.getDate() - dayOffset);
      // skew time to afternoon/evening
      date.setHours(12 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60), 0);

      const qty = Math.floor(Math.random() * 2) + 1; // 1..2
      const unitPrice = Number(product.price ?? 199);
      const subtotal = unitPrice * qty;
      const shipping = rand([0, 49]);
      const tax = Math.round(subtotal * 0.15);
      const total = subtotal + shipping + tax;

      const status = rand(['delivered', 'shipped', 'processing', 'pending', 'cancelled']);
      const payment = rand(['paid', 'paid', 'paid', 'pending', 'failed']);
      const cities = ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein'];
      const city = rand(cities);

      const order = {
        user_id: 'test_user',
        customer_email: `test${Math.floor(Math.random() * 1000)}@example.com`,
        customer_name: rand(['Alex Smith', 'Jordan Lee', 'Taylor Brown', 'Sam Mokoena', 'Nadia Patel']),
        customer_phone: `+27 82 ${Math.floor(1000000 + Math.random() * 8999999)}`,
        status,
        payment_status: payment,
        subtotal,
        shipping_cost: shipping,
        tax_amount: tax,
        total_amount: total,
        shipping_address: { street: '123 Main Rd', city, state: 'Gauteng', postal_code: '2000', country: 'South Africa' },
        billing_address: { street: '123 Main Rd', city, state: 'Gauteng', postal_code: '2000', country: 'South Africa' },
        items: [
          {
            id: '1',
            product_id: product.id,
            product_name: product.name ?? 'Test Product',
            quantity: qty,
            unit_price: unitPrice,
            total_price: unitPrice * qty
          }
        ],
        status_history: [
          { status: 'pending', updated_at: date.toISOString(), updated_by: 'system', notes: 'Order created' }
        ],
        created_at: date.toISOString(),
        updated_at: date.toISOString(),
        is_test: true,
        test_batch_id: batchId,
        created_with: 'admin_test'
      };

      await addDoc(collection(db, 'orders'), order);
      created += 1;
    }

    return NextResponse.json({ success: true, batchId, created });
  } catch (error: any) {
    console.error('Error generating test sales:', error);
    return NextResponse.json({ error: 'Failed to generate test sales' }, { status: 500 });
  }
}


