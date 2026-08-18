// ───────────────────────────────────────────────────────────────
// TDA ID CARD CLIENT — Cloned from Church Member ID template
// Uses html-to-image for high-quality download
// ───────────────────────────────────────────────────────────────
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

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

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
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadStudent(); }, []);

  const loadStudent = async () => {
    try {
      const session = localStorage.getItem("tda_student_session");
      if (!session) {
        setLoading(false);
        return;
      }

      const sessionData = JSON.parse(session);
      if (sessionData.full_name) {
        setStudentName(sessionData.full_name.split(" ")[0]);
      }

      const supabase = createClient();
      const { data } = await supabase
        .from("tda_students")
        .select("*")
        .eq("id", sessionData.id)
        .single();

      if (data) setStudent(data);
    } catch (err) {
      console.error("Load error:", err);
    }
    setLoading(false);
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

  const downloadCard = async () => {
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

  const shareCard = async () => {
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

  if (loading) {
    return <LoadingScreen message="Loading your ID card..." />;
  }

  if (!student) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-white font-bold">Student not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Brand Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">Student ID Card</span>
          </div>
          <p className="text-white/80 font-semibold text-lg mb-1">{getGreeting()}{studentName ? `, ${studentName}` : ""}!</p>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">Digital Student ID</h1>
          <p className="text-brand-purple-100 text-sm md:text-base">Your official TDA Bible School student card</p>
        </div>
      </div>

      {/* ID Card */}
      <div className="flex justify-center">
        <div ref={cardRef} className="w-full max-w-md">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400 shadow-2xl">
            {/* Gold top bar */}
            <div className="h-2 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            <div className="p-6">
              {/* School Name */}
              <div className="text-center mb-6">
                <p className="font-heading font-black text-white text-lg">TRIUMPHANT DISCIPLES ACADEMY</p>
                <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">The Triumphant Family Bible School</p>
                <div className="h-0.5 w-20 mx-auto mt-3 bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
              </div>

              {/* Photo + Info */}
              <div className="flex items-start gap-4 mb-6">
                {student.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={student.photo_url}
                    alt={student.full_name}
                    className="w-24 h-28 rounded-xl object-cover border-2 border-brand-gold-400 shadow-lg flex-shrink-0"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="w-24 h-28 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 flex items-center justify-center text-brand-purple-900 font-black text-3xl border-2 border-brand-gold-400 flex-shrink-0">
                    {student.full_name.charAt(0)}
                  </div>
                )}

                <div className="flex-1 min-w-0 space-y-2">
                  <div>
                    <p className="text-brand-purple-300 text-[10px] uppercase tracking-widest font-semibold">Full Name</p>
                    <p className="text-white font-black text-base truncate">{student.full_name}</p>
                  </div>
                  <div>
                    <p className="text-brand-purple-300 text-[10px] uppercase tracking-widest font-semibold">Student ID</p>
                    <p className="text-brand-gold-400 font-black text-lg">{student.student_id}</p>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-brand-purple-950/60 rounded-xl p-3 border border-brand-gold-400/30">
                  <p className="text-brand-purple-300 text-[10px] uppercase tracking-widest font-semibold">Level</p>
                  <p className="text-white font-bold text-xs truncate">Level {student.level}</p>
                </div>
                <div className="bg-brand-purple-950/60 rounded-xl p-3 border border-brand-gold-400/30">
                  <p className="text-brand-purple-300 text-[10px] uppercase tracking-widest font-semibold">Batch</p>
                  <p className="text-white font-bold text-xs truncate">{student.batch}</p>
                </div>
                <div className="bg-brand-purple-950/60 rounded-xl p-3 border border-brand-gold-400/30 col-span-2">
                  <p className="text-brand-purple-300 text-[10px] uppercase tracking-widest font-semibold">School</p>
                  <p className="text-white font-bold text-xs">School of {LEVEL_NAMES[student.level] || "Bible Studies"}</p>
                </div>
                {student.department && (
                  <div className="bg-brand-purple-950/60 rounded-xl p-3 border border-brand-gold-400/30 col-span-2">
                    <p className="text-brand-purple-300 text-[10px] uppercase tracking-widest font-semibold">Department</p>
                    <p className="text-white font-bold text-xs">{student.department}</p>
                  </div>
                )}
                <div className="bg-brand-purple-950/60 rounded-xl p-3 border border-brand-gold-400/30">
                  <p className="text-brand-purple-300 text-[10px] uppercase tracking-widest font-semibold">Issued</p>
                  <p className="text-white font-bold text-xs">{formatDate(student.created_at)}</p>
                </div>
                <div className="bg-brand-purple-950/60 rounded-xl p-3 border border-brand-gold-400/30">
                  <p className="text-brand-purple-300 text-[10px] uppercase tracking-widest font-semibold">Valid Till</p>
                  <p className="text-white font-bold text-xs">Dec {new Date().getFullYear() + 1}</p>
                </div>
              </div>

              {/* Bottom */}
              <div className="text-center pt-4 border-t border-brand-gold-400/30">
                <p className="text-brand-purple-200 italic text-xs">&ldquo;Rightly dividing the word of truth&rdquo; — 2 Tim 2:15</p>
                <p className="text-brand-purple-300 text-[10px] mt-1">📍 1, Arifanla Bus Stop, Akute, Ogun State</p>
                <p className="text-brand-purple-300 text-[10px]">📱 +234 802 262 0704</p>
              </div>
            </div>

            {/* Gold bottom bar */}
            <div className="h-2 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          </div>
        </div>
      </div>

      {/* Download + Share Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <button
          onClick={downloadCard}
          disabled={isDownloading}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-base shadow-gold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          {isDownloading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Downloading...
            </>
          ) : "📥 Download ID Card"}
        </button>

        <button
          onClick={shareCard}
          disabled={isSharing}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-brand-purple-950/60 text-white font-black text-base border-2 border-brand-gold-400/40 hover:border-brand-gold-400 transition-all disabled:opacity-50"
        >
          {isSharing ? "Sharing..." : "📤 Share ID Card"}
        </button>
      </div>
    </div>
  );
}