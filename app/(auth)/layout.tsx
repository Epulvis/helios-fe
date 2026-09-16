import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen w-full bg-gradient-to-br from-[#ebf4fd] via-[#e4f0fb] to-[#edf5fd] text-slate-800 flex items-center justify-center p-4 sm:p-6 lg:px-8 lg:py-4 relative overflow-y-auto lg:overflow-hidden font-sans">
      {/* Soft Decorative Ambient Gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-300/25 rounded-full blur-3xl pointer-events-none -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-teal-200/20 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-sky-200/15 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      {/* Main Content Wrapper */}
      <div className="w-full max-w-7xl mx-auto relative z-10 my-auto lg:h-full lg:max-h-[92vh] flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
}

