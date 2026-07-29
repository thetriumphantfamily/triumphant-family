// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA CERTIFICATE CLIENT — Beautiful graduation certificate
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface Student {
  id: string;
  student_id: string;
  full_name: string;
  level: string;
  batch: string;
  graduation_status: string;
  graduation_date: string | null;
  graduation_batch: string | null;
  graduation_notes: string | null;
  awards: string[];
}

const LEVEL_NAMES: Record<string, string> = {
  "100": "Triumphant Christian Living",
  "200": "Nurturing",
  "300": "Church Administration",
  "400": "Spiritual Leadership & Ministry",
};

const AWARD_ICONS: Record<string, string> = {
  "Best Student": "🏆",
  "Most Improved": "📈",
  "Perfect Attendance": "📅",
  "Best in Assignments": "⭐",
  "Most Faithful": "✝️",
  "Excellence in Service": "🙌",
};

export default function TDACertificateClient() {
  const certificateRef = useRef<HTMLDivElement>(null);
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

  const handleDownload = async () => {
    if (!certificateRef.current || !student) return;

    setIsDownloading(true);

    try {
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(certificateRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `TDA-Certificate-${student.student_id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast.success("✅ Certificate downloaded!");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to download");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const handleShare = async () => {
    if (!certificateRef.current || !student) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], `TDA-Certificate-${student.student_id}.png`, {
          type: "image/png",
        });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: "TDA Graduation Certificate",
              text: `${student.full_name} - Graduate of Triumphant Disciples Academy`,
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
        <p className="text-gray-500">Loading certificate...</p>
      </div>
    );
  }

  if (!student) return null;

  // ━━━ NOT YET GRADUATED VIEW ━━━
  if (student.graduation_status !== "graduated") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl p-8 md:p-12 border-2 border-brand-gold-400/40 shadow-2xl text-center overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

          {/* Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-purple-950/60 border-4 border-brand-gold-400/40 mb-6">
            <svg
              className="w-12 h-12 text-brand-gold-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
              />
            </svg>
          </div>

          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
            🎓 Not Yet Graduated
          </h2>

          <p className="text-brand-purple-100 text-base md:text-lg leading-relaxed mb-6">
            Your graduation certificate will appear here once you complete
            your studies and the school administrator marks you as graduated.
          </p>

          <div className="bg-brand-gold-400/10 border border-brand-gold-400/30 rounded-2xl p-5 mb-6 text-left">
            <p className="font-bold text-brand-gold-400 mb-3 text-center">
              🎯 Requirements for Graduation
            </p>
            <ul className="text-brand-purple-100 text-sm space-y-2 list-disc pl-4">
              <li>Attend at least 75% of all sessions</li>
              <li>Submit all assigned coursework</li>
              <li>Complete assessments with passing grades</li>
              <li>Demonstrate spiritual growth and readiness</li>
              <li>Administrator approval</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/bible-school/portal/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/bible-school/portal/attendance"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-purple-950/60 border-2 border-brand-gold-400/40 text-white font-bold hover:border-brand-gold-400 transition-all"
            >
              View My Progress
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ━━━ GRADUATED — SHOW CERTIFICATE ━━━
  const graduationDate = student.graduation_date
    ? new Date(student.graduation_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-6 text-center">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">
          🎓 Your Graduation Certificate
        </h1>
        <p className="text-gray-600 text-sm">
          Congratulations! Download, print, or share your official TDA certificate
        </p>
      </div>

      {/* Certificate */}
      <div className="mb-8 overflow-x-auto pb-4">
        <div className="flex justify-center min-w-fit">
          <div
            ref={certificateRef}
            className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 shadow-2xl"
            style={{
              width: "900px",
              height: "636px",
              padding: "40px",
            }}
          >
            {/* Outer border */}
            <div className="absolute inset-4 border-4 border-brand-gold-400 rounded-lg" />
            <div className="absolute inset-6 border-2 border-brand-purple-900 rounded-lg" />

            {/* Gold corner decorations */}
            <div className="absolute top-8 left-8 w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-gold-500 to-transparent" />
                <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-brand-gold-500 to-transparent" />
              </div>
            </div>
            <div className="absolute top-8 right-8 w-16 h-16">
              <div className="absolute top-0 right-0 w-full h-full">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-brand-gold-500 to-transparent" />
                <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-brand-gold-500 to-transparent" />
              </div>
            </div>
            <div className="absolute bottom-8 left-8 w-16 h-16">
              <div className="absolute bottom-0 left-0 w-full h-full">
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-brand-gold-500 to-transparent" />
                <div className="absolute bottom-0 left-0 h-full w-1 bg-gradient-to-t from-brand-gold-500 to-transparent" />
              </div>
            </div>
            <div className="absolute bottom-8 right-8 w-16 h-16">
              <div className="absolute bottom-0 right-0 w-full h-full">
                <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-brand-gold-500 to-transparent" />
                <div className="absolute bottom-0 right-0 h-full w-1 bg-gradient-to-t from-brand-gold-500 to-transparent" />
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-between py-8 px-16 text-center">
              {/* Header — Logo + Ministry */}
              <div className="flex items-center gap-4">
                <Image
                  src="/images/logo/logo.png"
                  alt="TFAM Logo"
                  width={72}
                  height={72}
                  unoptimized
                  className="w-18 h-18 object-contain"
                />
                <div className="text-left">
                  <p className="font-heading font-bold text-brand-purple-900 text-lg leading-tight">
                    The Triumphant Family
                  </p>
                  <p className="text-brand-gold-600 text-xs font-bold uppercase tracking-widest">
                    Apostolic Ministry
                  </p>
                </div>
              </div>

              {/* School Name */}
              <div>
                <p
                  className="font-heading font-black text-brand-purple-900 text-sm uppercase tracking-[0.3em]"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Triumphant Disciples Academy
                </p>
                <div className="mt-2 h-0.5 w-32 bg-brand-gold-400 mx-auto" />
              </div>

              {/* Title */}
              <div>
                <p
                  className="font-heading font-black text-brand-purple-900 text-4xl mb-1"
                  style={{
                    fontFamily: "Georgia, serif",
                    letterSpacing: "0.05em",
                  }}
                >
                  Certificate
                </p>
                <p className="text-brand-purple-800 text-sm uppercase tracking-[0.4em] font-semibold">
                  of Completion
                </p>
              </div>

              {/* This is to certify */}
              <div>
                <p className="text-brand-purple-800 text-sm italic mb-3">
                  This is to certify that
                </p>
                <p
                  className="font-heading font-bold text-brand-purple-900 text-3xl italic"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {student.full_name}
                </p>
                <div className="mt-2 h-0.5 w-64 bg-brand-gold-400 mx-auto" />
              </div>

              {/* Programme details */}
              <div className="max-w-xl">
                <p className="text-brand-purple-800 text-sm italic leading-relaxed">
                  has successfully completed the
                </p>
                <p className="font-heading font-bold text-brand-purple-900 text-lg my-2">
                  School of {LEVEL_NAMES[student.level]}
                </p>
                <p className="text-brand-purple-700 text-xs italic">
                  Level {student.level} • {student.graduation_batch || student.batch}
                </p>
              </div>

              {/* Awards (if any) */}
              {student.awards && student.awards.length > 0 && (
                <div className="max-w-xl">
                  <p className="text-brand-purple-800 text-xs italic mb-2">
                    With Special Recognition:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {student.awards.map((award, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-gold-100 border-2 border-brand-gold-400 text-brand-purple-900 text-xs font-bold shadow-sm"
                      >
                        <span>{AWARD_ICONS[award] || "🏆"}</span>
                        <span>{award}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Scripture */}
              <div>
                <p
                  className="text-brand-purple-800 text-sm italic leading-relaxed max-w-md"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  &ldquo;Study to show thyself approved unto God, a workman
                  that needeth not to be ashamed, rightly dividing the word of
                  truth.&rdquo;
                </p>
                <p className="text-brand-gold-600 text-xs font-bold mt-1">
                  — 2 Timothy 2:15
                </p>
              </div>

              {/* Footer — Signature and Seal */}
              <div className="w-full flex items-end justify-between">
                {/* Date */}
                <div className="text-left">
                  <p className="text-brand-purple-700 text-xs mb-1 italic">
                    Awarded on
                  </p>
                  <p className="text-brand-purple-900 text-sm font-bold border-t-2 border-brand-purple-900 pt-1">
                    {graduationDate}
                  </p>
                  <p className="text-brand-purple-600 text-[10px] mt-1">
                    Student ID: {student.student_id}
                  </p>
                </div>

                {/* Gold Seal */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-lg flex items-center justify-center border-4 border-brand-gold-600">
                    <div className="text-center">
                      <svg
                        className="w-8 h-8 text-brand-purple-900 mx-auto mb-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2L1 21h22M12 6l7.53 13H4.47" />
                      </svg>
                      <p className="text-brand-purple-900 text-[7px] font-black uppercase tracking-wider leading-none">
                        Official Seal
                      </p>
                    </div>
                  </div>
                </div>

                {/* Signature */}
                <div className="text-right">
                  <p
                    className="text-brand-purple-900 text-lg font-bold italic"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Prophet Olayiwole
                  </p>
                  <p className="text-brand-purple-900 text-xs font-bold border-t-2 border-brand-purple-900 pt-1">
                    Senior Pastor & Founder
                  </p>
                  <p className="text-brand-purple-600 text-[10px] mt-1">
                    The Triumphant Family
                  </p>
                </div>
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

      {/* Congratulatory Message */}
      <div className="bg-gradient-to-br from-brand-gold-50 to-yellow-50 border-2 border-brand-gold-200 rounded-2xl p-6">
        <div className="text-center">
          <div className="text-4xl mb-3">🎊</div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">
            Congratulations, {student.full_name.split(" ")[0]}!
          </h3>
          <p className="text-brand-purple-700 leading-relaxed">
            You have successfully completed your studies at the Triumphant
            Disciples Academy. May you continue to grow in grace and knowledge
            of our Lord and Saviour Jesus Christ. Go forth and make disciples!
          </p>
          {student.graduation_notes && (
            <div className="mt-4 p-4 bg-white rounded-xl border border-brand-gold-300">
              <p className="text-brand-purple-800 italic text-sm">
                &ldquo;{student.graduation_notes}&rdquo;
              </p>
              <p className="text-brand-purple-600 text-xs font-semibold mt-2">
                — School Administrator
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}