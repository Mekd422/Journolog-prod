"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Compass, Mail, ArrowRight, Check, Camera, Share2, MapPin, Globe, Edit3, Send, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function RotatingGlobe() {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto flex items-center justify-center select-none">
      {/* Outer atmospheric glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#BA4A29]/10 to-[#BA4A29]/0 blur-2xl animate-pulse" />
      
      {/* Globe body */}
      <div className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border border-[#BA4A29]/20 bg-[#FDFBF7] shadow-[inset_-10px_-10px_35px_rgba(186,74,41,0.06),0_15px_40px_rgba(0,0,0,0.04)]">
        {/* Spinning Map Layer */}
        <div 
          className="absolute inset-0 flex opacity-[0.65]"
          style={{
            width: '200%',
            animation: 'spin-globe 30s linear infinite',
          }}
        >
          {/* Map 1 */}
          <svg viewBox="0 0 400 200" className="w-1/2 h-full fill-[#BA4A29]/20 text-[#BA4A29]/20">
            {/* North America */}
            <path d="M 60,40 C 80,35 110,45 120,60 C 105,75 90,85 70,80 C 50,75 50,55 60,40 Z" />
            {/* South America */}
            <path d="M 100,90 C 115,95 110,120 100,140 C 90,160 80,150 85,120 C 90,105 90,95 100,90 Z" />
            {/* Eurasia */}
            <path d="M 180,30 C 220,25 280,35 300,55 C 280,75 250,70 230,65 C 210,60 170,50 180,30 Z" />
            {/* Africa */}
            <path d="M 200,75 C 225,80 230,100 220,120 C 210,140 195,145 190,125 C 185,110 185,85 200,75 Z" />
            {/* Australia */}
            <path d="M 280,110 C 300,110 310,125 300,135 C 285,145 270,135 280,110 Z" />
          </svg>
          {/* Map 2 (identical seamless copy) */}
          <svg viewBox="0 0 400 200" className="w-1/2 h-full fill-[#BA4A29]/20 text-[#BA4A29]/20">
            <path d="M 60,40 C 80,35 110,45 120,60 C 105,75 90,85 70,80 C 50,75 50,55 60,40 Z" />
            <path d="M 100,90 C 115,95 110,120 100,140 C 90,160 80,150 85,120 C 90,105 90,95 100,90 Z" />
            <path d="M 180,30 C 220,25 280,35 300,55 C 280,75 250,70 230,65 C 210,60 170,50 180,30 Z" />
            <path d="M 200,75 C 225,80 230,100 220,120 C 210,140 195,145 190,125 C 185,110 185,85 200,75 Z" />
            <path d="M 280,110 C 300,110 310,125 300,135 C 285,145 270,135 280,110 Z" />
          </svg>
        </div>

        {/* Shading layer overlays for 3D sphere illusion */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/[0.03] via-transparent to-white/40 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,transparent_50%,rgba(186,74,41,0.05)_100%)] pointer-events-none" />
      </div>

      {/* Static Grid Overlay */}
      <svg viewBox="0 0 200 200" className="absolute w-[224px] h-[224px] md:w-[288px] md:h-[288px] text-[#BA4A29]/10 pointer-events-none">
        <circle cx="100" cy="100" r="99" fill="none" stroke="currentColor" strokeWidth="0.5" />
        {/* Latitudes */}
        <line x1="0" y1="100" x2="200" y2="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
        <ellipse cx="100" cy="100" rx="99" ry="50" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
        <ellipse cx="100" cy="100" rx="99" ry="25" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
        {/* Longitudes */}
        <ellipse cx="100" cy="100" rx="50" ry="99" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
        <ellipse cx="100" cy="100" rx="75" ry="99" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="100" y1="0" x2="100" y2="200" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
      </svg>
      
      {/* Orbiting Flight Path Overlay */}
      <svg viewBox="0 0 200 200" className="absolute w-[224px] h-[224px] md:w-[288px] md:h-[288px] text-[#BA4A29]/65 pointer-events-none">
        <path 
          d="M 50,130 Q 95,45 150,110" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.25" 
          strokeDasharray="4 4"
          className="animate-[dash_8s_linear_infinite]"
        />
        <circle cx="50" cy="130" r="2.5" fill="#BA4A29" />
        <circle cx="150" cy="110" r="2.5" fill="#BA4A29" />
      </svg>

      {/* Floating Coordinates indicator */}
      <div className="absolute -bottom-2 bg-[#FCFAF7] border border-black/5 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest text-[#BA4A29] uppercase shadow-sm">
        LAT: 45.4642° N | LON: 9.1900° E
      </div>
    </div>
  );
}

function ChicHeroVisual() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center py-10 min-h-[360px] sm:min-h-[480px]">
      {/* Decorative Vintage Passport Stamp */}
      <div className="absolute top-0 right-10 w-24 h-24 opacity-[0.08] text-[#BA4A29] pointer-events-none hidden sm:block select-none rotate-[18deg]">
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-current fill-none">
          <circle cx="50" cy="50" r="45" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="41" strokeWidth="0.5" strokeDasharray="3 3" />
          <path d="M 20,50 L 80,50 M 50,20 L 50,80" strokeWidth="0.5" />
          <text x="50" y="45" textAnchor="middle" className="font-sans text-[7px] font-bold tracking-widest uppercase stroke-none fill-current">DEPARTED</text>
          <text x="50" y="60" textAnchor="middle" className="font-serif text-[10px] tracking-wider italic stroke-none fill-current">journolog</text>
        </svg>
      </div>

      {/* Left Overlapping Polaroid Card */}
      <div className="absolute left-0 lg:-left-6 top-14 bg-white p-3 pb-7 rounded-md shadow-lg border border-black/[0.02] rotate-[-7deg] w-40 sm:w-44 hidden sm:block z-10 transition-all hover:rotate-0 hover:scale-105 duration-300 hover:shadow-xl">
        <div className="relative aspect-square w-full bg-gray-100 rounded-sm overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600" 
            alt="Kyoto Temple" 
            className="w-full h-full object-cover grayscale-[15%] sepia-[12%]"
          />
        </div>
        <p className="mt-3.5 font-serif italic text-[11px] text-center text-gray-500">Kyoto, Japan — May &apos;26</p>
      </div>

      {/* Right Overlapping Polaroid Card */}
      <div className="absolute right-0 lg:-right-6 bottom-14 bg-white p-3 pb-7 rounded-md shadow-md border border-black/[0.02] rotate-[9deg] w-36 sm:w-40 hidden md:block z-10 transition-all hover:rotate-0 hover:scale-105 duration-300 hover:shadow-lg">
        <div className="relative aspect-square w-full bg-gray-100 rounded-sm overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=600" 
            alt="Bangkok Canal" 
            className="w-full h-full object-cover grayscale-[8%] contrast-[95%]"
          />
        </div>
        <p className="mt-3.5 font-serif italic text-[10px] text-center text-gray-500">Bangkok market vibes</p>
      </div>

      {/* Centerpiece Rotating Globe */}
      <RotatingGlobe />
    </div>
  );
}

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Avoid synchronous state change warning inside effect body by deferring to microtask queue
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const showDashboardLink = isMounted && isAuthenticated;

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#2A2A2A] font-sans antialiased overflow-x-hidden relative">
      <style>{`
        @keyframes spin-globe {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .vintage-grid {
          background-image: radial-gradient(rgba(186, 74, 41, 0.08) 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}</style>

      {/* Header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 border-b border-gray-200/50">
        <div className="flex items-center gap-2">
          <Compass className="h-6 w-6 text-[#BA4A29] stroke-1.25" />
          <span className="font-serif text-2xl tracking-tight text-gray-900">journolog</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-gray-500">
          <Link href="#features" className="hover:text-gray-900 transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</Link>
          <Link href="#explore" className="hover:text-gray-900 transition-colors">Live Feed</Link>
        </nav>
        <div className="flex items-center gap-4">
          {showDashboardLink ? (
            <Link href="/app/logs">
              <button className="bg-[#BA4A29] text-white text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-[4px] hover:bg-[#a33f21] transition shadow-xs cursor-pointer">
                Dashboard
              </button>
            </Link>
          ) : (
            <Link href="/signup">
              <button className="bg-[#BA4A29] text-white text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-[4px] hover:bg-[#a33f21] transition shadow-xs cursor-pointer">
                Start Your Log
              </button>
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:py-20 border-b border-gray-200/40 relative">
        <div className="vintage-grid absolute inset-0 opacity-40 pointer-events-none" />
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center relative z-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-[#BA4A29]/10 text-[#BA4A29] px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase mb-6">
              <Globe className="h-3 w-3" />
              Digital Travel Logbook
            </div>
            <h1 className="font-serif text-4xl leading-[1.12] tracking-tight text-gray-900 sm:text-6xl">
              Your travel memories, beautifully kept and effortlessly shared.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-gray-655 font-serif italic">
              A quiet, linear space to preserve your adventures for yourself, and easily share them with the world. No ads, no algorithmic noise. Just your journey.
            </p>
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {showDashboardLink ? (
                  <Link href="/app/logs" className="w-full sm:w-auto">
                    <button className="w-full bg-[#BA4A29] text-white text-sm font-semibold uppercase tracking-wider px-8 py-4 rounded-[4px] hover:bg-[#a33f21] transition shadow-md cursor-pointer flex items-center justify-center gap-2">
                      Go to Dashboard <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                ) : (
                  <Link href="/signup" className="w-full sm:w-auto">
                    <button className="w-full bg-[#BA4A29] text-white text-sm font-semibold uppercase tracking-wider px-8 py-4 rounded-[4px] hover:bg-[#a33f21] transition shadow-md cursor-pointer flex items-center justify-center gap-2">
                      Create free Journal <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                )}
                <Link href="/discover" className="w-full sm:w-auto">
                  <button className="w-full border border-gray-300 bg-white/50 backdrop-blur-xs text-gray-800 text-sm font-semibold uppercase tracking-wider px-6 py-4 rounded-[4px] hover:bg-white hover:border-gray-400 transition cursor-pointer">
                    Discover Public Logs
                  </button>
                </Link>
              </div>
            </div>
          </div>
          
          <ChicHeroVisual />
        </div>
      </section>

      {/* Editorial Quote block */}
      <section className="py-16 text-center max-w-3xl mx-auto px-6 border-b border-gray-200/40">
        <span className="text-[#BA4A29] font-serif text-3xl leading-none">✦</span>
        <blockquote className="font-serif italic text-xl md:text-2xl text-gray-800 mt-4 leading-relaxed">
          &ldquo;The world is a book and those who do not travel read only one page.&rdquo;
        </blockquote>
        <cite className="block text-[10px] font-bold tracking-widest text-gray-500 uppercase mt-4 not-italic">
          &mdash; Saint Augustine
        </cite>
      </section>

      {/* Features Grid */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20 border-b border-gray-200/40">
        <div className="text-center max-w-md mx-auto mb-16">
          <span className="text-xs font-mono tracking-widest text-[#BA4A29] uppercase">The Platform</span>
          <h2 className="font-serif text-3xl text-gray-900 mt-2">Designed for the modern voyager</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Card 1 */}
          <div className="bg-white border border-gray-200/60 rounded-xl p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div className="max-w-md mb-8">
              <div className="h-10 w-10 bg-[#BA4A29]/10 text-[#BA4A29] flex items-center justify-center rounded-lg mb-4">
                <Edit3 className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-2xl mb-3 text-gray-900">A clean writing sanctuary.</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-serif">
                A minimal, typography-focused editor lets your reflections stand out. Drag-and-drop cover photos, insert locations, and tag your entries instantly.
              </p>
            </div>
            <div className="bg-[#FAF8F5] border border-gray-200/60 rounded-lg p-5 font-mono text-xs text-gray-700">
              <div className="flex gap-2 mb-3 border-b border-gray-200/70 pb-2 text-gray-400">
                <span className="font-bold">B</span><span>I</span><span>U</span><span className="ml-auto text-[10px]">📍 Lake Como, Italy</span>
              </div>
              <p className="font-serif text-sm leading-relaxed text-gray-800 italic">
                Woke up to light mist hovering over the water. The mountains slope directly into the deep blue lake. Spent the morning journaling on the balcony...
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200/60 rounded-xl p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div className="max-w-md mb-8">
              <div className="h-10 w-10 bg-[#BA4A29]/10 text-[#BA4A29] flex items-center justify-center rounded-lg mb-4">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-2xl mb-3 text-gray-900">Log via Email. No app needed.</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-serif">
                Write on the go. Send photos, text, or audio directly to your unique Journolog email address. We translate it instantly into beautiful log entries.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-[#FAF8F5] rounded-lg p-4 border border-gray-200/60">
              <div className="bg-white border border-gray-200/70 shadow-xs rounded-lg p-4 w-full sm:w-44 text-center">
                <Send className="mx-auto text-[#BA4A29] mb-2" size={18} />
                <p className="text-[10px] text-gray-400 font-mono">To: log@journolog.com</p>
                <div className="h-1.5 w-16 bg-gray-200 mx-auto mt-2 rounded-full" />
              </div>
              <ArrowRight className="text-gray-300 rotate-90 sm:rotate-0 flex-shrink-0" size={16} />
              <div className="bg-white border border-gray-200/70 shadow-xs rounded-lg p-3 w-full sm:w-44 text-[10px]">
                <span className="text-[9px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-mono font-bold">PROCESSED</span>
                <p className="mt-1 font-serif font-bold text-gray-800">Misty Alps Morning</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline preview section */}
      <section id="explore" className="py-20 border-b border-gray-200/40 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-md mx-auto mb-16">
            <span className="text-xs font-mono tracking-widest text-[#BA4A29] uppercase">Linear Layout</span>
            <h2 className="font-serif text-3xl text-gray-900 mt-2">Bangkok to Kyoto itinerary</h2>
            <p className="text-sm text-gray-500 mt-2 font-serif">A clean timeline showing how your logs display publicly.</p>
          </div>

          <div className="grid md:grid-cols-[240px_1fr] gap-10">
            <div className="space-y-12 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-200 pl-8 font-mono">
              <div className="relative">
                <div className="absolute left-1.5 top-1.5 h-3.5 w-3.5 rounded-full bg-[#BA4A29] border-4 border-white shadow-xs" />
                <p className="text-xs font-bold text-[#BA4A29]">MAY 10</p>
                <p className="font-serif font-bold text-gray-900 text-sm mt-0.5">Bangkok, Thailand</p>
                <p className="text-[10px] text-gray-400">Temples & Street Markets</p>
              </div>
              <div className="relative">
                <div className="absolute left-1.5 top-1.5 h-3.5 w-3.5 rounded-full bg-gray-300 border-4 border-white" />
                <p className="text-xs font-bold text-gray-400">MAY 12</p>
                <p className="font-serif font-medium text-gray-700 text-sm mt-0.5">Chiang Mai, Thailand</p>
                <p className="text-[10px] text-gray-400 font-serif italic">Highlands expedition</p>
              </div>
              <div className="relative">
                <div className="absolute left-1.5 top-1.5 h-3.5 w-3.5 rounded-full bg-gray-300 border-4 border-white" />
                <p className="text-xs font-bold text-gray-400">MAY 16</p>
                <p className="font-serif font-medium text-gray-700 text-sm mt-0.5">Kyoto, Japan</p>
                <p className="text-[10px] text-gray-400 font-serif">Bamboo groves & shrine walk</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="h-44 rounded-lg overflow-hidden bg-gray-50 border border-black/5 hover:scale-[1.01] transition-transform duration-300">
                <img src="https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=600" className="w-full h-full object-cover" alt="Bangkok Boats" />
              </div>
              <div className="h-44 rounded-lg overflow-hidden bg-gray-50 border border-black/5 col-span-1 sm:col-span-2 hover:scale-[1.01] transition-transform duration-300">
                <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800" className="w-full h-full object-cover" alt="Temple Architecture" />
              </div>
              <div className="h-44 rounded-lg overflow-hidden bg-gray-50 border border-black/5 col-span-2 sm:col-span-1 hover:scale-[1.01] transition-transform duration-300">
                <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=600" className="w-full h-full object-cover" alt="Coffee and journal" />
              </div>
              <div className="h-44 rounded-lg overflow-hidden bg-gray-50 border border-black/5 hover:scale-[1.01] transition-transform duration-300">
                <img src="https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=600" className="w-full h-full object-cover" alt="Kyoto street" />
              </div>
              <div className="h-44 rounded-lg overflow-hidden bg-gray-50 border border-black/5 hover:scale-[1.01] transition-transform duration-300">
                <img src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600" className="w-full h-full object-cover" alt="Bamboo forest" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center max-w-md mx-auto mb-16">
          <span className="text-xs font-mono tracking-widest text-[#BA4A29] uppercase">Subscriptions</span>
          <h2 className="font-serif text-3xl text-gray-900 mt-2">Transparent pricing plans</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white border border-gray-200/80 rounded-xl p-8 flex flex-col justify-between shadow-xs">
            <div>
              <h3 className="font-serif text-xl font-medium text-gray-900">Standard Voyager</h3>
              <p className="text-xs text-gray-400 mt-1 font-mono uppercase">Basic logbook</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-serif font-bold text-gray-900">$0</span>
                <span className="text-gray-550 text-xs font-mono uppercase">/ Free Forever</span>
              </div>
              <ul className="mt-8 space-y-4 border-t border-gray-100 pt-6 text-sm text-gray-600 font-serif">
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600 stroke-[3]" /> Capped storage (50 MB)</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600 stroke-[3]" /> Web editor access</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600 stroke-[3]" /> Max file size up to 5MB</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600 stroke-[3]" /> Community support forum</li>
              </ul>
            </div>
            <button className="mt-8 w-full border border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-700 rounded-[4px] py-3.5 hover:bg-gray-50 hover:border-gray-300 transition cursor-pointer">
              Get Started
            </button>
          </div>

          {/* Premium Tier */}
          <div className="bg-white border-2 border-[#BA4A29] rounded-xl p-8 flex flex-col justify-between shadow-md relative">
            <span className="absolute -top-3.5 right-6 bg-[#BA4A29] text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-sm">
              RECOMMENDED
            </span>
            <div>
              <h3 className="font-serif text-xl font-medium text-gray-900">Elite Navigator</h3>
              <p className="text-xs text-[#BA4A29] mt-1 font-mono uppercase">Unlimited travel logs</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-serif font-bold text-gray-900">$19.95</span>
                <span className="text-gray-550 text-xs font-mono uppercase">/ Year</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1 font-mono uppercase">Renewed automatically</p>
              <ul className="mt-5 space-y-4 border-t border-gray-100 pt-6 text-sm text-gray-600 font-serif">
                <li className="flex items-center gap-2"><Check size={14} className="text-[#BA4A29] stroke-[3]" /> Unlimited email-to-log uploads</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#BA4A29] stroke-[3]" /> Large video uploads (up to 250MB)</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#BA4A29] stroke-[3]" /> Password-protected private journals</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#BA4A29] stroke-[3]" /> Custom domain support</li>
              </ul>
            </div>
            <button className="mt-8 w-full bg-[#BA4A29] text-white text-xs font-semibold uppercase tracking-wider rounded-[4px] py-3.5 hover:bg-[#a33f21] transition shadow-xs cursor-pointer">
              Subscribe Premium
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1C201C] text-gray-400 py-16 text-xs border-t border-[#2F342F]">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex gap-6 font-semibold uppercase tracking-widest text-[10px]">
            <Link href="/policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">About</Link>
            <Link href="#" className="hover:text-white transition-colors">Support</Link>
          </div>
          
          <div className="text-center md:order-none -order-1">
            <Compass className="mx-auto h-6 w-6 text-white mb-2 stroke-1.25" />
            <p className="font-serif text-lg text-white tracking-wider">journolog</p>
            <p className="text-[10px] text-gray-500 mt-1 font-mono tracking-widest uppercase">Traveler logbooks</p>
          </div>

          <div className="flex gap-4 text-sm">
            <Link href="#" className="hover:text-white text-gray-500 hover:text-white transition-colors"><Camera size={16} /></Link>
            <Link href="#" className="hover:text-white text-gray-500 hover:text-white transition-colors"><Share2 size={16} /></Link>
            <Link href="#" className="hover:text-white text-gray-500 hover:text-white transition-colors"><Mail size={16} /></Link>
          </div>
        </div>
        <p className="text-center text-[10px] text-gray-600 mt-12 font-mono tracking-wider">© 2026 JOURNOLOG. ALL RIGHTS RESERVED.</p>
      </footer>
    </main>
  );
}