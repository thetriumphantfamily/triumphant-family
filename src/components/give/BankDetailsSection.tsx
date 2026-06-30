"use client";

import { useState } from "react";
import { Copy, CheckCircle, Building2 } from "lucide-react";
import toast from "react-hot-toast";

export default function BankDetailsSection() {
  const [copied, setCopied] = useState(false);

  const accountNumber = "1027481531";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      toast.success("Account number copied!", {
        style: {
          background: "#6B1F8A",
          color: "#fff",
          border: "1px solid #FFC72C",
        },
        iconTheme: {
          primary: "#FFC72C",
          secondary: "#6B1F8A",
        },
      });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Could not copy. Please copy manually.");
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-custom">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-brand-purple-100 text-brand-purple-600 text-sm font-bold tracking-widest uppercase mb-4">
            Bank Transfer
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
            Give Via{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
              Bank Transfer
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-500 text-lg">
            Make a direct transfer to our ministry account below. Every seed
            you sow advances the Kingdom of God.
          </p>
        </div>

        {/* Bank Card */}
        <div className="max-w-2xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            {/* Card Header */}
            <div className="bg-gradient-to-br from-violet-900 via-purple-800 to-purple-900 px-8 pt-8 pb-16">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-bold text-lg">
                    UBA
                  </span>
                </div>
                <span className="text-brand-gold-400 text-sm font-bold tracking-widest uppercase">
                  United Bank for Africa
                </span>
              </div>

              {/* Account Number */}
              <div className="mb-4">
                <p className="text-purple-200/60 text-xs uppercase tracking-widest mb-2">
                  Account Number
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-white text-3xl font-bold tracking-[0.2em]">
                    {accountNumber}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-brand-gold-400/20 border border-white/20 hover:border-brand-gold-400/40 text-white text-sm font-medium transition-all duration-200"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-brand-gold-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="bg-white px-8 py-6 -mt-8 rounded-t-3xl relative z-10">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
                    Account Name
                  </p>
                  <p className="text-gray-900 font-bold text-sm leading-snug">
                    THE TRIUMPHANT FAMILY OF THE GLEAM OF SALVATION A.P
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
                    Currency
                  </p>
                  <p className="text-gray-900 font-bold">Nigerian Naira (NGN)</p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 my-6" />

              {/* Note */}
              <div className="flex items-start gap-3 bg-brand-gold-50 rounded-xl p-4 border border-brand-gold-200">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="text-gray-700 text-sm font-medium mb-1">
                    After your transfer:
                  </p>
                  <p className="text-gray-500 text-sm">
                    Please send your name and transfer details via WhatsApp to{" "}
                    <a
                      href="https://wa.me/2348022620704"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-purple-600 font-bold hover:underline"
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