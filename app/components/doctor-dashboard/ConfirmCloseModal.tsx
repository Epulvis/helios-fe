'use client';

import React from 'react';
import { LoadingButton } from '../ui/LoadingButton';

interface ConfirmCloseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  patientName?: string;
}

export function ConfirmCloseModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  patientName,
}: ConfirmCloseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative overflow-hidden animate-modalEnter">
        {/* Modal Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center shadow-xs">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
              Tutup Kasus Konsultasi?
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Apakah Anda yakin ingin menyelesaikan dan menutup kasus {patientName ? `pasien ${patientName}` : 'ini'}? Tindakan ini bersifat final.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <div className="w-1/2">
            <LoadingButton
              type="button"
              onClick={onConfirm}
              isLoading={isLoading}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Ya, Tutup Kasus
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
}
