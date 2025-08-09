import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';

async function assertAdmin(): Promise<void> {
  return;
}

export async function POST(req: NextRequest) {
  try {
    await assertAdmin();

    const body = await req.json().catch(() => ({}));
    const batchId = body?.batchId as string | undefined;

    const q = batchId
      ? query(collection(db, 'orders'), where('test_batch_id', '==', batchId))
      : query(collection(db, 'orders'), where('is_test', '==', true));

    const snap = await getDocs(q);
    let deleted = 0;
    for (const d of snap.docs) {
      await deleteDoc(doc(db, 'orders', d.id));
      deleted += 1;
    }

    return NextResponse.json({ success: true, deleted });
  } catch (error: any) {
    console.error('Error clearing test sales:', error);
    return NextResponse.json({ error: 'Failed to clear test sales' }, { status: 500 });
  }
}


