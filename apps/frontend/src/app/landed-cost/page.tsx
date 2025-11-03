'use client';

import { useState } from 'react';
import api from '@/lib/api';

export default function LandedCostPage() {
  const [inputs, setInputs] = useState({
    basePrice: '',
    quantity: '',
    freight: '',
    insurance: '',
    portFee: '',
    clearanceFee: '',
    truckingFee: '',
    reeferSurcharge: '',
    fxRate: '3.65',
    hsCode: '',
    country: 'IL',
    insuranceRatePercent: '1',
    perishabilityRiskFactor: '0.05',
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/landed-cost/calculate', {
        ...inputs,
        basePrice: parseFloat(inputs.basePrice),
        quantity: parseFloat(inputs.quantity),
        freight: parseFloat(inputs.freight),
        insurance: parseFloat(inputs.insurance) || undefined,
        portFee: parseFloat(inputs.portFee),
        clearanceFee: parseFloat(inputs.clearanceFee),
        truckingFee: parseFloat(inputs.truckingFee),
        reeferSurcharge: parseFloat(inputs.reeferSurcharge) || undefined,
        fxRate: parseFloat(inputs.fxRate),
        insuranceRatePercent: parseFloat(inputs.insuranceRatePercent) || undefined,
        perishabilityRiskFactor: parseFloat(inputs.perishabilityRiskFactor) || undefined,
      });
      setResult(response.data);
    } catch (error: any) {
      alert(error.response?.data?.message || 'שגיאה בחישוב');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">מחשבון עלות סופית (Landed Cost)</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">מחיר בסיס</label>
            <input
              type="number"
              step="0.01"
              required
              value={inputs.basePrice}
              onChange={(e) => setInputs({ ...inputs, basePrice: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">כמות</label>
            <input
              type="number"
              step="0.01"
              required
              value={inputs.quantity}
              onChange={(e) => setInputs({ ...inputs, quantity: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">הובלה</label>
            <input
              type="number"
              step="0.01"
              required
              value={inputs.freight}
              onChange={(e) => setInputs({ ...inputs, freight: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ביטוח</label>
            <input
              type="number"
              step="0.01"
              value={inputs.insurance}
              onChange={(e) => setInputs({ ...inputs, insurance: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">אגרת נמל</label>
            <input
              type="number"
              step="0.01"
              required
              value={inputs.portFee}
              onChange={(e) => setInputs({ ...inputs, portFee: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">אגרת שחרור</label>
            <input
              type="number"
              step="0.01"
              required
              value={inputs.clearanceFee}
              onChange={(e) => setInputs({ ...inputs, clearanceFee: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">הובלה יבשתית</label>
            <input
              type="number"
              step="0.01"
              required
              value={inputs.truckingFee}
              onChange={(e) => setInputs({ ...inputs, truckingFee: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">תוספת קירור</label>
            <input
              type="number"
              step="0.01"
              value={inputs.reeferSurcharge}
              onChange={(e) => setInputs({ ...inputs, reeferSurcharge: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">שיעור חליפין</label>
            <input
              type="number"
              step="0.01"
              required
              value={inputs.fxRate}
              onChange={(e) => setInputs({ ...inputs, fxRate: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">HS Code</label>
            <input
              type="text"
              required
              value={inputs.hsCode}
              onChange={(e) => setInputs({ ...inputs, hsCode: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">מדינה</label>
            <input
              type="text"
              required
              value={inputs.country}
              onChange={(e) => setInputs({ ...inputs, country: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">אחוז ביטוח</label>
            <input
              type="number"
              step="0.01"
              value={inputs.insuranceRatePercent}
              onChange={(e) => setInputs({ ...inputs, insuranceRatePercent: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">גורם סיכון לקלקול</label>
            <input
              type="number"
              step="0.01"
              value={inputs.perishabilityRiskFactor}
              onChange={(e) => setInputs({ ...inputs, perishabilityRiskFactor: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          חשב
        </button>
      </form>

      {result && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">תוצאות</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">עלות בסיס (מקומית)</p>
              <p className="font-semibold">{result.baseCostLocal?.toFixed(2)} ₪</p>
            </div>
            <div>
              <p className="text-gray-600">הובלה</p>
              <p className="font-semibold">{result.freightLocal?.toFixed(2)} ₪</p>
            </div>
            <div>
              <p className="text-gray-600">ביטוח</p>
              <p className="font-semibold">{result.insuranceLocal?.toFixed(2)} ₪</p>
            </div>
            <div>
              <p className="text-gray-600">מכס</p>
              <p className="font-semibold">{result.dutyAmount?.toFixed(2)} ₪</p>
            </div>
            <div>
              <p className="text-gray-600">מע"מ</p>
              <p className="font-semibold">{result.vatAmount?.toFixed(2)} ₪</p>
            </div>
            <div>
              <p className="text-gray-600">תוספת קירור</p>
              <p className="font-semibold">{result.reeferSurchargeLocal?.toFixed(2)} ₪</p>
            </div>
            <div className="col-span-2 border-t pt-4">
              <p className="text-gray-600">עלות סופית כוללת</p>
              <p className="font-bold text-2xl">{result.totalLandedCost?.toFixed(2)} ₪</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-600">עלות ליחידה</p>
              <p className="font-semibold text-xl">{result.perUnitLandedCost?.toFixed(2)} ₪</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

