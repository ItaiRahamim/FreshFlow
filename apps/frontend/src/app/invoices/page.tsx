'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function InvoicesListPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/invoices')
      .then((res) => {
        setInvoices(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="container mx-auto p-8">טוען...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">חשבוניות</h1>
      <div className="space-y-4">
        {invoices.map((invoice: any) => (
          <Link
            key={invoice.id}
            href={`/invoices/${invoice.id}`}
            className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{invoice.number}</h2>
                <p className="text-gray-600 mt-1">{invoice.supplier?.name}</p>
                {invoice.po && (
                  <p className="text-sm text-gray-500 mt-2">PO: {invoice.po.poNumber}</p>
                )}
              </div>
              <div className="text-left">
                <p className="font-semibold">{invoice.total} {invoice.currency}</p>
                <p className="text-sm text-gray-500">סטטוס: {invoice.status}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

