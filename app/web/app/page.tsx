"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Compass, Mail, ArrowRight, Check, Camera, Share2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";


function InteractiveHeroImage() {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-300, 300], [10, -10]);
  const rotateY = useTransform(x, [-300, 300], [-10, 10]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div 
      className="relative w-full h-[320px] sm:h-[450px] lg:h-[600px] flex items-center justify-center perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={cardRef}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-200 ease-out"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000')`,
            transform: "translateZ(-20px) scale(1.1)" 
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
        
        <motion.div 
          style={{ transform: "translateZ(40px)" }}
          className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-xl border border-white/20 max-w-sm hidden sm:block shadow-xl"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-[#BA4A29]">Live Stream</span>
          <p className="font-serif text-lg text-gray-900 mt-1">&ldquo;Watching the mist rise over the valley peaks from the morning express...&rdquo;</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showDashboardLink = isMounted && isAuthenticated;

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#2A2A2A] font-sans antialiased overflow-x-hidden">
      
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Compass className="h-6 w-6 text-[#BA4A29]" strokeWidth={1.5} />
          <span className="font-serif text-2xl tracking-tight text-gray-900">journolog</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="#features" className="hover:text-gray-900">Features</Link>
          <Link href="#pricing" className="hover:text-gray-900">Pricing</Link>
          <Link href="#explore" className="hover:text-gray-900">Explore</Link>
        </nav>
        <div className="flex items-center gap-4">
          {showDashboardLink ? (
            <Link href="/app/logs">
              <button className="bg-[#BA4A29] text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-[#a33f21] transition cursor-pointer">
                Go to Dashboard
              </button>
            </Link>
          ) : (
            <Link href="/signup">
              <button className="bg-[#BA4A29] text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-[#a33f21] transition cursor-pointer">
                Start Your Log
              </button>
            </Link>
          )}
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <div className="max-w-xl">
          <h1 className="font-serif text-5xl leading-[1.15] tracking-tight text-gray-900 sm:text-6xl">
            Your travel memories, beautifully kept and effortlessly shared.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            A quiet, linear space to preserve your adventures for yourself, and easily share them with the world.
          </p>
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {showDashboardLink ? (
                <Link href="/app/logs" className="w-full sm:w-auto">
                  <button className="w-full bg-[#BA4A29] text-white text-base font-medium px-8 py-3.5 rounded-md hover:bg-[#a33f21] transition shadow-md cursor-pointer">
                    Go to Dashboard
                  </button>
                </Link>
              ) : (
                <Link href="/signup" className="w-full sm:w-auto">
                  <button className="w-full bg-[#BA4A29] text-white text-base font-medium px-8 py-3.5 rounded-md hover:bg-[#a33f21] transition shadow-md cursor-pointer">
                    Create a Free Journal
                  </button>
                </Link>
              )}
              <Link href="/discover" className="w-full sm:w-auto">
                <button className="w-full border border-gray-200 text-gray-850 text-base font-medium px-6 py-3.5 rounded-md hover:bg-gray-50 transition cursor-pointer">
                  Discover Public Logs
                </button>
              </Link>
            </div>
          </div>
        </div>
        
        <InteractiveHeroImage />
      </section>

      <div className="text-center py-12 border-t border-gray-100">
        <h2 className="font-serif text-2xl text-gray-800">Everything you need to tell your story, your way.</h2>
      </div>

      <section id="features" className="mx-auto max-w-7xl px-6 grid gap-8 md:grid-cols-2 mb-24">
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex flex-col justify-between">
          <div className="max-w-sm mb-8">
            <h3 className="font-serif text-2xl mb-3 text-gray-900">A beautiful space to write and reflect.</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Our clean editor helps you craft meaningful entries with ease. Focus strictly on your narrative.
            </p>
          </div>
          <div className="bg-[#FAF8F5] border border-gray-200/60 rounded-xl p-4 font-mono text-xs text-gray-700 shadow-inner">
            <div className="flex gap-2 mb-3 border-b border-gray-200 pb-2 text-gray-400">
              <span>B</span><span>I</span><span>U</span><span className="ml-auto">The Dolomites, Italy</span>
            </div>
            <p className="font-serif text-sm leading-relaxed text-gray-800">
              Woke up to mist rolling over the peaks. There&apos;s something humbling about standing in front of mountains that have been here for millions of years...
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex flex-col justify-between">
          <div className="max-w-sm mb-8">
            <h3 className="font-serif text-2xl mb-3 text-gray-900">Email to publish. Effortless.</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Send photos, videos, and notes directly to your unique email address and we&apos;ll add them to your log dynamically.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-[#FAF8F5] rounded-xl p-4 sm:p-6 border border-gray-200/60">
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 w-full sm:w-44 text-center">
              <Mail className="mx-auto text-[#BA4A29] mb-2" size={20} />
              <p className="text-[11px] text-gray-500 font-medium">To: logs@journolog.com</p>
              <div className="h-2 w-16 bg-gray-200 mx-auto mt-2 rounded" />
            </div>
            <ArrowRight className="text-gray-300 rotate-90 sm:rotate-0 flex-shrink-0" size={18} />
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-3 w-full sm:w-44 text-xs">
              <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded">Processed</span>
              <p className="mt-1 font-serif font-semibold text-gray-800">Sunset in Chiang Mai</p>
            </div>
          </div>
        </div>
      </section>

      <section id="explore" className="bg-white border-y border-gray-100 py-20 mb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-md mx-auto mb-16">
            <h2 className="font-serif text-3xl text-gray-900">A live example: Bangkok to Kyoto</h2>
            <p className="text-sm text-gray-500 mt-2">A linear travel log. No noise, just your journey.</p>
          </div>

          <div className="grid md:grid-cols-[250px_1fr] gap-8">
            <div className="space-y-12 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-200 pl-8">
              <div className="relative">
                <div className="absolute left-1.5 top-1 h-3 w-3 rounded-full bg-[#BA4A29] ring-4 ring-white" />
                <p className="text-xs font-semibold text-[#BA4A29]">May 10</p>
                <p className="font-serif font-medium text-gray-900 text-sm">Bangkok, Thailand</p>
              </div>
              <div className="relative">
                <div className="absolute left-1.5 top-1 h-3 w-3 rounded-full bg-gray-300 ring-4 ring-white" />
                <p className="text-xs font-semibold text-gray-400">May 12</p>
                <p className="font-serif font-medium text-gray-700 text-sm">Chiang Mai, Thailand</p>
              </div>
              <div className="relative">
                <div className="absolute left-1.5 top-1 h-3 w-3 rounded-full bg-gray-300 ring-4 ring-white" />
                <p className="text-xs font-semibold text-gray-400">May 16</p>
                <p className="font-serif font-medium text-gray-700 text-sm">Kyoto, Japan</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="h-48 rounded-xl overflow-hidden bg-gray-100">
                <img src="https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=600" className="w-full h-full object-cover" alt="Bangkok Boats" />
              </div>
              <div className="h-48 rounded-xl overflow-hidden bg-gray-100 col-span-1 sm:col-span-2">
                <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800" className="w-full h-full object-cover" alt="Temple Architecture" />
              </div>
              <div className="h-48 rounded-xl overflow-hidden bg-gray-100 col-span-2 sm:col-span-1">
                <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=600" className="w-full h-full object-cover" alt="Coffee and journal" />
              </div>
              <div className="h-48 rounded-xl overflow-hidden bg-gray-100">
                <img src="https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=600" className="w-full h-full object-cover" alt="Kyoto street" />
              </div>
              <div className="h-48 rounded-xl overflow-hidden bg-gray-100">
                <img src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600" className="w-full h-full object-cover" alt="Bamboo forest" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-4xl px-6 mb-24">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl text-gray-900">Simple pricing. Focus on what matters.</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="font-serif text-xl font-medium text-gray-900">Free Tier</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-serif font-bold text-gray-900">$0</span>
                <span className="text-gray-500 text-sm">/ Forever</span>
              </div>
              <ul className="mt-6 space-y-3 border-t border-gray-100 pt-6 text-sm text-gray-600">
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> Capped storage (1 GB)</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> Web editor only</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> Images up to 5MB</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> Community support</li>
              </ul>
            </div>
            <button className="mt-8 w-full border border-gray-200 text-gray-800 rounded-md py-2.5 text-sm font-medium hover:bg-gray-50 transition">
              Get Started Free
            </button>
          </div>

          <div className="bg-white border-2 border-[#BA4A29] rounded-2xl p-8 flex flex-col justify-between shadow-md relative">
            <span className="absolute -top-3 right-6 bg-[#BA4A29] text-white text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full">
              Most Popular
            </span>
            <div>
              <h3 className="font-serif text-xl font-medium text-gray-900">Premium Tier</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-serif font-bold text-gray-900">$4.99</span>
                <span className="text-gray-500 text-sm">/ month</span>
              </div>
              <p className="text-xs text-[#BA4A29] mt-1 font-medium">Billed yearly</p>
              <ul className="mt-4 space-y-3 border-t border-gray-100 pt-6 text-sm text-gray-600">
                <li className="flex items-center gap-2"><Check size={16} className="text-[#BA4A29]" /> Unlimited email-to-submitting logging</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-[#BA4A29]" /> Video uploads (up to 250MB)</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-[#BA4A29]" /> Private journals with password protection</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-[#BA4A29]" /> Priority support</li>
              </ul>
            </div>
            <button className="mt-8 w-full bg-[#BA4A29] text-white rounded-md py-2.5 text-sm font-medium hover:bg-[#a33f21] transition shadow-sm">
              Start Premium
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-[#112211] text-gray-400 py-12 text-xs">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white">Privacy</Link>
            <Link href="#" className="hover:text-white">Terms</Link>
            <Link href="#" className="hover:text-white">About</Link>
            <Link href="#" className="hover:text-white">Support</Link>
          </div>
          
          <div className="text-center md:order-none -order-1">
            <Compass className="mx-auto h-5 w-5 text-white mb-2" strokeWidth={1.5} />
            <p className="font-serif text-base text-white tracking-wide">journolog</p>
            <p className="text-[10px] text-gray-500 mt-1">Your journey. Beautifully kept.</p>
          </div>

          <div className="flex gap-4 text-sm">
            <Link href="#" className="hover:text-white"><Camera size={16} /></Link>
            <Link href="#" className="hover:text-white"><Share2 size={16} /></Link>
            <Link href="#" className="hover:text-white"><Mail size={16} /></Link>
          </div>
        </div>
        <p className="text-center text-[10px] text-gray-600 mt-8">© 2026 journolog. All rights reserved.</p>
      </footer>

    </main>
  );
}