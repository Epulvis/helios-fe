'use client';

import React, { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label: string;
  error?: string;
  registration?: UseFormRegisterReturn;
  isSelect?: boolean;
  options?: { value: string; label: string }[];
  icon?: React.ReactNode;
}

export function InputField({
  label,
  error,
  registration,
  isSelect = false,
  options = [],
  icon,
  type = 'text',
  id,
  className = '',
  ...props
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || registration?.name || label.toLowerCase().replace(/\s+/g, '-');
  const isPassword = type === 'password';
  const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${error ? 'animate-shake' : ''}`}>
      <label
        htmlFor={inputId}
        className="text-xs font-semibold text-slate-700 tracking-wide flex items-center gap-1"
      >
        {label}
      </label>

      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
            {icon}
          </div>
        )}

        {isSelect ? (
          <select
            id={inputId}
            className={`w-full h-11 px-3.5 ${
              icon ? 'pl-10' : ''
            } bg-slate-50 border ${
              error ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
            } rounded-xl text-sm font-medium text-slate-800 outline-none transition-all focus:ring-4 focus:bg-white appearance-none cursor-pointer ${className}`}
            {...registration}
            {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
          >
            <option value="" disabled>
              {props.placeholder || 'Pilih...'}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={inputId}
            type={currentType}
            className={`w-full h-11 px-3.5 ${
              icon ? 'pl-10' : ''
            } ${
              isPassword ? 'pr-10' : ''
            } bg-slate-50 border ${
              error ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-100'
            } rounded-xl text-sm font-medium text-slate-800 outline-none transition-all focus:ring-4 focus:bg-white ${className}`}
            {...registration}
            {...props}
          />
        )}

        {/* Dropdown Chevron Arrow for Select */}
        {isSelect && (
          <div className="absolute right-3.5 text-slate-400 pointer-events-none">
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        )}

        {/* Password Eye Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors p-1"
            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
          >
            {showPassword ? (
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
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.04 10.04 0 013.682-.863c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18"
                />
              </svg>
            ) : (
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        )}
      </div>

      {error && (
        <span className="text-xs font-medium text-red-500 mt-0.5 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}
