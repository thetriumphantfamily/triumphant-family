// ───────────────────────────────────────────────────────────────
// MEMBER LOGIN CLIENT — Auto-redirects if session exists
// ───────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import MemberLoginForm from "@/components/church/MemberLoginForm";

export default function MemberLoginClient() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  // ─────────────────────────────────────────────
  // AUTO-CHECK SESSION ON LOAD
  // If member is already logged in, redirect
  // ─────────────────────────────────────────────
  useEffect(() => {
    try {
      const session = localStorage.getItem("tfam_member_session");
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed && parsed.id) {
          router.replace("/member/dashboard");
          return;
        }
      }
    } catch (err) {
      // Invalid session — stay on login
    }
    setChecking(false);
  }, [router]);

  // ─────────────────────────────────────────────
  // LOADING WHILE CHECKING SESSION
  // ─────────────────────────────────────────────
  if (checking) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 flex items-center justify-center">
        <div className="text-center">
          <Image
            src="/images/logo/logo.png"
            alt="TFAM"
            width={80}
            height={80}
            unoptimized
            className="w-20 h-20 object-contain mx-auto mb-4 animate-pulse"
            priority
          />
          <p className="text-white font-heading text-sm animate-pulse">
            Loading...
          </p>
        </div>
      </main>
    );
  }

  // ─────────────────────────────────────────────
  // LOGIN PAGE UI
  // ─────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900">
      <section className="relative pt-10 pb-14 lg:pt-14 lg:pb-20 overflow-hidden">
        <div className="relative z-10 container-custom">

          {/* LOGO + BRANDING */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-col items-center gap-3">
              <Image
                src="/images/logo/logo.png"
                alt="The Triumphant Family"
                width={100}
                height={100}
                unoptimized
                className="w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-2xl"
                priority
              />
              <div className="text-center">
                <p className="font-heading font-bold text-white text-xl md:text-2xl">
                  The Triumphant Family
                </p>
                <p className="text-brand-purple-200 text-xs md:text-sm font-semibold uppercase tracking-widest">
                  The Gleam of Salvation Apostolic Ministry
                </p>
              </div>
            </div>
          </div>

          {/* HEADER */}
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
                <span className="text-white font-black text-sm uppercase tracking-widest">
                  Member Portal
                </span>
              </div>
            </div>

            <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
              Welcome Back
            </h1>

            <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed">
              Login to access your dashboard, devotionals, prayer requests, giving, and more.
            </p>

            <div className="flex items-center justify-center mt-4">
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
            </div>
          </div>

          {/* LOGIN FORM */}
          <MemberLoginForm />

          {/* REGISTER LINK */}
          <div className="text-center mt-8">
            <div className="max-w-md mx-auto p-5 rounded-2xl bg-brand-purple-950/40 border border-brand-gold-400/30">
              <p className="text-brand-purple-100 text-sm mb-3">
                Not yet a member of The Triumphant Family?
              </p>
              <Link
                href="/join-church"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-white to-gray-100 text-brand-purple-900 font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Join The Family
              </Link>
            </div>
          </div>

          {/* FOOTER TAGLINE */}
          <div className="text-center mt-8">
            <p className="text-brand-gold-400 font-heading italic text-sm md:text-base">
              Pray With Us. Triumph With Us.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}