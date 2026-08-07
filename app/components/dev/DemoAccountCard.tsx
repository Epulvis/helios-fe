'use client';

import React from 'react';
import { Role } from '../../lib/types/auth';

interface DemoAccountCardProps {
  currentRole: Role;
  onSelectAccount: (identifier: string, password: string) => void;
}

export function DemoAccountCard({ currentRole, onSelectAccount }: DemoAccountCardProps) {
  // Only render in development environment
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const demoAccounts = {
    patient: {
      title: 'Akun Demo Pasien',
      identifier: '08123456789',
      name: 'Budi Santoso',
      password: 'password123',
    },
    doctor: {
      title: 'Akun Demo Dokter',
      identifier: 'doctor@mail.com',
      name: 'dr. Ahmad Pratama',
      password: 'password123',
    },
  };

  const account = demoAccounts[currentRole];

  return (
    <div className="mt-4 p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 shadow-sm animate-fadeIn">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 font-bold text-amber-800">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>DEV ONLY: {account.title}</span>
        </div>
        <button
          type="button"
          onClick={() => onSelectAccount(account.identifier, account.password)}
          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          Auto Fill
        </button>
      </div>

      <div className="grid grid-cols-2 gap-1 font-mono text-[11px] bg-amber-100/50 p-2 rounded-lg text-amber-950">
        <div>
          <span className="text-amber-700 block font-sans text-[10px]">Identifier:</span>
          {account.identifier}
        </div>
        <div>
          <span className="text-amber-700 block font-sans text-[10px]">Password:</span>
          {account.password}
        </div>
      </div>
    </div>
  );
}
