// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER ID CARD CLIENT — Beautiful downloadable church member ID
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface Member {
  id: string;
  member_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  photo_url: string | null;
  department: string | null;
  date_joined: string | null;
  baptism_status: string | null;
}

export default function MemberIdCardClient() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    loadMember();
  }, []);

  const loadMember = async () => {
    try {
      const session = localStorage.getItem("tfam_member_session");
      if (!session) return;

      const sessionData = JSON.parse(session);
      const supabase = createClient();

      const { data } = await supabase
        .from("tfam_members")
        .select("*")
        .eq("id", sessionData.id)
        .single();

      if (data) setMember(data);
      setLoading(false);
    } catch (err) {
      console.error("Load error:", err);
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current || !member) return;
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
      link.download = `TFAM-ID-${member.member_id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast.success("✅ ID Card downloaded!");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to download");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Loading ID card...</p>
      </div>
    );
  }

  if (!member) return null;

  const validYear = new Date().getFullYear() + 1;
  const issueDate = member.date_joined
    ? new Date(member.date_joined).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">
          🎴 Your Member ID Card
        </h1>
        <p className="text-gray-600 text-sm">
          Download, print, or share your official TFAM member ID
        </p>
      </div>

      {/* ID Card */}
      <div className="flex justify-center mb-8">
        <div
          ref={cardRef}
          className="relative w-full max-w-md bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl overflow-hidden shadow-2xl"
          style={{ aspectRatio: "1 / 1.586" }}
        >
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="absolute bottom-0 inset-x-0 h-2 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

          <div className="relative z-10 p-6 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image src="/images/logo/logo.png" alt="TFAM Logo" width={64} height={64} unoptimized className="w-16 h-16 object-contain" />
              <div className="text-center">
                <p className="font-heading font-bold text-white text-sm leading-tight">The Triumphant Family</p>
                <p className="text-brand-gold-400 text-[10px] font-semibold uppercase tracking-widest">Apostolic Ministry</p>
              </div>
            </div>

            <div className="h-0.5 bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent mb-3" />

            <div className="text-center mb-4">
              <p className="font-heading font-bold text-brand-gold-400 text-base uppercase tracking-widest">Official Member ID</p>
            </div>

            {/* Photo */}
            <div className="flex justify-center mb-4">
              {member.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={member.photo_url} alt={member.full_name} className="w-28 h-28 rounded-full object-cover border-4 border-brand-gold-400 shadow-lg" crossOrigin="anonymous" />
              ) : (
                <div className="w-28 h-28 rounded-full bg-brand-gold-400 flex items-center justify-center text-brand-purple-900 font-bold text-4xl border-4 border-brand-gold-400 shadow-lg">
                  {member.full_name.charAt(0)}
                </div>
              )}
            </div>

            {/* Name */}
            <div className="text-center mb-3">
              <p className="font-heading font-bold text-white text-lg leading-tight">{member.full_name}</p>
            </div>

            {/* ID Pill */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 shadow-gold">
                <span className="text-brand-purple-900 font-bold text-sm">{member.member_id}</span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3 flex-1">
              <div className="bg-brand-purple-950/60 rounded-xl p-2 border border-brand-gold-400/30">
                <p className="text-brand-gold-400 text-[9px] uppercase tracking-widest font-semibold">Department</p>
                <p className="text-white text-xs font-bold truncate">{member.department || "—"}</p>
              </div>
              <div className="bg-brand-purple-950/60 rounded-xl p-2 border border-brand-gold-400/30">
                <p className="text-brand-gold-400 text-[9px] uppercase tracking-widest font-semibold">Phone</p>
                <p className="text-white text-xs font-bold truncate">{member.phone || "—"}</p>
              </div>
              <div className="bg-brand-purple-950/60 rounded-xl p-2 border border-brand-gold-400/30 col-span-2">
                <p className="text-brand-gold-400 text-[9px] uppercase tracking-widest font-semibold">Baptism</p>
                <p className="text-white text-xs font-bold capitalize">{member.baptism_status?.replace(/_/g, " ") || "—"}</p>
              </div>
            </div>

            {/* Scripture */}
            <div className="text-center mb-2 px-2">
              <p className="text-brand-gold-400 text-xs italic font-medium leading-tight">
                &ldquo;Pray with us. Triumph with us.&rdquo;
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-[9px] text-white/80 pt-2 border-t border-brand-gold-400/30">
              <div>
                <p className="text-brand-gold-400 font-semibold">Issued</p>
                <p>{issueDate}</p>
              </div>
              <div className="text-center">
                <p className="text-brand-gold-400 font-semibold">Authorized</p>
                <p className="text-white font-bold text-[10px]">Prophet Olayiwole</p>
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
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all disabled:opacity-50"
        >
          {isDownloading ? "Downloading..." : "📥 Download as PNG"}
        </button>
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-purple-600 hover:bg-brand-purple-700 text-white font-bold shadow-md transition-all"
        >
          🖨️ Print
        </button>
      </div>

      {/* Info */}
      <div className="bg-brand-gold-50 border-2 border-brand-gold-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0">
            <span className="text-lg">💡</span>
          </div>
          <div>
            <p className="font-bold text-brand-purple-900 mb-1">About Your ID Card</p>
            <ul className="text-brand-purple-700 text-sm space-y-1 list-disc pl-4">
              <li>Your official identification as a TFAM member</li>
              <li>Present when attending services and events</li>
              <li>Download and save to your phone</li>
              <li>Valid throughout the year</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}