'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function RFQDetailPage() {
  const params = useParams();
  const [rfq, setRfq] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/rfq/${params.id}`)
      .then((res) => {
        setRfq(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="container mx-auto p-8">טוען...</div>;
  if (!rfq) return <div className="container mx-auto p-8">RFQ לא נמצא</div>;

  return (
    <div className="container mx-auto p-8">
      <Link href="/rfq" className="text-blue-600 hover:underline mb-4 inline-block">
        ← חזרה ל-RFQs
      </Link>
      <h1 className="text-3xl font-bold mb-8">{rfq.rfqNumber}</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">פרטים</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">נמל מוצא</p>
            <p className="font-semibold">{rfq.originPort}</p>
          </div>
          <div>
            <p className="text-gray-600">נמל יעד</p>
            <p className="font-semibold">{rfq.destPort}</p>
          </div>
          <div>
            <p className="text-gray-600">Incoterm</p>
            <p className="font-semibold">{rfq.incoterm}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">פריטים</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-right p-2">מוצר</th>
              <th className="text-right p-2">כמות</th>
              <th className="text-right p-2">יחידה</th>
            </tr>
          </thead>
          <tbody>
            {rfq.lines?.map((line: any) => (
              <tr key={line.id} className="border-b">
                <td className="p-2">{line.product?.name}</td>
                <td className="p-2">{line.quantity}</td>
                <td className="p-2">{line.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">הצעות מחיר</h2>
        <div className="space-y-4">
          {rfq.quotes?.map((quote: any) => (
            <Link
              key={quote.id}
              href={`/quotes/${quote.id}`}
              className="block p-4 border rounded hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{quote.quoteNumber}</p>
                  <p className="text-gray-600">{quote.supplier?.name}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-500">סטטוס: {quote.status}</p>
                  {quote.leadTimeDays && (
                    <p className="text-sm text-gray-500">{quote.leadTimeDays} ימים</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

