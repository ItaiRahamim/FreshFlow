'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function InvoiceDetailPage() {
  const params = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/invoices/${params.id}`)
      .then((res) => {
        setInvoice(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="container mx-auto p-8">טוען...</div>;
  if (!invoice) return <div className="container mx-auto p-8">חשבונית לא נמצאה</div>;

  return (
    <div className="container mx-auto p-8">
      <Link href="/invoices" className="text-blue-600 hover:underline mb-4 inline-block">
        ← חזרה לחשבוניות
      </Link>
      <h1 className="text-3xl font-bold mb-8">{invoice.number}</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">ספק</p>
            <p className="font-semibold">{invoice.supplier?.name}</p>
          </div>
          <div>
            <p className="text-gray-600">תאריך</p>
            <p className="font-semibold">{invoice.date ? new Date(invoice.date).toLocaleDateString('he-IL') : '-'}</p>
          </div>
          <div>
            <p className="text-gray-600">סכום</p>
            <p className="font-semibold">{invoice.total} {invoice.currency}</p>
          </div>
          <div>
            <p className="text-gray-600">סטטוס</p>
            <p className="font-semibold">{invoice.status}</p>
          </div>
        </div>
      </div>

      {invoice.payments && invoice.payments.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">תשלומים</h2>
          <div className="space-y-2">
            {invoice.payments.map((payment: any) => (
              <div key={payment.id} className="p-4 border rounded">
                <p className="font-semibold">{payment.amount} {payment.currency}</p>
                <p className="text-sm text-gray-500">סטטוס: {payment.status}</p>
                {payment.supplierAck && (
                  <p className="text-sm text-green-600">✓ אושר על ידי ספק</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

