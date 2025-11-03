'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories')
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="container mx-auto p-8">טוען...</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">קטגוריות</h1>
        <Link href="/categories/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          קטגוריה חדשה
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat: any) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.id}`}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{cat.name}</h2>
            {cat.nameEn && <p className="text-gray-600">{cat.nameEn}</p>}
            {cat.hsCodeDefault && (
              <p className="text-sm text-gray-500 mt-2">HS Code: {cat.hsCodeDefault}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

