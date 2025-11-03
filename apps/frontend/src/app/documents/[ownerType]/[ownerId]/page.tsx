'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

export default function DocumentUploadPage() {
  const params = useParams();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    api.get(`/documents/owner/${params.ownerType}/${params.ownerId}`)
      .then((res) => {
        setDocuments(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ownerType', params.ownerType as string);
    formData.append('ownerId', params.ownerId as string);
    formData.append('type', 'OTHER'); // או לקבל מה-form

    try {
      await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      loadDocuments();
      alert('המסמך הועלה בהצלחה');
    } catch (error) {
      alert('שגיאה בהעלאת המסמך');
    } finally {
      setUploading(false);
    }
  };

  const handleReview = async (docId: string, status: string) => {
    try {
      await api.put(`/documents/${docId}/review`, { status });
      loadDocuments();
      alert('המסמך נבדק');
    } catch (error) {
      alert('שגיאה בבדיקת המסמך');
    }
  };

  const getDocumentUrl = async (docId: string) => {
    try {
      const res = await api.get(`/documents/${docId}/url`);
      window.open(res.data, '_blank');
    } catch (error) {
      alert('שגיאה בפתיחת המסמך');
    }
  };

  if (loading) return <div className="container mx-auto p-8">טוען...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">מסמכים</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">העלאת מסמך</h2>
        <input
          type="file"
          onChange={handleUpload}
          disabled={uploading}
          className="mb-4"
        />
        {uploading && <p>מעלה...</p>}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">מסמכים קיימים</h2>
        <div className="space-y-4">
          {documents.map((doc: any) => (
            <div key={doc.id} className="p-4 border rounded">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{doc.type}</p>
                  <p className="text-sm text-gray-500">סטטוס: {doc.status}</p>
                  {doc.version > 1 && (
                    <p className="text-sm text-gray-500">גרסה: {doc.version}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => getDocumentUrl(doc.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    צפה
                  </button>
                  {doc.status === 'UPLOADED' && (
                    <>
                      <button
                        onClick={() => handleReview(doc.id, 'APPROVED')}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        אישור
                      </button>
                      <button
                        onClick={() => handleReview(doc.id, 'REJECTED')}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        דחייה
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

