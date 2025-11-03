'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function ShipmentsListPage() {
  const router = useRouter();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/shipments')
      .then((res) => {
        setShipments(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="container mx-auto p-8">טוען...</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">משלוחים</h1>
        <Link href="/shipments/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          משלוח חדש
        </Link>
      </div>
      <div className="space-y-4">
        {shipments.map((shipment: any) => (
          <Link
            key={shipment.id}
            href={`/shipments/${shipment.id}`}
            className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{shipment.shipmentNumber}</h2>
                <p className="text-gray-600 mt-1">{shipment.supplier?.name}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {shipment.originPort} → {shipment.destPort}
                </p>
                {shipment.carrier && (
                  <p className="text-sm text-gray-500">מוביל: {shipment.carrier}</p>
                )}
              </div>
              <div className="text-left">
                <p className="font-semibold">{shipment.status}</p>
                {shipment.containers && (
                  <p className="text-sm text-gray-500">{shipment.containers.length} מכולות</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

