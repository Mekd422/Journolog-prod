"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, Mail, Camera, Share2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function AboutClient() {
  const { isAuthenticated } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const showDashboardLink = isMounted && isAuthenticated;

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#2A2A2A] font-sans antialiased overflow-x-hidden flex flex-col justify-between">
      {/* Header */}
      <header className="mx-auto w-full max-w-7xl flex items-center justify-between px-6 py-6 border-b border-gray-200/50">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Compass className="h-6 w-6 text-[#BA4A29] stroke-1.25" />
          <span className="font-serif text-2xl tracking-tight text-gray-900">journolog</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-gray-500">
          <Link href="/#features" className="hover:text-gray-900 transition-colors">Features</Link>
          <Link href="/#pricing" className="hover:text-gray-900 transition-colors">Pricing</Link>
          <Link href="/discover" className="hover:text-gray-900 transition-colors">Live Feed</Link>
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

      {/* Content */}
      <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24 flex-1">
        <div className="inline-flex items-center gap-1.5 bg-[#BA4A29]/10 text-[#BA4A29] px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase mb-6">
          Our Story
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl tracking-tight text-gray-900 mb-2">
          About Journolog
        </h1>
        <p className="text-[11px] text-gray-400 font-mono tracking-wider uppercase mb-10">
          A personal note from the creator
        </p>

        <div className="space-y-8 font-serif leading-relaxed text-gray-700 text-[16px] sm:text-lg">
          <p>
            Hi, my name is Marius and I am the creator of Journolog. With some great help I have been turning what were essentially some loose ideas into a great place where my kids and I can share our journeys with friends and family. Hopefully you will want to share your journeys here too!
          </p>

          <p>
            The inspiration for Journolog came to me in the weeks before I was going on yet another journey with my kids, this time to Malaysia and Borneo. We have been on a few trips together before, a couple of times traveling around Morocco, and on big city adventures to Rome, Naples and London.
          </p>

          <p>
            When travelling, and maybe especially with kids, you experience a lot that you later want to share with friends and family. While away you might post a few photos and a few sentences on social media, and some of your friends and family might stumble over it.
          </p>

          <p>
            Later the kids want to show and tell family and friends about their trip, and even though I’m all grown up, I love that too. Usually this means you show some pictures and tell a little about the experiences you’ve had, then when that is done, the trip is essentially over. The photos safely stored in the cloud, maybe never to be seen again, your memories slowly fading with time.
          </p>

          <div className="text-xl italic text-gray-800 border-l-2 border-[#BA4A29] pl-6 my-10 leading-relaxed font-serif">
            &ldquo;With Journolog I want to change that. Creating a space where you take the best from a personal journal and mix it with photos, a map and an easy to follow timeline. There you can share your journey as you are out travelling, and your friends and family can follow along.&rdquo;
          </div>

          <p>
            Sharing journeys with text and photos on Journolog creates a place where the journey can live on forever. You can revisit whenever you want to. You can also dive into other people's journeys and find inspiration for your next trip, or maybe just let the mind wander.
          </p>

          <p>
            I look forward to discovering your journey, and maybe someday our paths will cross out there in some far away land.
          </p>

          <div className="pt-8 border-t border-gray-200 mt-12">
            <p className="font-serif italic text-2xl text-gray-900 font-medium">Marius</p>
            <p className="text-[10px] text-gray-400 font-mono tracking-wider uppercase mt-1">Creator & Explorer</p>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-[#1C201C] text-gray-400 py-16 text-xs border-t border-[#2F342F] w-full">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex gap-6 font-semibold uppercase tracking-widest text-[10px]">
            <Link href="/policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/about" className="text-white hover:text-white transition-colors">About</Link>
            <Link href="#" className="hover:text-white transition-colors">Support</Link>
          </div>

          <div className="text-center md:order-none -order-1">
            <Compass className="mx-auto h-6 w-6 text-white mb-2 stroke-1.25" />
            <p className="font-serif text-lg text-white tracking-wider">journolog</p>
            <p className="text-[10px] text-gray-500 mt-1 font-mono tracking-widest uppercase">Traveler logbooks</p>
          </div>

          <div className="flex gap-4 text-sm">
            <Link href="#" className="hover:text-white text-gray-500 transition-colors"><Camera size={16} /></Link>
            <Link href="#" className="hover:text-white text-gray-500 transition-colors"><Share2 size={16} /></Link>
            <Link href="#" className="hover:text-white text-gray-500 transition-colors"><Mail size={16} /></Link>
          </div>
        </div>
        <p className="text-center text-[10px] text-gray-600 mt-12 font-mono tracking-wider">© 2026 JOURNOLOG. ALL RIGHTS RESERVED.</p>
      </footer>
    </main>
  );
}
