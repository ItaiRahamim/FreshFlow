'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function ShipmentDetailPage() {
  const params = useParams();
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/shipments/${params.id}`)
      .then((res) => {
        setShipment(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="container mx-auto p-8">טוען...</div>;
  if (!shipment) return <div className="container mx-auto p-8">משלוח לא נמצא</div>;

  return (
    <div className="container mx-auto p-8">
      <Link href="/shipments" className="text-blue-600 hover:underline mb-4 inline-block">
        ← חזרה למשלוחים
      </Link>
      <h1 className="text-3xl font-bold mb-8">{shipment.shipmentNumber}</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">פרטי משלוח</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">נמל מוצא</p>
            <p className="font-semibold">{shipment.originPort}</p>
          </div>
          <div>
            <p className="text-gray-600">נמל יעד</p>
            <p className="font-semibold">{shipment.destPort}</p>
          </div>
          <div>
            <p className="text-gray-600">מוביל</p>
            <p className="font-semibold">{shipment.carrier}</p>
          </div>
          <div>
            <p className="text-gray-600">סטטוס</p>
            <p className="font-semibold">{shipment.status}</p>
          </div>
          {shipment.etd && (
            <div>
              <p className="text-gray-600">ETD</p>
              <p className="font-semibold">{new Date(shipment.etd).toLocaleDateString('he-IL')}</p>
            </div>
          )}
          {shipment.eta && (
            <div>
              <p className="text-gray-600">ETA</p>
              <p className="font-semibold">{new Date(shipment.eta).toLocaleDateString('he-IL')}</p>
            </div>
          )}
        </div>
        {shipment.reeferSetpointC && (
          <div className="mt-4 pt-4 border-t">
            <h3 className="font-semibold mb-2">פרמטרים לקירור</h3>
            <p>טמפרטורה: {shipment.reeferSetpointC}°C</p>
            <p>לחות: {shipment.rhPercent}%</p>
            <p>טווח: {shipment.tempRangeMin}°C - {shipment.tempRangeMax}°C</p>
          </div>
        )}
      </div>

      {shipment.containers && shipment.containers.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">מכולות</h2>
          <div className="space-y-2">
            {shipment.containers.map((container: any) => (
              <div key={container.id} className="p-4 border rounded">
                <p className="font-semibold">{container.containerNo}</p>
                <p className="text-gray-600">סוג: {container.type}</p>
                {container.isReefer && <p className="text-blue-600">✓ Reefer</p>}
                {container.grossWeight && (
                  <p className="text-sm text-gray-500">משקל: {container.grossWeight} kg</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

