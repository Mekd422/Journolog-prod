"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, Mail, Camera, Share2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function PrivacyPolicyClient() {
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
          Legal & Privacy
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl tracking-tight text-gray-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-[11px] text-gray-400 font-mono tracking-wider uppercase mb-10">
          Effective Date: July 9, 2026
        </p>

        <div className="space-y-8 font-serif leading-relaxed text-gray-700 text-[15px] sm:text-base">
          <p className="text-lg italic text-gray-800 border-l-2 border-[#BA4A29] pl-5 my-6 leading-relaxed">
            Welcome to journolog.com. We believe that your travel memories are sacred. Because our platform is built to make logging your journeys as effortless as sending an email, we want to be completely transparent about what data we collect, how it flows through our system, and how we protect your privacy.
          </p>

          <p>
            This policy is written in plain English, free from dense legal jargon, so you can understand exactly how our platform works.
          </p>

          <div className="bg-[#FAF8F5] border border-[#E9E4DC] rounded-lg p-6 my-8 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">
              Important: journolog is Currently in Beta
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed font-sans">
              Please note that journolog.com is currently operating in a Beta launch phase. While we take data privacy, security, and backup integrity incredibly spectacles-grade serious, the platform is provided on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo; basis. We cannot guarantee 100% server uptime, nor can we be held liable for accidental data loss or disruption during this early development optimization window. By using the platform, you acknowledge this Beta status.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-gray-900 pt-6 border-t border-gray-200">
              1. The Data We Collect (And Why)
            </h2>
            <p>
              To power your travel logs and map your journeys automatically, we process a few key pieces of information:
            </p>
            <ul className="list-disc pl-6 space-y-3 font-sans text-sm text-gray-600">
              <li>
                <strong className="text-gray-900 font-serif text-base">Account Identity:</strong> Your username, registration email address, profile photo, and bio.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">Verified Sender Data:</strong> We link your account to your registered email address(es). Our system will only accept email-to-publish submissions sent from these verified addresses to prevent spammers from hijacking your timeline.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">Your Content:</strong> The narratives you write, the images you upload, and the video snapshots you share.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">Automated Location & Time Data (EXIF):</strong> When you upload images (via the web dashboard or email), our system extracts the embedded time and GPS coordinates. We use this data strictly to automatically place your memories on your route map and timeline.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">Optimized Storage:</strong> To protect our server infrastructure, all uploaded images are automatically stripped of bloated camera background data, resized to standard web maximums, and converted into lightweight <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-xs">.webp</code> files.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-gray-900 pt-6 border-t border-gray-200">
              2. Your Privacy Choices: Public vs. Private
            </h2>
            <p>
              You are in complete control of who sees your travel journals.
            </p>
            <ul className="list-disc pl-6 space-y-3 font-sans text-sm text-gray-600">
              <li>
                <strong className="text-gray-900 font-serif text-base">Public Journeys:</strong> These are open to the internet. Anyone with the link can view your timeline, look at your maps, and leave emoji reactions or comments.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">Private Journeys:</strong> These are kept private to your account. Visitors cannot view any text, photos, videos, or map coordinates.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-gray-900 pt-6 border-t border-gray-200">
              3. Content Monitoring & Our AI Guardrail
            </h2>
            <p>
              We respect your personal space and have no interest in snooping through your adventures.
            </p>
            <ul className="list-disc pl-6 space-y-3 font-sans text-sm text-gray-600">
              <li>
                <strong className="text-gray-900 font-serif text-base">No Manual Monitoring:</strong> We do not read, monitor, or manually browse your private, unpublished Journeys. Your private trips are entirely your business.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">Automated AI Safety Screening:</strong> To protect our platform from being used for illegal or malicious purposes, we reserve the right to use automated AI safety screening tools to scan incoming content.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">The Trigger Rule:</strong> If an automated safety scan trips a severe policy trigger (such as detecting illegal activity, hate speech, or malicious software code), the system flags the entry for manual review by our team. If a violation is confirmed, we reserve the right to suspend the account.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-gray-900 pt-6 border-t border-gray-200">
              4. Account Tiers & Advertising: Voyager vs. Navigator
            </h2>
            <p>
              How we fund journolog depends entirely on the tier you choose:
            </p>
            <div className="space-y-4 mt-2">
              <div className="border-l-4 border-[#BA4A29]/40 pl-4">
                <h4 className="font-serif font-bold text-gray-900 text-lg">Voyager (Free Tier)</h4>
                <p className="text-sm text-gray-600 mt-1 font-sans">
                  To keep the basic version of journolog free for everyone, Voyager accounts may be supported by third-party advertisements in the future. This means we reserve the right to run contextual ads on public Voyager journal pages and deploy standard advertising tracking cookies within those specific views down the road.
                </p>
              </div>
              <div className="border-l-4 border-[#BA4A29] pl-4">
                <h4 className="font-serif font-bold text-gray-900 text-lg">Navigator (Paid Tier)</h4>
                <p className="text-sm text-gray-600 mt-1 font-sans">
                  Navigator accounts are—and will always remain—100% ad-free. If you are a paid Navigator, no advertisement tracking scripts, third-party marketing networks, or digital ads will ever touch your profile, dashboard, or your public and private journal feeds.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-gray-900 pt-6 border-t border-gray-200">
              5. Our Third-Party Infrastructure Partners
            </h2>
            <p>
              While your primary account data is securely hosted locally on our private server architecture, we utilize a few trusted, industry-standard services to power our core features:
            </p>
            <ul className="list-disc pl-6 space-y-3 font-sans text-sm text-gray-600">
              <li>
                <strong className="text-gray-900 font-serif text-base">Postmark / AWS SES:</strong> Handles the inbound email gateway that intercepts the photos and text you email from the road.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">Mapbox / Leaflet:</strong> Renders the minimalist, interactive geographic maps on your public and private timelines.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">Stripe:</strong> Securely handles all paid Navigator premium subscriptions. journolog never sees, handles, or stores your credit card numbers.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-gray-900 pt-6 border-t border-gray-200">
              6. Managing Your Data
            </h2>
            <p>
              Your data belongs to you. If you ever decide to leave journolog, you can delete your account from your dashboard settings. Doing so permanently clears your profile, your journals, and your media attachments from our active database.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-gray-900 pt-6 border-t border-gray-200">
              7. GDPR (General Data Protection Regulation)
            </h2>
            <p>
              If you are accessing journolog.com from within the European Economic Area (EEA), you are protected by the General Data Protection Regulation (GDPR). journolog is the Data Controller for your personal account information.
            </p>

            <h3 className="font-serif text-lg font-bold text-gray-900 pt-2">Legal Bases for Processing Your Data</h3>
            <p>
              Under GDPR, we only process your personal data when we have a valid legal grounding:
            </p>
            <ul className="list-disc pl-6 space-y-3 font-sans text-sm text-gray-600">
              <li>
                <strong className="text-gray-900 font-serif text-base">Contractual Necessity:</strong> We process your login credentials, email address, and billing data to create your account, manage your Navigator subscription, and deliver our platform services.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">Consent:</strong> When you upload travel entries, photos, videos, or allow our system to extract EXIF location metadata for maps, you explicitly give us consent to host and display that specific data. You can withdraw this consent at any time by deleting the post or your entire account.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">Legitimate Interests:</strong> We log system errors, monitor inbound email sender verification headers, and run privacy-safe automated safety scans to ensure network security, prevent system spam, and protect our server infrastructure from abuse.
              </li>
            </ul>

            <h3 className="font-serif text-lg font-bold text-gray-900 pt-2">International Data Transfers</h3>
            <p>
              journolog is domiciled in the United States. The travel records, photos, and metadata you provide will be transferred from your location, processed, and stored on our secure private server infrastructure located in the United States (or our fallback VPS data nodes). By using the service or emailing updates to your log, you acknowledge and consent to this international transfer. We employ defensive data encryption (both in transit and at rest) to safeguard your files.
            </p>

            <h3 className="font-serif text-lg font-bold text-gray-900 pt-2">Your Explicit GDPR Data Rights</h3>
            <p>
              You hold absolute control over your digital footprint on journolog. You may exercise these rights at any time by contacting us at{" "}
              <a href="mailto:privacy@journolog.com" className="text-[#BA4A29] underline hover:text-[#a33f21] font-sans">
                privacy@journolog.com
              </a>:
            </p>
            <ul className="list-disc pl-6 space-y-3 font-sans text-sm text-gray-600">
              <li>
                <strong className="text-gray-900 font-serif text-base">The Right to Access & Portability:</strong> You have the right to request a digital copy of all data we hold about you. We will provide this file to you in a standard structured JSON and media zip format.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">The Right to Rectification:</strong> You can modify, edit, or update your bio, email, or journal entries at any time via your Creator Dashboard.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">The Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> When you delete an entry, photo, or choose to delete your complete account, your records are permanently purged from our active PocketBase database.
              </li>
              <li>
                <strong className="text-gray-900 font-serif text-base">The Right to Restriction or Objection:</strong> You may object to the future processing of your data, or restrict our system from parsing photo EXIF location metadata by turning off mapping features in your settings.
              </li>
            </ul>
          </section>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-[#1C201C] text-gray-400 py-16 text-xs border-t border-[#2F342F] w-full">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex gap-6 font-semibold uppercase tracking-widest text-[10px]">
            <Link href="/policy" className="text-white hover:text-white transition-colors">Privacy</Link>
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
