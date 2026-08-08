'use client';

import React, { useState, useRef, useEffect } from 'react';

interface KebabMenuProps {
  onViewDetail: () => void;
  onMarkReviewed: () => void;
  onCloseCase: () => void;
  status?: string;
}

export function KebabMenu({ onViewDetail, onMarkReviewed, onCloseCase, status }: KebabMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const isClosed = status === 'closed' || status === 'Tutup Kasus';

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        title="Opsi Aksi"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-1 w-48 rounded-2xl shadow-xl bg-white border border-slate-100 ring-1 ring-black/5 z-50 py-1.5 animate-fadeIn">
          {/* Lihat Detail */}
          <button
            onClick={() => {
              setIsOpen(false);
              onViewDetail();
            }}
            className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Lihat Detail</span>
          </button>

          {/* Tandai Sudah Ditinjau */}
          <button
            onClick={() => {
              setIsOpen(false);
              onMarkReviewed();
            }}
            className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Tandai Sudah Ditinjau</span>
          </button>

          <div className="my-1 border-t border-slate-100"></div>

          {/* Tutup Kasus */}
          <button
            disabled={isClosed}
            onClick={() => {
              setIsOpen(false);
              onCloseCase();
            }}
            className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              isClosed
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-rose-600 hover:bg-rose-50 cursor-pointer'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{isClosed ? 'Kasus Ditutup' : 'Tutup Kasus'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
