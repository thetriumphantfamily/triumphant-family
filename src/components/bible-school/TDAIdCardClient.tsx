// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ID CARD CLIENT – Clean readable downloadable student ID card
// html-to-image export engine + refined compact fields
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { toBlob, toPng } from "html-to-image";
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

async function waitForImages(container: HTMLElement) {
  const images = Array.from(container.querySelectorAll("img"));

  await Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();

      return new Promise<void>((resolve) => {
        const done = () => resolve();
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      });
    })
  );
}

export default function TDAIdCardClient() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

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

  const exportCardAsPng = async (): Promise<string> => {
    if (!cardRef.current) throw new Error("Card not ready");

    if ("fonts" in document) {
      await (document as Document & { fonts: FontFaceSet }).fonts.ready;
    }

    await waitForImages(cardRef.current);

    return await toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 3,
      backgroundColor: "#4a176a",
      skipFonts: false,
    });
  };

  const exportCardAsBlob = async (): Promise<Blob> => {
    if (!cardRef.current) throw new Error("Card not ready");

    if ("fonts" in document) {
      await (document as Document & { fonts: FontFaceSet }).fonts.ready;
    }

    await waitForImages(cardRef.current);

    const blob = await toBlob(cardRef.current, {
      cacheBust: true,
      pixelRatio: 3,
      backgroundColor: "#4a176a",
      skipFonts: false,
    });

    if (!blob) throw new Error("Blob generation failed");
    return blob;
  };

  const handleDownload = async () => {
    if (!student) return;

    setIsDownloading(true);
    try {
      const dataUrl = await exportCardAsPng();
      const link = document.createElement("a");
      link.download = `TDA-ID-${student.student_id}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("✅ ID Card downloaded!");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to download. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  };

  const handleShare = async () => {
    if (!student) return;

    setIsSharing(true);
    try {
      const blob = await exportCardAsBlob();
      const file = new File([blob], `TDA-ID-${student.student_id}.png`, {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "TDA Student ID Card",
          text: `${student.full_name} - ${student.student_id}`,
          files: [file],
        });
        toast.success("Shared!");
      } else {
        toast.error("Sharing not supported on this device");
      }
    } catch (err) {
      console.error("Share error:", err);
      toast.error("Failed to share");
    } finally {
      setIsSharing(false);
    }
  };

  if (loading) return <LoadingScreen message="Loading your ID card..." />;
  if (!student) return null;

  const validYear = new Date().getFullYear() + 1;
  const issueDate = new Date(student.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
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
          className="relative w-full max-w-[360px] rounded-[28px] overflow-hidden shadow-2xl border-2 border-brand-gold-400/40 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900"
          style={{ aspectRatio: "1 / 1.586" }}
        >
          {/* Top/Bottom Gold Bars */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="absolute bottom-0 inset-x-0 h-2 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

          <div className="relative z-10 h-full px-4 pt-4 pb-3 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-2">
              <img
                src="/images/logo/logo.png"
                alt="TFAM Logo"
                width={48}
                height={48}
                className="w-12 h-12 object-contain flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="font-heading font-bold text-white text-[13px] leading-tight">
                  The Triumphant Family
                </p>
                <p className="text-brand-purple-200 text-[9px] font-semibold uppercase tracking-widest leading-tight">
                  Apostolic Ministry
                </p>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent mb-2" />

            {/* School name */}
            <div className="text-center mb-2">
              <p className="font-heading font-bold text-white text-[12px] uppercase tracking-[0.18em] leading-tight">
                Triumphant Disciples Academy
              </p>
              <p className="text-brand-purple-200 text-[9px] mt-0.5 font-semibold uppercase tracking-widest leading-tight">
                Official Student ID
              </p>
            </div>

            {/* Photo */}
            <div className="flex justify-center mb-2">
              {student.photo_url ? (
                <img
                  src={student.photo_url}
                  alt={student.full_name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-brand-purple-900 font-black text-3xl border-4 border-white shadow-xl">
                  {student.full_name.charAt(0)}
                </div>
              )}
            </div>

            {/* Name */}
            <div className="text-center mb-2">
              <p className="font-heading font-bold text-white text-[16px] leading-tight px-2">
                {student.full_name}
              </p>
            </div>

            {/* Student ID pill */}
            <div className="flex justify-center mb-2">
              <div className="h-9 min-w-[176px] px-4 rounded-full bg-white border-2 border-brand-gold-400 shadow-lg flex items-center justify-center">
                <span className="text-brand-purple-900 font-black text-[12px] leading-none">
                  {student.student_id}
                </span>
              </div>
            </div>

            {/* Info Blocks — reduced size */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="rounded-xl bg-white px-2.5 pt-1.5 pb-2 shadow-sm min-h-[54px] flex flex-col justify-start overflow-hidden">
                <p className="text-[7px] uppercase tracking-widest font-black text-brand-purple-900/70 mb-1 leading-none">
                  Level
                </p>
                <p className="text-brand-purple-900 text-[10px] font-black leading-[1.2] break-words">
                  Level {student.level}
                </p>
              </div>

              <div className="rounded-xl bg-white px-2.5 pt-1.5 pb-2 shadow-sm min-h-[54px] flex flex-col justify-start overflow-hidden">
                <p className="text-[7px] uppercase tracking-widest font-black text-brand-purple-900/70 mb-1 leading-none">
                  Batch
                </p>
                <p className="text-brand-purple-900 text-[10px] font-black leading-[1.2] break-words">
                  {student.batch}
                </p>
              </div>

              <div className="rounded-xl bg-white px-2.5 pt-1.5 pb-2 shadow-sm col-span-2 min-h-[58px] flex flex-col justify-start overflow-hidden">
                <p className="text-[7px] uppercase tracking-widest font-black text-brand-purple-900/70 mb-1 leading-none">
                  School
                </p>
                <p className="text-brand-purple-900 text-[9px] font-black leading-[1.25] break-words">
                  School of {LEVEL_NAMES[student.level]}
                </p>
              </div>

              {student.department && (
                <div className="rounded-xl bg-white px-2.5 pt-1.5 pb-2 shadow-sm col-span-2 min-h-[58px] flex flex-col justify-start overflow-hidden">
                  <p className="text-[7px] uppercase tracking-widest font-black text-brand-purple-900/70 mb-1 leading-none">
                    Department
                  </p>
                  <p className="text-brand-purple-900 text-[9px] font-black leading-[1.25] break-words">
                    {student.department}
                  </p>
                </div>
              )}
            </div>

            {/* Scripture */}
            <div className="text-center px-2 mb-1">
              <p className="text-white text-[10px] italic leading-snug">
                &ldquo;Rightly dividing the word of truth&rdquo;
              </p>
              <p className="text-brand-purple-200 text-[8px] mt-0.5 font-semibold leading-none">
                — 2 Timothy 2:15
              </p>
            </div>

            {/* Footer */}
            <div className="border-t border-brand-gold-400/30 pt-2 mt-1">
              <div className="grid grid-cols-3 gap-2 items-end">
                <div className="text-left">
                  <p className="text-brand-purple-200 text-[8px] font-black uppercase tracking-widest leading-none mb-0.5">
                    Issued
                  </p>
                  <p className="text-white text-[9px] font-semibold leading-tight">
                    {issueDate}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-brand-purple-200 text-[8px] font-black uppercase tracking-widest leading-none mb-0.5">
                    Authorized
                  </p>
                  <p className="text-white text-[9px] font-black leading-tight">
                    Prophet Olayiwole
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-brand-purple-200 text-[8px] font-black uppercase tracking-widest leading-none mb-0.5">
                    Valid Till
                  </p>
                  <p className="text-white text-[9px] font-semibold leading-tight">
                    {validYear}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Action Buttons ── */}
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
            disabled={isSharing}
            className="py-4 rounded-xl bg-brand-purple-950/60 text-white font-black border border-brand-gold-400/40 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSharing ? "Sharing..." : "📤 Share"}
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
              <li>Present it when attending classes and events</li>
              <li>Download and save it to your phone gallery</li>
              <li>Print a physical copy if needed</li>
              <li>Valid throughout your academic year</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}