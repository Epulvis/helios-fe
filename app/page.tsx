import React from 'react';
import { Metadata } from 'next';
import { Navbar } from './components/landing/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { StatsBanner } from './components/landing/StatsBanner';
import { FeaturesSection } from './components/landing/FeaturesSection';
import { HowItWorksSection } from './components/landing/HowItWorksSection';
import { DeveloperSection } from './components/landing/DeveloperSection';
import { Footer } from './components/landing/Footer';

export const metadata: Metadata = {
  title: 'Helios - Health Evaluation through Language Intelligence for Outcome Screening',
  description: 'Platform evaluasi dan skrining kesehatan digital berbasis AI & Natural Language Processing (NLP) untuk pasien dan dokter.',
};

export default function RootPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf4fd] via-[#e4f0fb] to-[#edf5fd] text-slate-800 font-sans selection:bg-sky-500 selection:text-white">
      {/* Sticky Top Navigation Bar */}
      <Navbar />

      {/* Main Landing Sections */}
      <main>
        {/* 1. Hero Section with Interactive AI Vector Illustration */}
        <HeroSection />

        {/* 2. Key Metrics & Statistics Banner */}
        <StatsBanner />

        {/* 3. Core Features Section */}
        <FeaturesSection />

        {/* 4. How It Works Step-by-Step */}
        <HowItWorksSection />

        {/* 5. Developer Information Section */}
        <DeveloperSection />
      </main>

      {/* Footer Banner */}
      <Footer />
    </div>
  );
}
