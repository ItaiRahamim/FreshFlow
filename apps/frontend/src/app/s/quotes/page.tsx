'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export default function SupplierQuotesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'SUPPLIER') {
      router.push('/login');
      return;
    }

    api.get('/quotes')
      .then((res) => {
        setQuotes(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, router]);

  if (loading) return <div className="container mx-auto p-8">טוען...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">My Quotes</h1>
      <div className="space-y-4">
        {quotes.map((quote: any) => (
          <div key={quote.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{quote.quoteNumber}</h2>
                <p className="text-gray-600">RFQ: {quote.rfq?.rfqNumber}</p>
                <p className="text-sm text-gray-500">Status: {quote.status}</p>
              </div>
              <div className="text-left">
                <p className="font-semibold">
                  {quote.lines?.reduce((sum: number, line: any) => sum + line.total, 0).toFixed(2)} {quote.lines?.[0]?.currency || 'USD'}
                </p>
                {quote.leadTimeDays && (
                  <p className="text-sm text-gray-500">{quote.leadTimeDays} days</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

