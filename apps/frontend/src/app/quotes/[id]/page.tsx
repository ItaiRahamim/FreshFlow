'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/quotes/${params.id}`)
      .then((res) => {
        setQuote(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const handleAccept = async () => {
    try {
      await api.put(`/quotes/${params.id}/accept`);
      router.push(`/po/from-quote/${params.id}`);
    } catch (error) {
      alert('שגיאה באישור הצעת המחיר');
    }
  };

  if (loading) return <div className="container mx-auto p-8">טוען...</div>;
  if (!quote) return <div className="container mx-auto p-8">הצעת מחיר לא נמצאה</div>;

  const total = quote.lines?.reduce((sum: number, line: any) => sum + line.total, 0) || 0;

  return (
    <div className="container mx-auto p-8">
      <Link href="/quotes" className="text-blue-600 hover:underline mb-4 inline-block">
        ← חזרה להצעות מחיר
      </Link>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{quote.quoteNumber}</h1>
        {quote.status === 'PENDING' && (
          <button
            onClick={handleAccept}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            אישור ויצירת PO
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">פרטי ספק</h2>
        <p className="font-semibold">{quote.supplier?.name}</p>
        <p className="text-gray-600">{quote.supplier?.email}</p>
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
            {quote.lines?.map((line: any) => (
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
              <td className="p-2">{total} {quote.lines?.[0]?.currency || 'USD'}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

