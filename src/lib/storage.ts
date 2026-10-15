import { BookData } from './types';
import { DEFAULT_BOOK_DATA } from './book-data';

const STORAGE_KEY = 'ductri_our_little_book_data';

export function getLocalBookData(): BookData {
  if (typeof window === 'undefined') {
    return DEFAULT_BOOK_DATA;
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Failed to parse book data from localStorage', err);
  }
  return DEFAULT_BOOK_DATA;
}

export function saveLocalBookData(data: BookData): void {
  if (typeof window === 'undefined') return;
  try {
    data.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save book data to localStorage', err);
  }
}

export async function fetchBookData(slug: string = 'ductri'): Promise<BookData> {
  try {
    const res = await fetch(`/api/book?slug=${slug}`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.id) {
        return json;
      }
    }
  } catch (err) {
    console.warn('API fetch failed, falling back to local storage / default data');
  }
  return getLocalBookData();
}

export async function saveBookDataApi(data: BookData): Promise<boolean> {
  saveLocalBookData(data);
  try {
    const res = await fetch('/api/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed to post data to API, local storage updated.');
    return true;
  }
}
