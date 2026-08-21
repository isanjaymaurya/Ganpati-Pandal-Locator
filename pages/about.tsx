import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  MapPin,
  Star,
  Heart,
  List,
  Github,
  FileSpreadsheet,
  Users,
  Navigation,
  ExternalLink,
  Sparkles,
  Map,
} from 'lucide-react';
import Image from 'next/image';

const FEATURES = [
  {
    icon: <Map size={22} />,
    title: 'Interactive Map',
    description: 'Explore all Ganpati pandals on a live map with custom markers for easy identification.',
    color: 'text-primary-light',
    bg: 'bg-border',
  },
  {
    icon: <Navigation size={22} />,
    title: 'Your Location',
    description: 'Automatically detects your location and centers the map so you can find nearby pandals instantly.',
    color: 'text-accent-orange',
    bg: 'bg-orange-light/20',
  },
  {
    icon: <List size={22} />,
    title: 'Pandal Directory',
    description: 'Browse a searchable, filterable list of all pandals with address and visarjan date details.',
    color: 'text-accent-pink',
    bg: 'bg-accent-pink/10',
  },
  {
    icon: <Heart size={22} />,
    title: 'Favourites',
    description: 'Save your must-visit pandals to a personal favourites list for quick access anytime.',
    color: 'text-accent-gold',
    bg: 'bg-gold-light/40',
  },
  {
    icon: <MapPin size={22} />,
    title: 'Detailed Info',
    description: 'View address, how-to-reach directions, and a direct Google Maps link for every pandal.',
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    icon: <Sparkles size={22} />,
    title: 'Community Driven',
    description: 'Pandal data is sourced from the community — anyone can contribute and keep it up to date.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
];

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-8 flex flex-col gap-6">

        {/* ── Hero ── */}
        <div className="rounded-2xl bg-primary px-6 py-8 flex flex-col items-center text-center shadow-lg">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Image src="/ganpati-idol.png" alt="Ganpati Idol" width={64} height={64} />
          </div>
          <h1 className="text-2xl font-extrabold text-text-on-primary tracking-tight mb-1">
            Ganpati Pandal Locator
          </h1>
          <p className="text-border text-sm leading-relaxed max-w-xs">
            Your community-powered guide to finding &amp; exploring Ganpati pandals across Mumbai.
          </p>
        </div>

        {/* ── About ── */}
        <div className="rounded-2xl bg-surface border border-border px-6 py-5 shadow-sm">
          <h2 className="text-base font-bold text-text-primary mb-2 flex items-center gap-2">
            <Sparkles size={18} className="text-accent-gold" />
            About the App
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Ganpati Pandal Locator is a free, open-source web app built to help devotees discover
            Ganpati pandals during the Ganesh Utsav festival. Find pandals near you on an
            interactive map, browse the full directory, save your favourites, and get directions —
            all in one place.
          </p>
        </div>

        {/* ── Features ── */}
        <div className="rounded-2xl bg-surface border border-border px-6 py-5 shadow-sm">
          <h2 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
            <List size={18} className="text-primary-light" />
            Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-3 rounded-xl p-3 border border-border bg-background"
              >
                <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${f.bg} ${f.color}`}>
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{f.title}</p>
                  <p className="text-xs text-text-secondary leading-relaxed mt-0.5">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Contribute ── */}
        <div className="rounded-2xl bg-surface border border-border px-6 py-5 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
              <FileSpreadsheet size={18} className="text-success" />
            </div>
            <h2 className="text-base font-bold text-text-primary">Contribute Pandal Data</h2>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Know a pandal that&apos;s missing? Help the community by adding it to our shared Google
            Sheet. Every entry helps thousands of devotees find the right pandal.
          </p>
          <div className="rounded-xl bg-background border border-border p-4 mb-4 flex items-start gap-3">
            <Users size={18} className="text-primary-light shrink-0 mt-0.5" />
            <p className="text-xs text-text-secondary leading-relaxed">
              Fill in the pandal <strong className="text-text-primary">name</strong>,{' '}
              <strong className="text-text-primary">address</strong>,{' '}
              <strong className="text-text-primary">latitude &amp; longitude</strong>,{' '}
              <strong className="text-text-primary">how to reach</strong>, and{' '}
              <strong className="text-text-primary">visarjan date</strong>. That&apos;s it!
            </p>
          </div>
          <a
            href="https://docs.google.com/spreadsheets/d/1Z7Dsgv8f0eGSysC6JkOATyBDJODeNd2p8IOiLvPJXlY/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-success text-text-on-primary font-semibold text-sm py-3 px-4 hover:opacity-90 transition-opacity shadow-sm"
          >
            <FileSpreadsheet size={18} />
            Open Google Sheet
            <ExternalLink size={14} className="opacity-70" />
          </a>
        </div>

        {/* ── GitHub ── */}
        <div className="rounded-2xl bg-primary-dark px-6 py-5 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary-light/30 flex items-center justify-center">
              <Github size={18} className="text-text-on-primary" />
            </div>
            <h2 className="text-base font-bold text-text-on-primary">Open Source on GitHub</h2>
          </div>
          <p className="text-border text-sm leading-relaxed mb-4">
            This project is fully open source. If you find it useful, a ⭐ star on GitHub goes a
            long way in helping others discover it!
          </p>
          <a
            href="https://github.com/isanjaymaurya/Ganpati-Pandal-Locator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-accent-gold text-text-primary font-semibold text-sm py-3 px-4 hover:opacity-90 transition-opacity shadow-sm"
          >
            <Star size={16} className="fill-text-primary" />
            Star on GitHub
            <ExternalLink size={14} className="opacity-60" />
          </a>
        </div>
      </div>
    </MainLayout>
  );
};
