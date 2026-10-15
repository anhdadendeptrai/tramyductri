import { NextResponse } from 'next/server';
import { DEFAULT_BOOK_DATA } from '@/lib/book-data';
import { BookData } from '@/lib/types';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'book.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export async function GET() {
  try {
    ensureDataDir();
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(content);
      return NextResponse.json(data);
    }
  } catch (err) {
    console.error('Error reading book data file:', err);
  }
  return NextResponse.json(DEFAULT_BOOK_DATA);
}

export async function POST(req: Request) {
  try {
    ensureDataDir();
    const data: BookData = await req.json();
    data.updatedAt = new Date().toISOString();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Error saving book data file:', err);
    return NextResponse.json({ success: false, error: 'Failed to save data' }, { status: 500 });
  }
}
