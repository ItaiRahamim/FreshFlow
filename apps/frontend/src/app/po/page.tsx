'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function POListPage() {
  const router = useRouter();
  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/po')
      .then((res) => {
        setPos(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="container mx-auto p-8">טוען...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">הזמנות רכישה</h1>
      <div className="space-y-4">
        {pos.map((po: any) => (
          <Link
            key={po.id}
            href={`/po/${po.id}`}
            className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{po.poNumber}</h2>
                <p className="text-gray-600 mt-1">{po.supplier?.name}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {po.originPort} → {po.destPort}
                </p>
              </div>
              <div className="text-left">
                <p className="font-semibold">
                  {po.lines?.reduce((sum: number, line: any) => sum + line.total, 0).toFixed(2)} {po.lines?.[0]?.currency || 'USD'}
                </p>
                <p className="text-sm text-gray-500">{po.invoices?.length || 0} חשבוניות</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

