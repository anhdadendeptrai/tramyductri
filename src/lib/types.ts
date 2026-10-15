export interface CoverPhotoPosition {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  rotate: number;
  scale?: number;
  zIndex: number;
  width?: string;
  height?: string;
}

export interface CoverPreset {
  id: number;
  name: string;
  positions: CoverPhotoPosition[];
}

export type PageTemplate =
  | 'center-hero'
  | 'left-image'
  | 'dual-photo'
  | 'film-frame'
  | 'polaroid'
  | 'collage'
  | 'grand-hero';

export interface PageTemplateInfo {
  id: PageTemplate;
  name: string;
  description: string;
  maxImages: number;
}

export const PAGE_TEMPLATE_LIST: PageTemplateInfo[] = [
  { id: 'center-hero',  name: 'Ảnh trung tâm',       description: 'Một ảnh Polaroid lớn ở giữa trang', maxImages: 1 },
  { id: 'left-image',   name: 'Ảnh trái + Lời nhắn', description: 'Ảnh bên trái, lời nhắn bên phải',    maxImages: 1 },
  { id: 'dual-photo',   name: 'Hai ảnh Polaroid',     description: 'Một ảnh lớn + một ảnh nhỏ chồng',    maxImages: 2 },
  { id: 'film-frame',   name: 'Khung Film cổ điển',   description: 'Ảnh trong khung cuộn phim vintage',  maxImages: 1 },
  { id: 'polaroid',     name: 'Polaroid + Tape',       description: 'Ảnh Polaroid lớn với tape scrapbook', maxImages: 1 },
  { id: 'collage',      name: 'Bộ ảnh Collage',        description: 'Hai ảnh chồng lên nhau tự nhiên',    maxImages: 2 },
  { id: 'grand-hero',   name: 'Ảnh toàn trang',        description: 'Ảnh panorama lớn nhất, không gian thoáng', maxImages: 1 },
];

export interface MemoryPage {
  id: string;
  template: PageTemplate;
  memoryTitle: string;
  subtitle: string;
  date: string;
  images: string[];
  message: string;
  quote?: string;
  handwrittenCaption?: string;
  signature?: string;
}

export interface FinalPageContent {
  subtitle: string;
  images: string[];
  letter: string;
  signature: string;
  closingQuote: string;
}

export interface CoverContent {
  title: string;
  subtitle: string;
  tagline: string;
  year: string;
  images: string[];
  presetIndex: number;
}

export interface BookData {
  id: string;
  slug: string;
  recipientName: string;
  cover: CoverContent;
  pages: MemoryPage[];
  finalPage: FinalPageContent;
  musicUrl: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}
