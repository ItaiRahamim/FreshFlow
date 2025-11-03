'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function PODetailPage() {
  const params = useParams();
  const [po, setPo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/po/${params.id}`)
      .then((res) => {
        setPo(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="container mx-auto p-8">טוען...</div>;
  if (!po) return <div className="container mx-auto p-8">הזמנה לא נמצאה</div>;

  const total = po.lines?.reduce((sum: number, line: any) => sum + line.total, 0) || 0;

  return (
    <div className="container mx-auto p-8">
      <Link href="/po" className="text-blue-600 hover:underline mb-4 inline-block">
        ← חזרה להזמנות
      </Link>
      <h1 className="text-3xl font-bold mb-8">{po.poNumber}</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">פרטי ספק</h2>
        <p className="font-semibold">{po.supplier?.name}</p>
        <p className="text-gray-600">{po.supplier?.email}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">פריטים</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-right p-2">מוצר</th>
              <th className="text-right p-2">כמות</th>
              <th className="text-right p-2">מחיר יחידה</th>
              <th className="text-right p-2">סה"כ</th>
            </tr>
          </thead>
          <tbody>
            {po.lines?.map((line: any) => (
              <tr key={line.id} className="border-b">
                <td className="p-2">{line.product?.name}</td>
                <td className="p-2">{line.quantity}</td>
                <td className="p-2">{line.unitPrice} {line.currency}</td>
                <td className="p-2">{line.total} {line.currency}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t font-bold">
              <td colSpan={3} className="p-2 text-right">סה"כ</td>
              <td className="p-2">{total} {po.lines?.[0]?.currency || 'USD'}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {po.invoices && po.invoices.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">חשבוניות</h2>
          <div className="space-y-2">
            {po.invoices.map((invoice: any) => (
              <Link
                key={invoice.id}
                href={`/invoices/${invoice.id}`}
                className="block p-4 border rounded hover:bg-gray-50"
              >
                <p className="font-semibold">{invoice.number}</p>
                <p className="text-gray-600">{invoice.total} {invoice.currency}</p>
                <p className="text-sm text-gray-500">סטטוס: {invoice.status}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

