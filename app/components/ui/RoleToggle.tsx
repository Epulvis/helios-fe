'use client';

import React from 'react';
import { Role } from '../../lib/types/auth';

interface RoleToggleProps {
  role: Role;
  onChange: (role: Role) => void;
}

export function RoleToggle({ role, onChange }: RoleToggleProps) {
  return (
    <div className="w-full bg-slate-100 p-1 rounded-xl flex relative select-none">
      {/* Sliding background pill */}
      <div
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm border border-slate-200/80 transition-all duration-300 ease-out ${
          role === 'doctor' ? 'left-[calc(50%+2px)]' : 'left-1'
        }`}
      />

      {/* Patient Tab */}
      <button
        type="button"
        onClick={() => onChange('patient')}
        className={`flex-1 py-2.5 text-xs font-bold rounded-lg relative z-10 transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
          role === 'patient' ? 'text-blue-700' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span>Pasien</span>
      </button>

      {/* Doctor Tab */}
      <button
        type="button"
        onClick={() => onChange('doctor')}
        className={`flex-1 py-2.5 text-xs font-bold rounded-lg relative z-10 transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
          role === 'doctor' ? 'text-blue-700' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Dokter</span>
      </button>
    </div>
  );
}
