'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function QuotesListPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/quotes')
      .then((res) => {
        setQuotes(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="container mx-auto p-8">טוען...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">הצעות מחיר</h1>
      <div className="space-y-4">
        {quotes.map((quote: any) => (
          <Link
            key={quote.id}
            href={`/quotes/${quote.id}`}
            className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{quote.quoteNumber}</h2>
                <p className="text-gray-600 mt-1">{quote.supplier?.name}</p>
                <p className="text-sm text-gray-500 mt-2">RFQ: {quote.rfq?.rfqNumber}</p>
              </div>
              <div className="text-left">
                <p className="font-semibold">
                  {quote.lines?.reduce((sum: number, line: any) => sum + line.total, 0).toFixed(2)} {quote.lines?.[0]?.currency || 'USD'}
                </p>
                <p className="text-sm text-gray-500">סטטוס: {quote.status}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

