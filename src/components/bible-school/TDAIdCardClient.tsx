// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ID CARD CLIENT — Beautiful downloadable student ID card
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface Student {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  photo_url: string | null;
  level: string;
  department: string | null;
  batch: string;
  created_at: string;
}

const LEVEL_NAMES: Record<string, string> = {
  "100": "Triumphant Christian Living",
  "200": "Nurturing",
  "300": "Church Administration",
  "400": "Spiritual Leadership & Ministry",
};

export default function TDAIdCardClient() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    loadStudent();
  }, []);

  const loadStudent = async () => {
    try {
      const session = localStorage.getItem("tda_student_session");
      if (!session) return;

      const sessionData = JSON.parse(session);
      const supabase = createClient();

      const { data } = await supabase
        .from("tda_students")
        .select("*")
        .eq("id", sessionData.id)
        .single();

      if (data) {
        setStudent(data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Load error:", err);
      setLoading(false);
    }
  };

  // ━━━ Download as PNG ━━━
  const handleDownload = async () => {
    if (!cardRef.current || !student) return;

    setIsDownloading(true);

    try {
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `TDA-ID-${student.student_id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast.success("✅ ID Card downloaded!");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to download. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // ━━━ Print ID Card ━━━
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  // ━━━ Share (mobile) ━━━
  const handleShare = async () => {
    if (!cardRef.current || !student) return;

    try {
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], `TDA-ID-${student.student_id}.png`, {
          type: "image/png",
        });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: "TDA Student ID Card",
              text: `${student.full_name} - ${student.student_id}`,
              files: [file],
            });
            toast.success("Shared!");
          } catch (err) {
            console.log("Share cancelled");
          }
        } else {
          toast.error("Sharing not supported on this device");
        }
      }, "image/png");
    } catch (err) {
      console.error("Share error:", err);
      toast.error("Failed to share");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Loading ID card...</p>
      </div>
    );
  }

  if (!student) return null;

  const validYear = new Date().getFullYear() + 1;
  const issueDate = new Date(student.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="mb-6 text-center">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">
          🎴 Your Student ID Card
        </h1>
        <p className="text-gray-600 text-sm">
          Download, print, or share your official TDA student ID
        </p>
      </div>

      {/* ID Card */}
      <div className="flex justify-center mb-8">
        <div
          ref={cardRef}
          className="relative w-full max-w-md bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl overflow-hidden shadow-2xl"
          style={{ aspectRatio: "1 / 1.586" }}
        >
          {/* Gold top bar */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

          {/* Gold bottom bar */}
          <div className="absolute bottom-0 inset-x-0 h-2 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

          <div className="relative z-10 p-6 flex flex-col h-full">
            {/* Header — Bigger Logo + Ministry Name */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image
                src="/images/logo/logo.png"
                alt="TFAM Logo"
                width={64}
                height={64}
                unoptimized
                className="w-16 h-16 object-contain"
              />
              <div className="text-center">
                <p className="font-heading font-bold text-white text-sm leading-tight">
                  The Triumphant Family
                </p>
                <p className="text-brand-gold-400 text-[10px] font-semibold uppercase tracking-widest">
                  Apostolic Ministry
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-0.5 bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent mb-3" />

            {/* School Name */}
            <div className="text-center mb-4">
              <p className="font-heading font-bold text-brand-gold-400 text-base uppercase tracking-widest">
                Triumphant Disciples Academy
              </p>
              <p className="text-white text-xs mt-1">Official Student ID</p>
            </div>

            {/* Photo */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                {student.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={student.photo_url}
                    alt={student.full_name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-brand-gold-400 shadow-lg"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-brand-gold-400 flex items-center justify-center text-brand-purple-900 font-bold text-4xl border-4 border-brand-gold-400 shadow-lg">
                    {student.full_name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Name */}
            <div className="text-center mb-3">
              <p className="font-heading font-bold text-white text-lg leading-tight">
                {student.full_name}
              </p>
            </div>

            {/* Student ID Pill */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 shadow-gold">
                <span className="text-brand-purple-900 font-bold text-sm">
                  {student.student_id}
                </span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3 flex-1">
              <div className="bg-brand-purple-950/60 rounded-xl p-2 border border-brand-gold-400/30">
                <p className="text-brand-gold-400 text-[9px] uppercase tracking-widest font-semibold">
                  Level
                </p>
                <p className="text-white text-xs font-bold truncate">
                  Level {student.level}
                </p>
              </div>
              <div className="bg-brand-purple-950/60 rounded-xl p-2 border border-brand-gold-400/30">
                <p className="text-brand-gold-400 text-[9px] uppercase tracking-widest font-semibold">
                  Batch
                </p>
                <p className="text-white text-xs font-bold truncate">
                  {student.batch}
                </p>
              </div>
              <div className="bg-brand-purple-950/60 rounded-xl p-2 border border-brand-gold-400/30 col-span-2">
                <p className="text-brand-gold-400 text-[9px] uppercase tracking-widest font-semibold">
                  School
                </p>
                <p className="text-white text-xs font-bold truncate">
                  School of {LEVEL_NAMES[student.level]}
                </p>
              </div>
              {student.department && (
                <div className="bg-brand-purple-950/60 rounded-xl p-2 border border-brand-gold-400/30 col-span-2">
                  <p className="text-brand-gold-400 text-[9px] uppercase tracking-widest font-semibold">
                    Department
                  </p>
                  <p className="text-white text-xs font-bold truncate">
                    {student.department}
                  </p>
                </div>
              )}
            </div>

            {/* Scripture — CLEAN READABLE ITALIC */}
            <div className="text-center mb-2 px-2">
              <p className="text-brand-gold-400 text-xs italic font-medium leading-tight">
                &ldquo;Rightly dividing the word of truth&rdquo;
              </p>
              <p className="text-white/70 text-[9px] mt-0.5">
                — 2 Timothy 2:15
              </p>
            </div>

            {/* Footer — CLEAN BOLD FOR SIGNATORY */}
            <div className="flex items-center justify-between text-[9px] text-white/80 pt-2 border-t border-brand-gold-400/30">
              <div>
                <p className="text-brand-gold-400 font-semibold">Issued</p>
                <p>{issueDate}</p>
              </div>
              <div className="text-center">
                <p className="text-brand-gold-400 font-semibold">
                  Authorized Signatory
                </p>
                <p className="text-white font-bold text-[10px] mt-0.5">
                  Prophet Olayiwole
                </p>
              </div>
              <div className="text-right">
                <p className="text-brand-gold-400 font-semibold">Valid Until</p>
                <p>{validYear}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <>
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Downloading...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              Download as PNG
            </>
          )}
        </button>

        <button
          onClick={handlePrint}
          disabled={isPrinting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-purple-600 hover:bg-brand-purple-700 text-white font-bold shadow-md transition-all disabled:opacity-50"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
            />
          </svg>
          Print
        </button>

        <button
          onClick={handleShare}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-gray-200 text-gray-700 font-bold hover:border-brand-gold-400 transition-all"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
            />
          </svg>
          Share
        </button>
      </div>

      {/* Info Note */}
      <div className="bg-brand-gold-50 border-2 border-brand-gold-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0 text-brand-purple-900">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
              />
            </svg>
          </div>
          <div>
            <p className="font-bold text-brand-purple-900 mb-1">
              💡 About Your ID Card
            </p>
            <ul className="text-brand-purple-700 text-sm space-y-1 list-disc pl-4">
              <li>Your official identification as a TDA student</li>
              <li>Present when attending classes and events</li>
              <li>Download and save to your phone gallery</li>
              <li>Print a physical copy if needed</li>
              <li>Valid throughout your academic year</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}