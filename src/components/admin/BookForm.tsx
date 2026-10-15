'use client';

import React, { useState } from 'react';
import { BookData, MemoryPage, PageTemplate, PAGE_TEMPLATE_LIST } from '@/lib/types';
import { COVER_PRESETS } from '@/lib/book-data';
import {
  Save, Eye, Share2, Upload, Music, Image as ImageIcon,
  Heart, Shuffle, Plus, Trash2, X, GripVertical,
} from 'lucide-react';
import { BookContainer } from '@/components/book/BookContainer';

interface BookFormProps {
  initialData: BookData;
  onSave: (data: BookData) => Promise<boolean>;
}

export const BookForm: React.FC<BookFormProps> = ({ initialData, onSave }) => {
  const [data, setData] = useState<BookData>(initialData);
  const [activeTab, setActiveTab] = useState<'cover' | 'pages' | 'final' | 'music'>('cover');
  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(0);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);

  // File upload helper
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const json = await res.json();
        if (json.url) callback(json.url);
      }
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await onSave(data);
    setIsSaving(false);
    if (success) {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      setShareUrl(`${origin}/book/${data.slug || 'ductri'}`);
    }
  };

  const copyShareLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Add new memory page from template
  const handleAddPage = (template: PageTemplate) => {
    const tpl = PAGE_TEMPLATE_LIST.find((t) => t.id === template);
    const newPage: MemoryPage = {
      id: `page-${Date.now()}`,
      template,
      memoryTitle: tpl?.name || 'Kỷ niệm mới',
      subtitle: '',
      date: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.'),
      images: [],
      message: '',
    };
    const updatedPages = [...data.pages, newPage];
    setData({ ...data, pages: updatedPages });
    setSelectedPageIndex(updatedPages.length - 1);
    setShowTemplateModal(false);
    setActiveTab('pages');
  };

  // Delete a page
  const handleDeletePage = (idx: number) => {
    if (data.pages.length <= 1) return;
    const updatedPages = data.pages.filter((_, i) => i !== idx);
    setData({ ...data, pages: updatedPages });
    setSelectedPageIndex(Math.min(idx, updatedPages.length - 1));
  };

  // Update a field on selected page
  const updatePage = (idx: number, partial: Partial<MemoryPage>) => {
    const updatedPages = [...data.pages];
    updatedPages[idx] = { ...updatedPages[idx], ...partial };
    setData({ ...data, pages: updatedPages });
  };

  if (isPreviewMode) {
    return (
      <div className="relative w-full h-screen">
        <button
          onClick={() => setIsPreviewMode(false)}
          className="fixed top-4 left-4 z-50 px-4 py-2 bg-[#2B2825] text-[#FAF8F5] text-xs font-serif tracking-widest uppercase rounded-full shadow-md hover:bg-[#6E5A4E] transition-colors cursor-pointer"
        >
          ← QUAY LẠI TRANG CHỈNH SỬA
        </button>
        <BookContainer bookData={data} isAdminPreview={true} />
      </div>
    );
  }

  const currentPage = data.pages[selectedPageIndex];
  const tplInfo = currentPage ? PAGE_TEMPLATE_LIST.find((t) => t.id === currentPage.template) : null;
  const maxImages = tplInfo?.maxImages ?? 1;
  const hasCaption = currentPage?.template === 'dual-photo' || currentPage?.template === 'collage';

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2B2825] font-sans pb-20">
      {/* Template Picker Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-[#FFFDF7] rounded-lg border border-[#E8DFD8] shadow-2xl w-full max-w-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-medium text-[#2B2825]">Chọn mẫu trang kỷ niệm</h3>
              <button onClick={() => setShowTemplateModal(false)} className="text-[#6E5A4E] hover:text-[#2B2825] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#6E5A4E]">Chọn một bố cục phù hợp với kỷ niệm bạn muốn ghi lại:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PAGE_TEMPLATE_LIST.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleAddPage(tpl.id)}
                  className="group p-4 bg-[#FAF8F5] hover:bg-[#F5EFEB] border border-[#E8DFD8] hover:border-[#6E5A4E] rounded-md text-left transition-all cursor-pointer space-y-1.5"
                >
                  {/* Visual preview icon */}
                  <div className="w-full aspect-[4/3] bg-[#E8DFD8] rounded-xs mb-2 flex items-center justify-center relative overflow-hidden">
                    {tpl.id === 'center-hero' && (
                      <div className="w-3/5 h-3/5 bg-white border-4 border-white shadow-sm rotate-[-2deg] flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-[#6E5A4E]/40" />
                      </div>
                    )}
                    {tpl.id === 'left-image' && (
                      <div className="flex w-full px-1 gap-1">
                        <div className="w-2/3 h-10 bg-white border-2 border-white shadow-sm rotate-[-3deg]" />
                        <div className="w-1/3 flex items-center justify-center">
                          <div className="w-full h-1 bg-[#6E5A4E]/20 rounded" />
                        </div>
                      </div>
                    )}
                    {tpl.id === 'dual-photo' && (
                      <div className="relative w-full h-full">
                        <div className="absolute left-1 top-1 w-1/2 h-3/5 bg-white border-2 border-white shadow-sm rotate-[-4deg]" />
                        <div className="absolute right-1 bottom-1 w-2/5 h-2/5 bg-white border-2 border-white shadow-sm rotate-[5deg]" />
                      </div>
                    )}
                    {tpl.id === 'film-frame' && (
                      <div className="w-3/5 h-4/5 bg-[#2B2825] rounded-xs flex flex-col items-center justify-center gap-0.5">
                        <div className="w-4/5 h-3/5 bg-[#6E5A4E]/40" />
                        <div className="text-[8px] text-white/60 font-mono">35mm</div>
                      </div>
                    )}
                    {tpl.id === 'polaroid' && (
                      <div className="w-3/5 h-4/5 bg-white shadow-sm border border-[#E8DFD8] flex flex-col items-center justify-between py-1 rotate-[2deg]">
                        <div className="w-4/5 h-3/5 bg-[#E8DFD8]" />
                        <div className="w-4/5 h-1 bg-[#6E5A4E]/20 rounded" />
                      </div>
                    )}
                    {tpl.id === 'collage' && (
                      <div className="relative w-full h-full">
                        <div className="absolute left-0 top-2 w-3/5 h-3/5 bg-white border-2 border-white shadow-sm rotate-[-3deg]" />
                        <div className="absolute right-0 bottom-1 w-3/5 h-3/5 bg-white border-2 border-white shadow-sm rotate-[4deg]" />
                      </div>
                    )}
                    {tpl.id === 'grand-hero' && (
                      <div className="w-4/5 h-4/5 bg-white border-4 border-white shadow-sm rotate-[-1deg] flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-[#6E5A4E]/40" />
                      </div>
                    )}
                  </div>
                  <p className="font-serif text-sm font-medium text-[#2B2825] group-hover:text-[#6E5A4E]">{tpl.name}</p>
                  <p className="text-[11px] text-[#6E5A4E]/80">{tpl.description}</p>
                  <p className="text-[10px] text-[#6E5A4E]/50">{tpl.maxImages === 2 ? '2 ảnh' : '1 ảnh'}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-[#FFFDF7]/90 backdrop-blur-md border-b border-[#E8DFD8] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#F5EFEB] border border-[#E8DFD8] flex items-center justify-center">
            <Heart className="w-4 h-4 text-[#6E5A4E] fill-[#EAD5D1]" />
          </div>
          <div>
            <h1 className="font-serif text-lg sm:text-xl font-semibold tracking-wider text-[#2B2825]">
              QUẢN TRỊ SÁCH KỶ NIỆM
            </h1>
            <p className="font-sans text-[11px] text-[#6E5A4E]">
              {data.cover.title} — {data.pages.length} trang kỷ niệm
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreviewMode(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFFDF7] hover:bg-[#F5EFEB] border border-[#E8DFD8] text-[#6E5A4E] text-xs font-sans rounded-full transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>PREVIEW</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#2B2825] hover:bg-[#6E5A4E] text-[#FAF8F5] text-xs font-sans rounded-full transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'ĐANG LƯU...' : 'LƯU SÁCH'}</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E8DFD8] pb-3 mb-6 overflow-x-auto no-scrollbar">
          {(['cover', 'pages', 'final', 'music'] as const).map((tab) => {
            const labels = {
              cover: '1. BÌA SÁCH',
              pages: `2. TRANG KỶ NIỆM (${data.pages.length})`,
              final: '3. TRANG CUỐI',
              music: '4. NHẠC & CHIA SẺ',
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-xs font-sans tracking-wide transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-[#2B2825] text-[#FAF8F5] font-medium'
                    : 'bg-[#FFFDF7] text-[#6E5A4E] border border-[#E8DFD8] hover:bg-[#F5EFEB]'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* TAB 1: COVER */}
        {activeTab === 'cover' && (
          <div className="bg-[#FFFDF7] p-6 rounded-md border border-[#E8DFD8] shadow-xs space-y-6">
            <h2 className="font-serif text-xl font-medium border-b border-[#E8DFD8] pb-2">CẤU HÌNH BÌA SÁCH</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Tiêu đề / Tên', key: 'title' as const },
                { label: 'Subtitle', key: 'subtitle' as const },
                { label: 'Tagline', key: 'tagline' as const },
                { label: 'Năm', key: 'year' as const },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-[#6E5A4E] uppercase mb-1">{label}</label>
                  <input
                    type="text"
                    value={data.cover[key]}
                    onChange={(e) => setData({ ...data, cover: { ...data.cover, [key]: e.target.value } })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD8] rounded-xs text-sm focus:outline-none focus:border-[#6E5A4E]"
                  />
                </div>
              ))}
            </div>

            {/* Preset Picker */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-[#6E5A4E] uppercase">Bố cục khung ảnh</label>
                <button
                  type="button"
                  onClick={() => setData({ ...data, cover: { ...data.cover, presetIndex: (data.cover.presetIndex + 1) % COVER_PRESETS.length } })}
                  className="flex items-center gap-1 text-xs text-[#6E5A4E] hover:underline cursor-pointer"
                >
                  <Shuffle className="w-3 h-3" /> RANDOMIZE
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COVER_PRESETS.map((preset, idx) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setData({ ...data, cover: { ...data.cover, presetIndex: idx } })}
                    className={`p-2.5 rounded-xs border text-left text-xs font-sans transition-all cursor-pointer ${
                      data.cover.presetIndex === idx
                        ? 'bg-[#2B2825] text-[#FAF8F5] border-[#2B2825]'
                        : 'bg-[#FAF8F5] text-[#6E5A4E] border-[#E8DFD8] hover:bg-[#F5EFEB]'
                    }`}
                  >
                    Preset {preset.id}: {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 5 Cover Images */}
            <div className="space-y-3">
              <label className="block text-xs font-medium text-[#6E5A4E] uppercase">5 Ảnh Bìa</label>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const url = data.cover.images[idx] || '';
                  return (
                    <div key={idx} className="bg-[#FAF8F5] p-3 rounded-xs border border-[#E8DFD8] space-y-2 text-center">
                      <span className="text-[11px] font-medium text-[#6E5A4E] block">Ảnh {idx + 1}</span>
                      <div className="relative w-full aspect-[4/5] bg-[#E8DFD8] rounded-xs overflow-hidden flex items-center justify-center">
                        {url ? <img src={url} alt={`Cover ${idx + 1}`} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-[#6E5A4E]/40" />}
                      </div>
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={url}
                        onChange={(e) => {
                          const imgs = [...data.cover.images];
                          imgs[idx] = e.target.value;
                          setData({ ...data, cover: { ...data.cover, images: imgs } });
                        }}
                        className="w-full px-2 py-1 text-[11px] bg-[#FFFDF7] border border-[#E8DFD8] rounded-xs"
                      />
                      <label className="inline-flex items-center gap-1 px-2 py-1 bg-[#FFFDF7] hover:bg-[#F5EFEB] border border-[#E8DFD8] text-[10px] text-[#6E5A4E] rounded-xs cursor-pointer w-full justify-center">
                        <Upload className="w-3 h-3" /> Upload
                        <input type="file" accept="image/*" className="hidden"
                          onChange={(e) => handleFileUpload(e, (url) => {
                            const imgs = [...data.cover.images];
                            imgs[idx] = url;
                            setData({ ...data, cover: { ...data.cover, images: imgs } });
                          })}
                        />
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MEMORY PAGES */}
        {activeTab === 'pages' && (
          <div className="flex gap-4">
            {/* Sidebar - page list */}
            <div className="w-52 flex-shrink-0 space-y-2">
              <button
                onClick={() => setShowTemplateModal(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-[#2B2825] hover:bg-[#6E5A4E] text-[#FAF8F5] text-xs font-sans rounded-md transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                THÊM TRANG MỚI
              </button>

              <div className="space-y-1 max-h-[70vh] overflow-y-auto no-scrollbar pr-1">
                {data.pages.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`group flex items-center gap-2 px-3 py-2.5 rounded-md border cursor-pointer transition-all ${
                      selectedPageIndex === idx
                        ? 'bg-[#2B2825] text-[#FAF8F5] border-[#2B2825]'
                        : 'bg-[#FFFDF7] text-[#6E5A4E] border-[#E8DFD8] hover:bg-[#F5EFEB]'
                    }`}
                    onClick={() => setSelectedPageIndex(idx)}
                  >
                    <GripVertical className="w-3 h-3 opacity-40 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{p.memoryTitle || 'Chưa đặt tên'}</p>
                      <p className={`text-[10px] truncate ${selectedPageIndex === idx ? 'text-[#FAF8F5]/60' : 'text-[#6E5A4E]/60'}`}>{p.date}</p>
                    </div>
                    {data.pages.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeletePage(idx); }}
                        className={`opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity cursor-pointer ${selectedPageIndex === idx ? 'text-[#EAD5D1] hover:text-white' : 'text-[#6E5A4E] hover:text-red-400'}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-[#6E5A4E]/50 text-center pt-1">{data.pages.length} trang kỷ niệm</p>
            </div>

            {/* Editor panel */}
            {currentPage && (
              <div className="flex-1 bg-[#FFFDF7] p-6 rounded-md border border-[#E8DFD8] shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-[#E8DFD8] pb-3">
                  <div>
                    <h3 className="font-serif text-lg font-medium text-[#2B2825]">
                      {currentPage.memoryTitle || 'Chưa đặt tên'}
                    </h3>
                    <span className="text-xs text-[#6E5A4E] bg-[#F5EFEB] px-2 py-0.5 rounded-full border border-[#E8DFD8] font-sans mt-1 inline-block">
                      Mẫu: {PAGE_TEMPLATE_LIST.find(t => t.id === currentPage.template)?.name}
                    </span>
                  </div>
                  <span className="text-xs text-[#6E5A4E]/50 font-sans">Trang {selectedPageIndex + 2}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#6E5A4E] uppercase mb-1">Tên kỷ niệm</label>
                    <input
                      type="text"
                      value={currentPage.memoryTitle}
                      onChange={(e) => updatePage(selectedPageIndex, { memoryTitle: e.target.value })}
                      placeholder="VD: Ngày đầu tiên gặp nhau"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD8] rounded-xs text-sm focus:outline-none focus:border-[#6E5A4E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6E5A4E] uppercase mb-1">Ngày tháng</label>
                    <input
                      type="text"
                      value={currentPage.date}
                      onChange={(e) => updatePage(selectedPageIndex, { date: e.target.value })}
                      placeholder="VD: 14.02.2026"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD8] rounded-xs text-sm focus:outline-none focus:border-[#6E5A4E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6E5A4E] uppercase mb-1">Subtitle nhỏ</label>
                    <input
                      type="text"
                      value={currentPage.subtitle}
                      onChange={(e) => updatePage(selectedPageIndex, { subtitle: e.target.value })}
                      placeholder="VD: a new beginning"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD8] rounded-xs text-sm focus:outline-none focus:border-[#6E5A4E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6E5A4E] uppercase mb-1">Quote (tuỳ chọn)</label>
                    <input
                      type="text"
                      value={currentPage.quote || ''}
                      onChange={(e) => updatePage(selectedPageIndex, { quote: e.target.value })}
                      placeholder="VD: some moments are worth keeping."
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD8] rounded-xs text-sm focus:outline-none focus:border-[#6E5A4E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#6E5A4E] uppercase mb-1">Lời nhắn tay</label>
                  <textarea
                    rows={3}
                    value={currentPage.message}
                    onChange={(e) => updatePage(selectedPageIndex, { message: e.target.value })}
                    placeholder="Viết lời nhắn của bạn ở đây..."
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD8] rounded-xs text-sm font-handwriting text-base focus:outline-none focus:border-[#6E5A4E]"
                  />
                </div>

                {hasCaption && (
                  <div>
                    <label className="block text-xs font-medium text-[#6E5A4E] uppercase mb-1">Chú thích ảnh viết tay</label>
                    <input
                      type="text"
                      value={currentPage.handwrittenCaption || ''}
                      onChange={(e) => updatePage(selectedPageIndex, { handwrittenCaption: e.target.value })}
                      placeholder="VD: Kỷ niệm buổi chiều nắng ấm..."
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD8] rounded-xs text-sm font-handwriting focus:outline-none focus:border-[#6E5A4E]"
                    />
                  </div>
                )}

                {/* Images */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-[#6E5A4E] uppercase">
                    Ảnh kỷ niệm ({maxImages === 2 ? 'tối đa 2 ảnh' : '1 ảnh'})
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: maxImages }).map((_, imgIdx) => {
                      const imgUrl = currentPage.images[imgIdx] || '';
                      return (
                        <div key={imgIdx} className="bg-[#FAF8F5] p-3 rounded-xs border border-[#E8DFD8] space-y-2">
                          <span className="text-xs text-[#6E5A4E] font-medium block">Ảnh {imgIdx + 1}</span>
                          <div className="relative w-full aspect-[4/3] bg-[#E8DFD8] rounded-xs overflow-hidden flex items-center justify-center">
                            {imgUrl ? (
                              <img src={imgUrl} alt={`Page img ${imgIdx}`} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-[#6E5A4E]/40" />
                            )}
                          </div>
                          <input
                            type="text"
                            placeholder="Image URL"
                            value={imgUrl}
                            onChange={(e) => {
                              const imgs = [...currentPage.images];
                              imgs[imgIdx] = e.target.value;
                              updatePage(selectedPageIndex, { images: imgs });
                            }}
                            className="w-full px-2 py-1 text-xs bg-[#FFFDF7] border border-[#E8DFD8] rounded-xs"
                          />
                          <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFFDF7] hover:bg-[#F5EFEB] border border-[#E8DFD8] text-xs text-[#6E5A4E] rounded-xs cursor-pointer w-full justify-center">
                            <Upload className="w-3.5 h-3.5" /> Upload Ảnh
                            <input type="file" accept="image/*" className="hidden"
                              onChange={(e) => handleFileUpload(e, (url) => {
                                const imgs = [...currentPage.images];
                                imgs[imgIdx] = url;
                                updatePage(selectedPageIndex, { images: imgs });
                              })}
                            />
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Delete page */}
                {data.pages.length > 1 && (
                  <div className="pt-4 border-t border-[#E8DFD8]">
                    <button
                      onClick={() => handleDeletePage(selectedPageIndex)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 border border-red-200 rounded-full transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      XÓA TRANG NÀY
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FINAL PAGE */}
        {activeTab === 'final' && (
          <div className="bg-[#FFFDF7] p-6 rounded-md border border-[#E8DFD8] shadow-xs space-y-6">
            <h2 className="font-serif text-xl font-medium border-b border-[#E8DFD8] pb-2">TRANG CUỐI (THE LAST PAGE)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#6E5A4E] uppercase mb-1">Subtitle</label>
                <input type="text" value={data.finalPage.subtitle}
                  onChange={(e) => setData({ ...data, finalPage: { ...data.finalPage, subtitle: e.target.value } })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD8] rounded-xs text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6E5A4E] uppercase mb-1">Chữ ký</label>
                <input type="text" value={data.finalPage.signature}
                  onChange={(e) => setData({ ...data, finalPage: { ...data.finalPage, signature: e.target.value } })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD8] rounded-xs text-sm font-handwriting text-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6E5A4E] uppercase mb-1">Bức thư tay tình cảm</label>
              <textarea rows={7} value={data.finalPage.letter}
                onChange={(e) => setData({ ...data, finalPage: { ...data.finalPage, letter: e.target.value } })}
                className="w-full p-4 bg-[#FAF8F5] border border-[#E8DFD8] rounded-xs font-handwriting text-lg text-[#2B2825] leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6E5A4E] uppercase mb-1">Dòng kết trang sách</label>
              <input type="text" value={data.finalPage.closingQuote}
                onChange={(e) => setData({ ...data, finalPage: { ...data.finalPage, closingQuote: e.target.value } })}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD8] rounded-xs text-sm font-serif italic"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#6E5A4E] uppercase">Bộ sưu tập Scrapbook (6 ảnh)</label>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                {Array.from({ length: 6 }).map((_, idx) => {
                  const url = data.finalPage.images[idx] || '';
                  return (
                    <div key={idx} className="bg-[#FAF8F5] p-2 rounded-xs border border-[#E8DFD8] space-y-1.5 text-center">
                      <span className="text-[10px] text-[#6E5A4E]">Ảnh {idx + 1}</span>
                      <div className="relative w-full aspect-[4/3] bg-[#E8DFD8] rounded-xs overflow-hidden flex items-center justify-center">
                        {url ? <img src={url} alt={`Scrapbook ${idx + 1}`} className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 text-[#6E5A4E]/40" />}
                      </div>
                      <label className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#FFFDF7] border border-[#E8DFD8] text-[9px] text-[#6E5A4E] rounded-xs cursor-pointer w-full justify-center">
                        <Upload className="w-2.5 h-2.5" /> Upload
                        <input type="file" accept="image/*" className="hidden"
                          onChange={(e) => handleFileUpload(e, (url) => {
                            const imgs = [...data.finalPage.images];
                            imgs[idx] = url;
                            setData({ ...data, finalPage: { ...data.finalPage, images: imgs } });
                          })}
                        />
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MUSIC & SHARE */}
        {activeTab === 'music' && (
          <div className="bg-[#FFFDF7] p-6 rounded-md border border-[#E8DFD8] shadow-xs space-y-6">
            <h2 className="font-serif text-xl font-medium border-b border-[#E8DFD8] pb-2">NHẠC NỀN & CHIA SẺ</h2>
            <div>
              <label className="block text-xs font-medium text-[#6E5A4E] uppercase mb-1">Link nhạc nền MP3</label>
              <div className="flex gap-2">
                <input type="text" value={data.musicUrl}
                  onChange={(e) => setData({ ...data, musicUrl: e.target.value })}
                  placeholder="https://.../music.mp3"
                  className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#E8DFD8] rounded-xs text-sm"
                />
                <label className="flex items-center gap-1 px-3 py-2 bg-[#FAF8F5] hover:bg-[#F5EFEB] border border-[#E8DFD8] text-xs text-[#6E5A4E] rounded-xs cursor-pointer">
                  <Music className="w-3.5 h-3.5" /> Upload MP3
                  <input type="file" accept="audio/*" className="hidden"
                    onChange={(e) => handleFileUpload(e, (url) => setData({ ...data, musicUrl: url }))}
                  />
                </label>
              </div>
            </div>
            <div className="bg-[#FAF8F5] p-5 rounded-md border border-[#E8DFD8] space-y-3">
              <h3 className="font-serif text-base font-medium text-[#2B2825]">ĐƯỜNG DẪN CHIA SẺ</h3>
              <p className="text-xs text-[#6E5A4E]">Sau khi nhấn LƯU SÁCH, copy link bên dưới gửi cho người yêu.</p>
              {shareUrl ? (
                <div className="flex items-center gap-2">
                  <input type="text" readOnly value={shareUrl}
                    className="flex-1 px-3 py-2 bg-[#FFFDF7] border border-[#E8DFD8] rounded-xs text-xs font-mono"
                  />
                  <button onClick={copyShareLink}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#2B2825] hover:bg-[#6E5A4E] text-[#FAF8F5] text-xs font-sans rounded-xs transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    {copied ? 'ĐÃ COPY!' : 'COPY LINK'}
                  </button>
                </div>
              ) : (
                <p className="text-xs italic text-[#6E5A4E]">Nhấn &ldquo;LƯU SÁCH&rdquo; để tạo link chia sẻ.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
