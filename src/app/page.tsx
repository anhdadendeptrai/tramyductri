'use client';

import React, { useEffect, useState } from 'react';
import { BookContainer } from '@/components/book/BookContainer';
import { fetchBookData } from '@/lib/storage';
import { BookData } from '@/lib/types';
import { DEFAULT_BOOK_DATA } from '@/lib/book-data';

export default function HomePage() {
  const [bookData, setBookData] = useState<BookData>(DEFAULT_BOOK_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookData('ductri').then((data) => {
      setBookData(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen bg-[#FAF8F5] paper-texture flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#2B2825] border-t-transparent animate-spin" />
        <p className="font-serif text-sm tracking-widest text-[#6E5A4E] uppercase">
          Loading book...
        </p>
      </div>
    );
  }

  return <BookContainer bookData={bookData} />;
}
