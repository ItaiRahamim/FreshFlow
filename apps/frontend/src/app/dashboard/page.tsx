'use client';

import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  // Redirect suppliers to supplier portal
  if (user.role === 'SUPPLIER') {
    router.push('/s');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            FreshFlow
          </h1>
          <p className="text-gray-600">ברוך הבא, {user.name || user.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/categories"
            className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-300 hover:scale-[1.02]"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📁</div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-green-600 transition-colors">
              קטגוריות
            </h2>
            <p className="text-gray-600 text-sm">ניהול קטגוריות מוצרים</p>
          </Link>

          <Link
            href="/rfq"
            className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-300 hover:scale-[1.02]"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📋</div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
              RFQs
            </h2>
            <p className="text-gray-600 text-sm">ניהול בקשות הצעת מחיר</p>
          </Link>

          <Link
            href="/quotes"
            className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-300 hover:scale-[1.02]"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">💼</div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-purple-600 transition-colors">
              הצעות מחיר
            </h2>
            <p className="text-gray-600 text-sm">ניהול הצעות מחיר מספקים</p>
          </Link>

          <Link
            href="/po"
            className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-300 hover:scale-[1.02]"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🛒</div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-orange-600 transition-colors">
              הזמנות רכישה
            </h2>
            <p className="text-gray-600 text-sm">ניהול הזמנות רכישה</p>
          </Link>

          <Link
            href="/invoices"
            className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-300 hover:scale-[1.02]"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🧾</div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-red-600 transition-colors">
              חשבוניות
            </h2>
            <p className="text-gray-600 text-sm">ניהול חשבוניות ותשלומים</p>
          </Link>

          <Link
            href="/shipments"
            className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-cyan-300 hover:scale-[1.02]"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🚢</div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-cyan-600 transition-colors">
              משלוחים
            </h2>
            <p className="text-gray-600 text-sm">מעקב משלוחים וקונטיינרים</p>
          </Link>

          <Link
            href="/landed-cost"
            className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-300 hover:scale-[1.02]"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">💰</div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-green-600 transition-colors">
              מחשבון עלות סופית
            </h2>
            <p className="text-gray-600 text-sm">חישוב עלות סופית כולל מכס ומיסים</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

