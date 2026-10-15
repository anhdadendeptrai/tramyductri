'use client';

import React, { useEffect, useState } from 'react';
import { BookForm } from '@/components/admin/BookForm';
import { fetchBookData, saveBookDataApi } from '@/lib/storage';
import { BookData } from '@/lib/types';
import { DEFAULT_BOOK_DATA } from '@/lib/book-data';

export default function AdminPage() {
  const [bookData, setBookData] = useState<BookData>(DEFAULT_BOOK_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookData('ductri').then((data) => {
      setBookData(data);
      setLoading(false);
    });
  }, []);

  const handleSaveBook = async (updatedData: BookData) => {
    const success = await saveBookDataApi(updatedData);
    if (success) {
      setBookData(updatedData);
    }
    return success;
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-[#FAF8F5] paper-texture flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#2B2825] border-t-transparent animate-spin" />
        <p className="font-serif text-sm tracking-widest text-[#6E5A4E] uppercase">
          Loading Admin Editor...
        </p>
      </div>
    );
  }

  return <BookForm initialData={bookData} onSave={handleSaveBook} />;
}
