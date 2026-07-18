"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Compass, Mail, ArrowRight, Check, Camera, Share2, MapPin, Globe, Edit3, Send, Star, Heart, BookOpen, Settings, Bold, Italic, List, Quote, Image as ImageIcon, MoreHorizontal, Calendar } from "lucide-react";
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

      {/* Purpose / Features Section */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20 border-b border-gray-200/40">
        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="flex justify-center mb-3">
            <svg className="w-5 h-5 text-[#BA4A29] fill-current" viewBox="0 0 24 24">
              <path d="M12 3 C12 8 16 12 21 12 C16 12 12 16 12 21 C12 16 8 12 3 12 C8 12 12 8 12 3 Z" />
            </svg>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-[#BA4A29] uppercase">The Purpose</span>
          <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mt-3 leading-tight">
            Made to keep the <span className="text-[#BA4A29]">journey</span> alive.
          </h2>
          <p className="text-sm md:text-base text-gray-500 font-serif leading-relaxed mt-4">
            Your travels are more than a trip—they're a collection of moments that deserve to be remembered, cherished, and shared for years to come.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Card 1: Permanent home for your memories */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div className="max-w-md mb-8">
              <div className="h-10 w-10 bg-[#BA4A29]/10 text-[#BA4A29] flex items-center justify-center rounded-lg mb-5">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-2xl mb-3 text-gray-900 leading-snug">A permanent home for your memories.</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-serif">
                A beautiful, uncluttered space designed to protect your travel stories from fading. Revisit your favorite detours, quiet moments, and milestones exactly as they felt, long after the dust on your boots has settled.
              </p>
            </div>
            
            {/* Simulation of Journolog Editor */}
            <div className="bg-[#FAF8F5] border border-gray-200/60 rounded-xl overflow-hidden shadow-xs flex">
              {/* Simulated Left Sidebar */}
              <div className="w-12 border-r border-gray-200/60 bg-[#FAF8F5] flex flex-col items-center py-4 gap-4 text-gray-400">
                <div className="h-6 w-6 bg-[#BA4A29]/10 text-[#BA4A29] flex items-center justify-center rounded-md">
                  <BookOpen className="h-3.5 w-3.5" />
                </div>
                <ImageIcon className="h-3.5 w-3.5 hover:text-gray-600 cursor-pointer transition-colors" />
                <MapPin className="h-3.5 w-3.5 hover:text-gray-600 cursor-pointer transition-colors" />
                <Compass className="h-3.5 w-3.5 hover:text-gray-600 cursor-pointer transition-colors" />
                <Settings className="h-3.5 w-3.5 mt-auto hover:text-gray-600 cursor-pointer transition-colors" />
              </div>

              {/* Simulated Main Editor Area */}
              <div className="flex-1 bg-white p-4 font-serif">
                {/* Simulated Editor Toolbar */}
                <div className="flex items-center gap-2 border-b border-gray-200/60 pb-2 mb-3 text-[10px] text-gray-400 font-sans font-medium">
                  <span className="font-bold cursor-pointer hover:text-gray-700">H2</span>
                  <div className="w-[1px] h-3 bg-gray-200" />
                  <Bold className="h-3 w-3 cursor-pointer hover:text-gray-700" />
                  <Italic className="h-3 w-3 cursor-pointer hover:text-gray-700" />
                  <div className="w-[1px] h-3 bg-gray-200" />
                  <List className="h-3 w-3 cursor-pointer hover:text-gray-700" />
                  <div className="w-[1px] h-3 bg-gray-200" />
                  <Quote className="h-3 w-3 cursor-pointer hover:text-gray-700" />
                  <ImageIcon className="h-3 w-3 cursor-pointer hover:text-gray-700" />
                  <MoreHorizontal className="h-3 w-3 cursor-pointer hover:text-gray-700 ml-auto" />
                </div>

                {/* Editor Content */}
                <div className="text-gray-800">
                  <h4 className="font-serif font-bold text-base text-gray-900 leading-tight">Sunrise in Chiang Mai</h4>
                  <div className="flex items-center gap-3 text-[9px] text-gray-400 font-sans mt-1 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-2.5 w-2.5" /> May 12, 2024
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-2.5 w-2.5" /> Chiang Mai, Thailand
                    </span>
                  </div>
                  <p className="text-[10px] leading-relaxed text-gray-500 mb-3">
                    The city woke slowly, wrapped in soft golden light. From the temple steps, I watched the morning unfold—quiet, peaceful, unforgettable.
                  </p>
                  <div className="h-32 rounded-lg overflow-hidden border border-black/5 bg-gray-50">
                    <img 
                      src="https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=600" 
                      className="w-full h-full object-cover" 
                      alt="Sunrise temple Chiang Mai" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Bring them along, without the noise */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div className="max-w-md mb-8">
              <div className="h-10 w-10 bg-[#BA4A29]/10 text-[#BA4A29] flex items-center justify-center rounded-lg mb-5">
                <Send className="h-5 w-5 -rotate-12" />
              </div>
              <h3 className="font-serif text-2xl mb-3 text-gray-900 leading-snug">Bring them along, without the noise.</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-serif">
                Share your live timeline with family and friends via a single link or a secure password. Update your log straight from the road via email or WhatsApp—no apps for them to download, and no algorithms to please.
              </p>
            </div>

            {/* Simulation of Phone Email to Timeline Sync */}
            <div className="bg-[#FAF8F5] border border-gray-200/60 rounded-xl p-4 flex gap-4 items-center justify-center relative overflow-hidden min-h-[220px]">
              
              {/* Smartphone Mockup */}
              <div className="w-[125px] h-[200px] bg-black rounded-[20px] p-1 shadow-md border border-gray-800 flex-shrink-0 flex flex-col relative z-10 scale-95 sm:scale-100 transition-transform">
                <div className="bg-[#FAF8F5] rounded-[16px] w-full h-full flex flex-col text-[7px] font-sans relative overflow-hidden">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center px-2 py-0.5 text-gray-400 text-[5px] font-mono font-semibold bg-white border-b border-gray-100">
                    <span>9:41</span>
                    <div className="w-8 h-2.5 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-0.5 scale-[0.6]" />
                    <div className="flex gap-0.5 items-center">
                      <div className="w-1.5 h-1 bg-gray-400 rounded-2xs" />
                      <div className="w-2.5 h-1 bg-gray-400 rounded-2xs" />
                    </div>
                  </div>

                  {/* Mail Header */}
                  <div className="bg-white border-b border-gray-100 px-2 py-1 flex items-center justify-between text-[6px]">
                    <span className="text-[#BA4A29] font-medium cursor-pointer">Inbox</span>
                    <span className="font-semibold text-gray-800">New Message</span>
                    <Send className="h-2 w-2 text-[#BA4A29] fill-current" />
                  </div>

                  {/* Mail Info Fields */}
                  <div className="bg-white px-2 py-1 space-y-1 text-gray-500 text-[5px] border-b border-gray-100">
                    <div className="flex border-b border-gray-50 pb-0.5">
                      <span className="w-6 text-gray-400">To:</span>
                      <span className="text-[#BA4A29] font-mono">log@journolog.com</span>
                    </div>
                    <div className="flex">
                      <span className="w-6 text-gray-400">Subject:</span>
                      <span className="text-gray-800 font-medium">Sunset from the coast</span>
                    </div>
                  </div>

                  {/* Mail Body / Image attachment */}
                  <div className="flex-1 p-1 bg-white flex flex-col gap-1 overflow-hidden">
                    <div className="h-16 rounded-sm overflow-hidden border border-black/5">
                      <img 
                        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=300" 
                        className="w-full h-full object-cover" 
                        alt="Sunset coast image" 
                      />
                    </div>
                    <div className="h-1 w-full bg-gray-100 rounded-full" />
                    <div className="h-1 w-3/4 bg-gray-100 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Curved Dashed Connector Arrow (Visible on sm/md and larger screens) */}
              <svg className="absolute top-[35%] left-[45%] w-14 h-10 pointer-events-none stroke-[#BA4A29] stroke-[1.5] fill-none hidden sm:block z-0 opacity-80" viewBox="0 0 100 50">
                <path d="M 5,35 Q 50,5 92,28" strokeDasharray="3 3" />
                <polygon points="86,22 93,29 88,34" fill="#BA4A29" stroke="none" />
              </svg>

              {/* Timeline Entry Mockup */}
              <div className="flex-1 max-w-[155px] bg-white rounded-xl p-3 border border-gray-200/50 shadow-xs relative z-10 font-sans text-[7px] text-gray-800 flex flex-col justify-between">
                <div>
                  {/* Timeline User Header */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="h-4.5 w-4.5 bg-[#2d4a3e] rounded-full flex items-center justify-center text-white text-[7px] font-bold">
                      j
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 text-[6px]">May 16, 2024</span>
                      <span className="text-gray-400 text-[5px]">7:18 PM</span>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="h-16 rounded-md overflow-hidden border border-black/5 mb-1.5">
                    <img 
                      src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=300" 
                      className="w-full h-full object-cover" 
                      alt="Sunset coast image published" 
                    />
                  </div>

                  {/* Caption */}
                  <p className="text-gray-600 leading-snug font-serif text-[7px] mb-1">
                    Sunset from the coast. The colors tonight were unreal.
                  </p>

                  {/* Pill Badge */}
                  <span className="inline-flex items-center gap-0.5 bg-[#FCEDE8] text-[#BA4A29] px-1.5 py-0.5 rounded-full text-[5px] font-mono font-medium border border-[#BA4A29]/10">
                    <Mail className="h-1.5 w-1.5" /> Posted via Email
                  </span>
                </div>

                {/* Sub timeline indicator */}
                <div className="border-t border-gray-100 pt-1.5 mt-2 flex items-center gap-1.5 text-gray-400 text-[5px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <span>May 16, 2024 9:32 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Badge */}
        <div className="flex items-center justify-center gap-2 mt-16 text-xs md:text-sm text-gray-700 font-serif text-center">
          <span className="text-[#BA4A29]">🌐</span>
          <span>Your story. Your way. Kept safe, and always yours to share.</span>
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
                <li className="flex items-center gap-2"><Check size={14} className="text-[#BA4A29] stroke-[3]" /> Private travel journals</li>
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
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
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