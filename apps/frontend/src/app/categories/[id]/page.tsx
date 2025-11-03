'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState<any>(null);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/categories/${params.id}`),
      api.get(`/suppliers?categoryId=${params.id}`),
    ])
      .then(([catRes, supRes]) => {
        setCategory(catRes.data);
        setSuppliers(supRes.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="container mx-auto p-8">טוען...</div>;
  if (!category) return <div className="container mx-auto p-8">קטגוריה לא נמצאה</div>;

  return (
    <div className="container mx-auto p-8">
      <Link href="/categories" className="text-blue-600 hover:underline mb-4 inline-block">
        ← חזרה לקטגוריות
      </Link>
      <h1 className="text-3xl font-bold mb-8">{category.name}</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">ספקים</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map((supplier: any) => (
            <Link
              key={supplier.id}
              href={`/suppliers/${supplier.id}`}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold">{supplier.name}</h3>
              <p className="text-gray-600">{supplier.email}</p>
              {supplier.country && <p className="text-sm text-gray-500">{supplier.country}</p>}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">מוצרים</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {category.products?.map((product: any) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              {product.variety && <p className="text-gray-600">{product.variety}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

