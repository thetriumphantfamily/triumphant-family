// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA LOGIN PAGE — Student login
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { Metadata } from "next";
import Link from "next/link";
import TDALoginForm from "@/components/bible-school/TDALoginForm";

export const metadata: Metadata = {
  title: "Student Login | Triumphant Disciples Academy",
  description:
    "Login to your student portal at the Triumphant Disciples Academy. Access your materials, assignments, and more.",
};

export default function TDALoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900">
      <section className="relative pt-10 pb-14 lg:pt-14 lg:pb-20 overflow-hidden">
        <div className="relative z-10 container-custom">

          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-sm text-brand-purple-200 mb-6">
            <Link href="/" className="hover:text-brand-gold-400 transition-colors">
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
              href="/bible-school"
              className="hover:text-brand-gold-400 transition-colors"
            >
              Bible School
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
            <span className="text-brand-gold-400 font-semibold">Student Login</span>
          </nav>

          {/* Header */}
          <div className="text-center mb-10 max-w-2xl mx-auto">
            {/* Gold icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold mb-5">
              <svg
                className="w-8 h-8 lg:w-10 lg:h-10 text-brand-purple-900"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                />
              </svg>
            </div>

            {/* Badge */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
                <span className="text-white font-bold text-xs uppercase tracking-widest">
                  Student Portal
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
              Welcome{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
                Back
              </span>
            </h1>

            <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed">
              Login to access your student portal, course materials, and
              assignments.
            </p>

            <div className="flex items-center justify-center mt-4">
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
            </div>
          </div>

          {/* Login Form */}
          <TDALoginForm />

          {/* Register link */}
          <div className="text-center mt-8">
            <p className="text-brand-purple-100 text-sm">
              New student?{" "}
              <Link
                href="/bible-school/register"
                className="text-brand-gold-400 font-bold hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}