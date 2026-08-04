// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ID CARD CLIENT – Beautiful downloadable student ID card
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";

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

  useEffect(() => { loadStudent(); }, []);

  const loadStudent = async () => {
    try {
      const session = localStorage.getItem("tda_student_session");
      if (!session) return;
      const sessionData = JSON.parse(session);
      const supabase = createClient();
      const { data } = await supabase
        .from("tda_students").select("*").eq("id", sessionData.id).single();
      if (data) setStudent(data);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const handleDownload = async () => {
    if (!cardRef.current || !student) return;
    setIsDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, backgroundColor: null, useCORS: true, logging: false,
      });
      const link = document.createElement("a");
      link.download = `TDA-ID-${student.student_id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("✅ ID Card downloaded!");
    } catch (err) { console.error(err); toast.error("Failed to download. Please try again."); }
    finally { setIsDownloading(false); }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => { window.print(); setIsPrinting(false); }, 500);
  };

  const handleShare = async () => {
    if (!cardRef.current || !student) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, { scale: 3, backgroundColor: null, useCORS: true });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `TDA-ID-${student.student_id}.png`, { type: "image/png" });
        if (navigator.share && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ title: "TDA Student ID Card", text: `${student.full_name} - ${student.student_id}`, files: [file] });
            toast.success("Shared!");
          } catch { /* cancelled */ }
        } else {
          toast.error("Sharing not supported on this device");
        }
      }, "image/png");
    } catch (err) { console.error(err); toast.error("Failed to share"); }
  };

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading your ID card..." />;
  if (!student) return null;

  const validYear = new Date().getFullYear() + 1;
  const issueDate = new Date(student.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-6">

      {/* ── Page Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-2xl text-center">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-1">
          🎴 Your Student ID Card
        </h1>
        <p className="text-brand-purple-200 text-sm">
          Download, print, or share your official TDA student ID.
        </p>
      </div>

      {/* ── ID Card ── */}
      <div className="flex justify-center">
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

            {/* Header */}
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
              {student.photo_url ? (
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

            {/* Name */}
            <div className="text-center mb-3">
              <p className="font-heading font-bold text-white text-lg leading-tight">
                {student.full_name}
              </p>
            </div>

            {/* Student ID Pill */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 shadow-gold">
                <span className="text-brand-purple-900 font-bold text-sm">{student.student_id}</span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3 flex-1">
              <div className="bg-brand-purple-950/60 rounded-xl p-2 border border-brand-gold-400/30">
                <p className="text-brand-gold-400 text-[9px] uppercase tracking-widest font-semibold">Level</p>
                <p className="text-white text-xs font-bold truncate">Level {student.level}</p>
              </div>
              <div className="bg-brand-purple-950/60 rounded-xl p-2 border border-brand-gold-400/30">
                <p className="text-brand-gold-400 text-[9px] uppercase tracking-widest font-semibold">Batch</p>
                <p className="text-white text-xs font-bold truncate">{student.batch}</p>
              </div>
              <div className="bg-brand-purple-950/60 rounded-xl p-2 border border-brand-gold-400/30 col-span-2">
                <p className="text-brand-gold-400 text-[9px] uppercase tracking-widest font-semibold">School</p>
                <p className="text-white text-xs font-bold truncate">School of {LEVEL_NAMES[student.level]}</p>
              </div>
              {student.department && (
                <div className="bg-brand-purple-950/60 rounded-xl p-2 border border-brand-gold-400/30 col-span-2">
                  <p className="text-brand-gold-400 text-[9px] uppercase tracking-widest font-semibold">Department</p>
                  <p className="text-white text-xs font-bold truncate">{student.department}</p>
                </div>
              )}
            </div>

            {/* Scripture */}
            <div className="text-center mb-2 px-2">
              <p className="text-brand-gold-400 text-xs italic font-medium leading-tight">
                &ldquo;Rightly dividing the word of truth&rdquo;
              </p>
              <p className="text-white/70 text-[9px] mt-0.5">— 2 Timothy 2:15</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-[9px] text-white/80 pt-2 border-t border-brand-gold-400/30">
              <div>
                <p className="text-brand-gold-400 font-semibold">Issued</p>
                <p>{issueDate}</p>
              </div>
              <div className="text-center">
                <p className="text-brand-gold-400 font-semibold">Authorized Signatory</p>
                <p className="text-white font-bold text-[10px] mt-0.5">Prophet Olayiwole</p>
              </div>
              <div className="text-right">
                <p className="text-brand-gold-400 font-semibold">Valid Until</p>
                <p>{validYear}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Action Buttons — full width mobile ── */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50"
        >
          {isDownloading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Downloading...
            </span>
          ) : "⬇️ Download as PNG"}
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="py-4 rounded-xl bg-brand-purple-950/60 text-white font-black border border-brand-gold-400/40 active:scale-95 transition-all disabled:opacity-50"
          >
            🖨️ Print
          </button>
          <button
            onClick={handleShare}
            className="py-4 rounded-xl bg-brand-purple-950/60 text-white font-black border border-brand-gold-400/40 active:scale-95 transition-all"
          >
            📤 Share
          </button>
        </div>
      </div>

      {/* ── Info Note ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-purple-950/80 border border-brand-gold-400/40 flex items-center justify-center flex-shrink-0 text-xl">
            💡
          </div>
          <div>
            <p className="font-black text-white mb-2">About Your ID Card</p>
            <ul className="text-brand-purple-200 text-sm space-y-1 list-disc pl-4">
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