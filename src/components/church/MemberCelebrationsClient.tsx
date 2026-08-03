// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER CELEBRATIONS — Dashboard pattern (purple cards, white text)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "./LoadingScreen";

interface Member {
  id: string;
  full_name: string;
  photo_url: string | null;
  date_of_birth: string | null;
  department: string | null;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getLocalToday() {
  const now = new Date();
  return { month: now.getMonth() + 1, day: now.getDate() };
}

function isToday(dob: string): boolean {
  const date = new Date(dob + "T12:00:00");
  const today = getLocalToday();
  return date.getMonth() + 1 === today.month && date.getDate() === today.day;
}

function isThisWeek(dob: string): boolean {
  const date = new Date(dob + "T12:00:00");
  const now = new Date();
  const dobThisYear = new Date(now.getFullYear(), date.getMonth(), date.getDate());
  const diffMs = dobThisYear.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 7;
}

function isThisMonth(dob: string): boolean {
  const date = new Date(dob + "T12:00:00");
  const today = getLocalToday();
  return date.getMonth() + 1 === today.month;
}

function formatBirthday(dob: string): string {
  return new Date(dob + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

export default function MemberCelebrationsClient() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberName, setMemberName] = useState("");

  useEffect(() => {
    loadMembers();
    loadMember();
  }, []);

  const loadMember = () => {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.includes("member") || key.includes("tfam")) {
          try {
            const val = localStorage.getItem(key);
            if (val) {
              const parsed = JSON.parse(val);
              if (parsed.full_name) { setMemberName(parsed.full_name.split(" ")[0]); break; }
            }
          } catch { /* ignore */ }
        }
      }
    } catch { /* ignore */ }
  };

  const loadMembers = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tfam_members")
        .select("id, full_name, photo_url, date_of_birth, department")
        .eq("status", "approved")
        .not("date_of_birth", "is", null);
      setMembers(data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const shareToWhatsApp = (name: string) => {
    const text = `🎂 Happy Birthday ${name}! 🎉\n\nMay God bless you abundantly on this special day. Wishing you joy, peace, and divine favour!\n\n🙏 From The Triumphant Family Ministry`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (loading) {
    return <LoadingScreen message="Loading celebrations..." />;
  }

  const todayBirthdays = members.filter((m) => m.date_of_birth && isToday(m.date_of_birth));
  const weekBirthdays = members.filter((m) => m.date_of_birth && isThisWeek(m.date_of_birth) && !isToday(m.date_of_birth));
  const monthBirthdays = members.filter((m) => m.date_of_birth && isThisMonth(m.date_of_birth) && !isThisWeek(m.date_of_birth) && !isToday(m.date_of_birth));

  const renderMemberCard = (m: Member, showWhatsApp: boolean = false) => (
    <div key={m.id} className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4 shadow-xl">
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
      <div className="flex items-center gap-3">
        {m.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.photo_url} alt={m.full_name} className="w-14 h-14 rounded-full object-cover border-2 border-brand-gold-400 flex-shrink-0" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 flex items-center justify-center text-brand-purple-900 font-black text-xl flex-shrink-0">
            {m.full_name.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-black text-white truncate">{m.full_name}</p>
          {m.date_of_birth && <p className="text-brand-purple-200 text-xs font-semibold">🎂 {formatBirthday(m.date_of_birth)}</p>}
          {m.department && <p className="text-brand-purple-300 text-xs">{m.department}</p>}
        </div>
        {showWhatsApp && (
          <button onClick={() => shareToWhatsApp(m.full_name)} className="px-3 py-1.5 rounded-full bg-green-500 hover:bg-green-600 text-white text-xs font-bold flex-shrink-0 transition-all">
            🎉 Wish
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Brand Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">Celebrations</span>
          </div>
          <p className="text-white/80 font-semibold text-lg mb-1">{getGreeting()}{memberName ? `, ${memberName}` : ""}!</p>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">Birthdays & Celebrations</h1>
          <p className="text-brand-purple-100 text-sm md:text-base">Celebrate with your church family</p>
          <div className="flex gap-6 pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{todayBirthdays.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Today</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{weekBirthdays.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">This Week</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{monthBirthdays.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">This Month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today */}
      {todayBirthdays.length > 0 && (
        <div>
          <h2 className="text-white font-heading font-bold text-xl mb-4">🎂 Birthday Today!</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {todayBirthdays.map((m) => renderMemberCard(m, true))}
          </div>
        </div>
      )}

      {todayBirthdays.length === 0 && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">🎂</div>
          <h2 className="font-heading text-xl font-bold text-white mb-2">No Birthdays Today</h2>
          <p className="text-brand-purple-200 text-sm">Check this week and this month!</p>
        </div>
      )}

      {/* This Week */}
      {weekBirthdays.length > 0 && (
        <div>
          <h2 className="text-white font-heading font-bold text-xl mb-4">📅 This Week</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {weekBirthdays.map((m) => renderMemberCard(m, true))}
          </div>
        </div>
      )}

      {/* This Month */}
      {monthBirthdays.length > 0 && (
        <div>
          <h2 className="text-white font-heading font-bold text-xl mb-4">📆 This Month</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {monthBirthdays.map((m) => renderMemberCard(m))}
          </div>
        </div>
      )}
    </div>
  );
}