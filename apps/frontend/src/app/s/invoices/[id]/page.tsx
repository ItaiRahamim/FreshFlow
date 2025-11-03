'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export default function SupplierInvoiceDetailPage() {
  const params = useParams();
  const { user } = useAuthStore();
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

  const handleAcknowledgePayment = async (paymentId: string) => {
    try {
      await api.put(`/invoices/${params.id}/payments/${paymentId}/acknowledge`);
      window.location.reload();
    } catch (error) {
      alert('Error acknowledging payment');
    }
  };

  const handleMarkReceived = async (paymentId: string) => {
    try {
      await api.put(`/invoices/${params.id}/payments/${paymentId}/received`);
      window.location.reload();
    } catch (error) {
      alert('Error marking payment as received');
    }
  };

  if (loading) return <div className="container mx-auto p-8">טוען...</div>;
  if (!invoice) return <div className="container mx-auto p-8">Invoice not found</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Invoice {invoice.number}</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Amount</p>
            <p className="font-semibold">{invoice.total} {invoice.currency}</p>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <p className="font-semibold">{invoice.status}</p>
          </div>
        </div>
      </div>

      {invoice.payments && invoice.payments.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Payments</h2>
          <div className="space-y-4">
            {invoice.payments.map((payment: any) => (
              <div key={payment.id} className="p-4 border rounded">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-semibold">{payment.amount} {payment.currency}</p>
                    <p className="text-sm text-gray-500">Status: {payment.status}</p>
                  </div>
                  <div>
                    {payment.status === 'INSTRUCTED' && !payment.supplierAck && (
                      <button
                        onClick={() => handleAcknowledgePayment(payment.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Acknowledge
                      </button>
                    )}
                    {payment.status === 'ACKNOWLEDGED' && (
                      <button
                        onClick={() => handleMarkReceived(payment.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Mark Received
                      </button>
                    )}
                    {payment.supplierAck && (
                      <p className="text-green-600">✓ Acknowledged</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

