'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function RFQListPage() {
  const router = useRouter();
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/rfq')
      .then((res) => {
        setRfqs(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="container mx-auto p-8">טוען...</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">RFQs</h1>
        <Link href="/rfq/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          RFQ חדש
        </Link>
      </div>
      <div className="space-y-4">
        {rfqs.map((rfq: any) => (
          <Link
            key={rfq.id}
            href={`/rfq/${rfq.id}`}
            className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{rfq.rfqNumber}</h2>
                {rfq.title && <p className="text-gray-600 mt-1">{rfq.title}</p>}
                <p className="text-sm text-gray-500 mt-2">
                  {rfq.originPort} → {rfq.destPort}
                </p>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">{rfq.lines?.length || 0} פריטים</p>
                <p className="text-sm text-gray-500">{rfq.quotes?.length || 0} הצעות מחיר</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

