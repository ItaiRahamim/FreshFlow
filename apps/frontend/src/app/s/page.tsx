'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export default function SupplierDashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [quotes, setQuotes] = useState([]);
  const [pos, setPos] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'SUPPLIER') {
      router.push('/login');
      return;
    }

    Promise.all([
      api.get('/quotes'),
      api.get('/po'),
      api.get('/invoices'),
    ])
      .then(([quotesRes, posRes, invoicesRes]) => {
        setQuotes(quotesRes.data);
        setPos(posRes.data);
        setInvoices(invoicesRes.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, router]);

  if (loading) return <div className="container mx-auto p-8">טוען...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Supplier Portal</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Quotes</h2>
          <p className="text-3xl font-bold">{quotes.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Purchase Orders</h2>
          <p className="text-3xl font-bold">{pos.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Invoices</h2>
          <p className="text-3xl font-bold">{invoices.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Quotes</h2>
          <div className="space-y-2">
            {quotes.slice(0, 5).map((quote: any) => (
              <div key={quote.id} className="p-2 border rounded">
                <p className="font-semibold">{quote.quoteNumber}</p>
                <p className="text-sm text-gray-500">{quote.status}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent POs</h2>
          <div className="space-y-2">
            {pos.slice(0, 5).map((po: any) => (
              <div key={po.id} className="p-2 border rounded">
                <p className="font-semibold">{po.poNumber}</p>
                <p className="text-sm text-gray-500">{new Date(po.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Invoices</h2>
          <div className="space-y-2">
            {invoices.slice(0, 5).map((invoice: any) => (
              <div key={invoice.id} className="p-2 border rounded">
                <p className="font-semibold">{invoice.number}</p>
                <p className="text-sm text-gray-500">{invoice.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

