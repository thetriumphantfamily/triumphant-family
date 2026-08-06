// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// JOIN CHURCH PAGE — Membership registration (tight spacing)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import MemberRegisterForm from "@/components/church/MemberRegisterForm";

export const metadata: Metadata = {
  title: "Become a Member | The Triumphant Family",
  description:
    "Join The Triumphant Family Ministry. Register as a member and become part of our growing family of believers.",
};

export default function JoinChurchPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900">
      <section className="relative pt-8 pb-10 lg:pt-10 lg:pb-12 overflow-hidden">
        <div className="relative z-10 container-custom">

          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-sm text-brand-purple-200 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <Link
              href="/membership"
              className="hover:text-white transition-colors"
            >
              Membership
            </Link>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-semibold">Register</span>
          </nav>

          {/* LOGO */}
          <div className="flex justify-center mb-6">
            <Link href="/" className="flex flex-col items-center gap-3">
              <Image
                src="/images/logo/logo.png"
                alt="The Triumphant Family"
                width={90}
                height={90}
                unoptimized
                className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-2xl"
                priority
              />
              <div className="text-center">
                <p className="font-heading font-bold text-white text-lg md:text-xl">
                  The Triumphant Family
                </p>
                <p className="text-brand-purple-200 text-xs md:text-sm font-semibold uppercase tracking-widest">
                  The Gleam of Salvation Apostolic Ministry
                </p>
              </div>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-6 max-w-2xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
                <span className="text-white font-black text-sm uppercase tracking-widest">
                  Church Membership
                </span>
              </div>
            </div>

            {/* Heading — WHITE gradient */}
            <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
              Become a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
                Member
              </span>
            </h1>

            <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed">
              Join The Triumphant Family and become part of our growing
              community of believers. Fill in your details below to register.
            </p>

            <div className="flex items-center justify-center mt-4">
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
            </div>
          </div>

          {/* Registration Form */}
          <MemberRegisterForm />

          {/* Login link */}
          <div className="text-center mt-6">
            <p className="text-brand-purple-100 text-sm">
              Already a member?{" "}
              <Link
                href="/member/login"
                className="text-white font-black hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}