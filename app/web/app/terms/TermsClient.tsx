"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, Mail, Camera, Share2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function TermsOfUseClient() {
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
          Agreement
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl tracking-tight text-gray-900 mb-2">
          Terms of Use
        </h1>
        <p className="text-[11px] text-gray-400 font-mono tracking-wider uppercase mb-10">
          Effective Date: July 9, 2026
        </p>

        <div className="space-y-8 font-serif leading-relaxed text-gray-700 text-[15px] sm:text-base">
          <p className="text-lg italic text-gray-800 border-l-2 border-[#BA4A29] pl-5 my-6 leading-relaxed">
            Welcome to journolog.com. These Terms of Use govern your access to and use of our travel journal platform. Our mission is to provide a quiet, elegant space where your travel memories are beautifully kept and effortlessly shared.
          </p>

          <p>
            By creating an account, publishing a journal, or visiting a private timeline, you agree to these terms. Please read them carefully.
          </p>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-gray-900 pt-6 border-t border-gray-200">
              1. The Beta Phase Disclaimer
            </h2>
            <p className="text-sm font-sans text-gray-600 bg-gray-50 border border-gray-200 p-4 rounded-md">
              Journolog is currently operating in a Beta launch phase. The platform is provided to you on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo; basis. While we build defensively and take data integrity incredibly seriously, we do not guarantee 100% server uptime, nor can we be held legally or financially liable for any data loss, service disruptions, or file corruption that may occur during this early optimization phase.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-gray-900 pt-6 border-t border-gray-200">
              2. Account Eligibility & Security
            </h2>
            <ul className="list-disc pl-6 space-y-3 font-sans text-sm text-gray-600">
              <li>
                <strong className="text-gray-900 font-serif text-base">Age Requirement:</strong> You must be at least 13 years old (or the minimum legal age in your country to consent to data processing) to create an account on journolog.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">Credentials & Access Keys:</strong> You are entirely responsible for keeping your account login credentials secure. journolog cannot be held responsible for unauthorized access resulting from compromised credentials.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-gray-900 pt-6 border-t border-gray-200">
              3. Intellectual Property: You Own It, We Host It
            </h2>
            <ul className="list-disc pl-6 space-y-3 font-sans text-sm text-gray-600">
              <li>
                <strong className="text-gray-900 font-serif text-base">Your Content Ownership:</strong> You retain 100% ownership of the text, photography, videos, and travel logs you upload to our platform. We claim zero ownership over your memories.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">Our Hosting License:</strong> To display your journals beautifully on the web, you grant journolog a worldwide, royalty-free, non-exclusive license to host, cache, copy, distribute, transmit, and stream your content.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">The Optimization Rule:</strong> This license explicitly permits our backend server to modify your files for performance reasons—such as stripping bloated camera metadata, resizing files to default pixel maximums, and converting images to lightweight <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-xs">.webp</code> files at upload.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">Copyright Infringement:</strong> You must own or have the explicit legal right to use the photos, videos, and text you post. Hosting pirated media or stolen professional photography is strictly forbidden.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-gray-900 pt-6 border-t border-gray-200">
              4. Subscriptions, Annual Billing, & Downgrades
            </h2>
            <p>
              We operate under a simple two-tier system: Voyager (Free Account) and Navigator (Paid Premium Account).
            </p>
            <ul className="list-disc pl-6 space-y-3 font-sans text-sm text-gray-600">
              <li>
                <strong className="text-gray-900 font-serif text-base">Annual Navigator Billing:</strong> Navigator accounts are billed on an annual subscription basis. Your plan will automatically renew on your annual anniversary date unless you explicitly cancel your subscription before the renewal date hits.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">The Downgrade Storage Rule:</strong> If you cancel your Navigator subscription and drop back down to the free Voyager tier, your storage cap will shrink to our standard free limit. If your existing data profile (such as heavy video uploads) exceeds the free storage cap, you will receive a notification and a 30-day grace period to download your archives. After 30 days, we reserve the right to freeze or permanently delete files that exceed the free tier&apos;s limits.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-gray-900 pt-6 border-t border-gray-200">
              5. Content Rules & Public Decency Standards
            </h2>
            <p>
              To maintain the editorial, peaceful vibe of journolog, we enforce clear boundaries regarding what can be shared depending on your journal&apos;s visibility settings:
            </p>
            <ul className="list-disc pl-6 space-y-3 font-sans text-sm text-gray-600">
              <li>
                <strong className="text-gray-900 font-serif text-base">The Absolute Banned List:</strong> You may not host or share any content that is explicitly illegal, promotes hate speech, facilitates harassment, depicts extreme violence, or operates scams. This material is completely banned across all tiers and visibility settings.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">The Public Decency Rule (Public Journeys):</strong> Public journals are open to general audiences of all ages. Therefore, nudity, highly explicit adult imagery, or sexually suggestive themes are strictly prohibited on Public Journeys.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">The Private Exception:</strong> Tasteful artistic nudity or intimate personal moments are permitted only if they are kept strictly on Private Journeys. However, explicit commercial pornography is banned platform-wide across both tiers to protect our server network&apos;s reputation.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-gray-900 pt-6 border-t border-gray-200">
              6. Platform Abuse & Server Safety
            </h2>
            <ul className="list-disc pl-6 space-y-3 font-sans text-sm text-gray-600">
              <li>
                <strong className="text-gray-900 font-serif text-base">Not a Cloud Drive:</strong> journolog is an interactive storytelling canvas, not a generic cloud storage repository. Using our email-to-post gateway or dashboard uploaders to write automated scripts, host software files, or dump thousands of non-journal attachments to exploit our storage is a breach of service.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">No Commercial Exploitation:</strong> Free Voyager accounts cannot be used to run automated spam networks, drop SEO link farms, or host multi-level marketing campaigns.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-gray-900 pt-6 border-t border-gray-200">
              7. The Escalation Ladder (Enforcement)
            </h2>
            <p>
              If our automated AI safety filters flag an account, or if a user violates these terms, we deploy a graduated enforcement response based on the severity of the breach:
            </p>
            <ul className="list-disc pl-6 space-y-3 font-sans text-sm text-gray-600">
              <li>
                <strong className="text-gray-900 font-serif text-base">Force to Draft:</strong> For public decency or copyright violations on a public timeline, our system will automatically flip the flagged post from published to draft. This immediately masks the content from public view, and you will receive an email explaining how to fix or appeal it.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">Account Suspension:</strong> Repeatedly ignoring layout guidelines or safety warnings will result in a temporary freeze on your login credentials.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">The Blacklist (Permanent Termination):</strong> Severe violations (such as hosting illegal material or launching spam bots) will result in immediate account deletion without a warning or refund. To protect the platform, our backend will permanently blacklist the user&apos;s registration email, block their incoming email source routing, and ban their IP profile from our servers.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-gray-900 pt-6 border-t border-gray-200">
              8. Liability Disclaimers
            </h2>
            <ul className="list-disc pl-6 space-y-3 font-sans text-sm text-gray-600">
              <li>
                <strong className="text-gray-900 font-serif text-base">Maps Are For Storytelling Only:</strong> Our automated interactive map rendering is built purely for illustrative enjoyment and aesthetic storytelling. Our maps are not professional navigation tools. journolog cannot be held liable if you get lost in the wilderness, miss a transport link, or encounter travel hazards due to a mapping discrepancy.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">Third-Party Pipelines:</strong> journolog relies on third-party service pipelines to function (such as Postmark for inbound email processing, PocketBase for database hosting, and Mapbox for maps). We are not legally responsible for data delays, email drops, or display bugs caused by an outage at these external providers.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-gray-900 pt-6 border-t border-gray-200">
              9. Governing Law & Domicile
            </h2>
            <p>
              journolog.com is operated by an entity legally domiciled in the State of Wyoming, USA. These Terms of Use, and any legal disputes or claims arising out of your use of our service, will be governed by and construed in accordance with the laws of the State of Wyoming, without regard to its conflict of law principles. Any legal actions must be filed in the courts located within Wyoming, USA.
            </p>
          </section>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-[#1C201C] text-gray-400 py-16 text-xs border-t border-[#2F342F] w-full">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex gap-6 font-semibold uppercase tracking-widest text-[10px]">
            <Link href="/policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-white hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">About</Link>
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
