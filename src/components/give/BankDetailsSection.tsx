// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BANK DETAILS — Clean purple + gold (no blurs)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function BankDetailsSection() {
  const [copied, setCopied] = useState(false);
  const accountNumber = "1027481531";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      toast.success("Account number copied!", {
        style: { background: "#6B1F8A", color: "#fff", border: "1px solid #FFC72C" },
        iconTheme: { primary: "#FFC72C", secondary: "#6B1F8A" },
      });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Could not copy. Please copy manually.");
    }
  };

  return (
    <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">
      <div className="relative z-10 container-custom">

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              Bank Transfer
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
            Give Via{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
              Bank Transfer
            </span>
          </h2>
          <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed">
            Make a direct transfer to our ministry account below. Every seed
            you sow advances the Kingdom of God.
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
          </div>
        </div>

        {/* Bank Card */}
        <div className="max-w-2xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40">

            {/* Gold top bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            <div className="relative z-10 p-8 md:p-10">

              {/* Header */}
              <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center">
                    <svg className="w-6 h-6 text-brand-purple-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                    </svg>
                  </div>
                  <span className="text-white font-heading font-bold text-xl">
                    UBA
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-gold-400/40 bg-brand-gold-400/10">
                  <span className="text-brand-gold-300 text-xs font-semibold tracking-widest uppercase">
                    United Bank for Africa
                  </span>
                </div>
              </div>

              {/* Account Number */}
              <div className="mb-8">
                <p className="text-brand-purple-200 text-xs uppercase tracking-widest mb-3 font-semibold">
                  Account Number
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-white text-3xl md:text-4xl font-heading font-bold tracking-[0.2em]">
                    {accountNumber}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 text-sm font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-brand-gold-400/30 mb-6" />

              {/* Account Name + Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-brand-purple-200 text-xs uppercase tracking-widest mb-2 font-semibold">
                    Account Name
                  </p>
                  <p className="text-white font-bold text-sm leading-snug">
                    THE TRIUMPHANT FAMILY OF THE GLEAM OF SALVATION A.P
                  </p>
                </div>
                <div>
                  <p className="text-brand-purple-200 text-xs uppercase tracking-widest mb-2 font-semibold">
                    Currency
                  </p>
                  <p className="text-brand-gold-400 font-bold">
                    Nigerian Naira (NGN)
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-brand-gold-400/30 mb-6" />

              {/* Follow-up note */}
              <div className="flex items-start gap-3 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-2xl p-4 border border-brand-gold-400/30">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-brand-purple-900" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                </div>
                <div>
                  <p className="text-brand-gold-300 text-sm font-bold mb-1">
                    After your transfer:
                  </p>
                  <p className="text-brand-purple-100 text-sm leading-relaxed">
                    Please send your name and transfer details via WhatsApp to{" "}
                    <a
                      href="https://wa.me/2348022620704"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-gold-400 font-bold hover:text-brand-gold-300 hover:underline transition-colors"
                    >
                      +234 802 262 0704
                    </a>{" "}
                    so we can acknowledge your giving. God bless you!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}