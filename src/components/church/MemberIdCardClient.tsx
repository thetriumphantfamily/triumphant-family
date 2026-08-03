// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER ID CARD — Dashboard pattern (purple cards, white text)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "./LoadingScreen";

interface Member {
  id: string;
  member_id: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string | null;
  photo_url: string | null;
  department: string | null;
  date_joined: string | null;
  baptism_status: string | null;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function MemberIdCardClient() {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [memberName, setMemberName] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadMember(); }, []);

  const loadMember = async () => {
    let foundId = "";

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.includes("member") || key.includes("tfam")) {
          try {
            const val = localStorage.getItem(key);
            if (val) {
              const parsed = JSON.parse(val);
              if (parsed.full_name) {
                setMemberName(parsed.full_name.split(" ")[0]);
                if (parsed.id) foundId = parsed.id;
                break;
              }
            }
          } catch { /* ignore */ }
        }
      }
    } catch { /* ignore */ }

    if (foundId) {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("tfam_members")
          .select("*")
          .eq("id", foundId)
          .single();
        setMember(data);
      } catch (err) { console.error(err); }
    }

    setLoading(false);
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `TFAM-ID-${member?.member_id || "card"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading your ID card..." />;
  }

  if (!member) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-white font-bold">Member not found</p>
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
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">ID Card</span>
          </div>
          <p className="text-white/80 font-semibold text-lg mb-1">{getGreeting()}{memberName ? `, ${memberName}` : ""}!</p>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">Digital Member ID</h1>
          <p className="text-brand-purple-100 text-sm md:text-base">Your official TFAM membership card</p>
        </div>
      </div>

      {/* ID Card */}
      <div className="flex justify-center">
        <div ref={cardRef} className="w-full max-w-md">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400 shadow-2xl">
            {/* Gold top bar */}
            <div className="h-2 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            <div className="p-6">
              {/* Church Name */}
              <div className="text-center mb-6">
                <p className="font-heading font-black text-white text-lg">THE TRIUMPHANT FAMILY</p>
                <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">The Gleam of Salvation Apostolic Ministry</p>
                <div className="h-0.5 w-20 mx-auto mt-3 bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
              </div>

              {/* Photo + Info */}
              <div className="flex items-start gap-4 mb-6">
                {member.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photo_url}
                    alt={member.full_name}
                    className="w-24 h-28 rounded-xl object-cover border-2 border-brand-gold-400 shadow-lg flex-shrink-0"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="w-24 h-28 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 flex items-center justify-center text-brand-purple-900 font-black text-3xl border-2 border-brand-gold-400 flex-shrink-0">
                    {member.full_name.charAt(0)}
                  </div>
                )}

                <div className="flex-1 min-w-0 space-y-2">
                  <div>
                    <p className="text-brand-purple-300 text-[10px] uppercase tracking-widest font-semibold">Full Name</p>
                    <p className="text-white font-black text-base truncate">{member.full_name}</p>
                  </div>
                  <div>
                    <p className="text-brand-purple-300 text-[10px] uppercase tracking-widest font-semibold">Member ID</p>
                    <p className="text-brand-gold-400 font-black text-lg">{member.member_id}</p>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-brand-purple-950/60 rounded-xl p-3 border border-brand-gold-400/30">
                  <p className="text-brand-purple-300 text-[10px] uppercase tracking-widest font-semibold">Department</p>
                  <p className="text-white font-bold text-xs truncate">{member.department || "Not assigned"}</p>
                </div>
                <div className="bg-brand-purple-950/60 rounded-xl p-3 border border-brand-gold-400/30">
                  <p className="text-brand-purple-300 text-[10px] uppercase tracking-widest font-semibold">Gender</p>
                  <p className="text-white font-bold text-xs capitalize">{member.gender || "—"}</p>
                </div>
                <div className="bg-brand-purple-950/60 rounded-xl p-3 border border-brand-gold-400/30">
                  <p className="text-brand-purple-300 text-[10px] uppercase tracking-widest font-semibold">Phone</p>
                  <p className="text-white font-bold text-xs">{member.phone}</p>
                </div>
                <div className="bg-brand-purple-950/60 rounded-xl p-3 border border-brand-gold-400/30">
                  <p className="text-brand-purple-300 text-[10px] uppercase tracking-widest font-semibold">Joined</p>
                  <p className="text-white font-bold text-xs">{member.date_joined ? formatDate(member.date_joined) : "—"}</p>
                </div>
              </div>

              {/* Bottom */}
              <div className="text-center pt-4 border-t border-brand-gold-400/30">
                <p className="text-brand-purple-200 italic text-xs">Pray With Us. Triumph With Us.</p>
                <p className="text-brand-purple-300 text-[10px] mt-1">📍 1, Arifanla Bus Stop, Akute, Ogun State</p>
                <p className="text-brand-purple-300 text-[10px]">📱 +234 802 262 0704</p>
              </div>
            </div>

            {/* Gold bottom bar */}
            <div className="h-2 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="flex justify-center">
        <button
          onClick={downloadCard}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-base shadow-gold hover:scale-105 transition-all"
        >
          📥 Download ID Card
        </button>
      </div>
    </div>
  );
}