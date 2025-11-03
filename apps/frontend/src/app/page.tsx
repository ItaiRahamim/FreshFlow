import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="text-center space-y-8 max-w-2xl">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            FreshFlow
          </h1>
          <p className="text-2xl text-gray-700 font-medium">
            פלטפורמה לניהול ייבוא חקלאי
          </p>
          <p className="text-lg text-gray-600">
            ניהול מלא של תהליכי ייבוא - מ-RFQ ועד משלוח סופי
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link
            href="/login"
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg hover:scale-105"
          >
            התחברות
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-white text-green-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-semibold text-lg border-2 border-green-600 hover:bg-green-50"
          >
            התחל עכשיו
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">📦</div>
            <h3 className="font-semibold text-gray-800 mb-2">ניהול הזמנות</h3>
            <p className="text-sm text-gray-600">מעקב מלא אחר RFQ, הצעות מחיר והזמנות רכישה</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">🚢</div>
            <h3 className="font-semibold text-gray-800 mb-2">מעקב משלוחים</h3>
            <p className="text-sm text-gray-600">ניהול משלוחים, קונטיינרים ופרמטרים קרור</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-semibold text-gray-800 mb-2">ניהול כספי</h3>
            <p className="text-sm text-gray-600">חשבוניות, תשלומים ומחשבון עלות סופית</p>
          </div>
        </div>
      </div>
    </main>
  );
}

