// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER DEVOTIONAL — Dashboard pattern (purple cards, limited gold, white text)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "./LoadingScreen";

interface Devotional {
  id: string;
  title: string;
  scripture: string;
  body: string;
  prayer_point: string | null;
  confession: string | null;
  publish_date: string;
  author: string;
  is_published: boolean;
}

function formatDateFull(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

function getLocalToday(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function isToday(dateStr: string): boolean {
  return dateStr === getLocalToday();
}

function isYesterday(dateStr: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
}

function getDateLabel(dateStr: string): string {
  if (isToday(dateStr)) return "📖 Today's Word";
  if (isYesterday(dateStr)) return "📅 Yesterday's Word";
  return `📅 ${formatDateFull(dateStr)}`;
}

function getDaysAgo(dateStr: string): string {
  const now = new Date(getLocalToday() + "T12:00:00");
  const then = new Date(dateStr + "T12:00:00");
  const diffDays = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function MemberDevotionalClient() {
  const [latestDevotional, setLatestDevotional] = useState<Devotional | null>(null);
  const [recentDevotionals, setRecentDevotionals] = useState<Devotional[]>([]);
  const [selected, setSelected] = useState<Devotional | null>(null);
  const [loading, setLoading] = useState(true);
  const [memberName, setMemberName] = useState("");

  useEffect(() => {
    loadDevotionals();
    loadMember();
  }, []);

  const loadMember = async () => {
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
                break;
              }
            }
          } catch { /* ignore */ }
        }
      }
    } catch { /* ignore */ }
  };

  const loadDevotionals = async () => {
    try {
      const supabase = createClient();
      const todayStr = getLocalToday();

      const { data: allDevotionals } = await supabase
        .from("tfam_devotionals")
        .select("*")
        .eq("is_published", true)
        .lte("publish_date", todayStr)
        .order("publish_date", { ascending: false })
        .limit(30);

      const devotionalsList = allDevotionals || [];

      if (devotionalsList.length > 0) {
        setLatestDevotional(devotionalsList[0]);
        setSelected(devotionalsList[0]);
      }

      setRecentDevotionals(devotionalsList);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const shareToWhatsApp = (d: Devotional) => {
    const text = `📖 *${d.title}*\n\n📜 *${d.scripture}*\n\n${d.body}\n\n🙏 *Prayer:* ${d.prayer_point || ""}\n\n💪 *Confession:* ${d.confession || ""}\n\n— The Triumphant Family Ministry\n🌐 triumphantfamily.vercel.app`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const todayStr = getLocalToday();

  if (loading) {
    return <LoadingScreen message="Loading today's word..." />;
  }

  return (
    <div className="space-y-6">
      {/* Brand Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">Daily Devotional</span>
          </div>
          <p className="text-white/80 font-semibold text-lg mb-1">
            {getGreeting()}{memberName ? `, ${memberName}` : ""}!
          </p>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            Today&apos;s Word of God
          </h1>
          <p className="text-brand-purple-100 text-sm md:text-base">
            📅 {formatDateFull(todayStr)}
          </p>
          {latestDevotional && !isToday(latestDevotional.publish_date) && (
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-400/40">
              <span className="text-white text-sm">📌 Showing most recent from <strong className="text-white">{getDaysAgo(latestDevotional.publish_date)}</strong></span>
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-brand-gold-400/30">
            <p className="text-brand-purple-200 italic text-sm">&ldquo;Thy word is a lamp unto my feet, and a light unto my path.&rdquo;</p>
            <p className="text-brand-purple-300 text-xs mt-1 font-semibold">— Psalm 119:105</p>
          </div>
        </div>
      </div>

      {/* No Devotional */}
      {!latestDevotional && recentDevotionals.length === 0 && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">📖</div>
          <h2 className="font-heading text-xl font-bold text-white mb-2">Devotionals Coming Soon!</h2>
          <p className="text-brand-purple-200 text-sm">Pastor is preparing powerful daily words for you.</p>
        </div>
      )}

      {/* Selected Devotional */}
      {selected && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-2xl">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

          <div className="px-6 pt-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40">
              <span className="w-2 h-2 rounded-full bg-brand-gold-400 animate-pulse" />
              <span className="text-white font-bold text-xs uppercase tracking-widest">
                {getDateLabel(selected.publish_date)}
              </span>
            </div>
            {!isToday(selected.publish_date) && selected.id === latestDevotional?.id && (
              <p className="text-white text-xs mt-2">⏰ No new devotional for today yet — showing latest available</p>
            )}
          </div>

          <div className="p-6 space-y-5">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white leading-tight">{selected.title}</h2>

            <div className="relative rounded-2xl overflow-hidden bg-brand-purple-950/60 border border-brand-gold-400/30 p-4">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <p className="text-brand-purple-200 font-bold text-xs uppercase tracking-widest mb-1">📜 Scripture</p>
              <p className="text-white font-heading font-bold text-xl">{selected.scripture}</p>
            </div>

            <div>
              <p className="text-brand-purple-200 font-bold text-xs uppercase tracking-widest mb-3">✉️ Message</p>
             <div className="text-white/90 leading-relaxed space-y-3 text-sm md:text-base text-justify">
                {selected.body.split("\n\n").length > 1
                  ? selected.body.split("\n\n").map((para, i) => <p key={i}>{para}</p>)
                  : selected.body.split("\n").map((para, i) => <p key={i}>{para}</p>)}
              </div>
            </div>

            {selected.prayer_point && (
              <div className="relative rounded-2xl overflow-hidden bg-brand-purple-950/60 border border-brand-gold-400/30 p-4">
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                <p className="text-brand-purple-200 font-bold text-xs uppercase tracking-widest mb-2">🙏 Prayer Point</p>
                <p className="text-white/90 leading-relaxed italic">{selected.prayer_point}</p>
              </div>
            )}

            {selected.confession && (
              <div className="relative rounded-2xl overflow-hidden bg-brand-purple-950/60 border border-brand-gold-400/30 p-4">
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                <p className="text-brand-purple-200 font-bold text-xs uppercase tracking-widest mb-2">💪 Confession / Declaration</p>
                <p className="text-white font-bold leading-relaxed">{selected.confession}</p>
              </div>
            )}

            <div className="pt-4 border-t border-brand-gold-400/30 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-brand-purple-300 text-xs">Written by</p>
                <p className="text-white font-bold text-sm">{selected.author || "Prophet Olayiwole Ogunsola"}</p>
                <p className="text-brand-purple-200 text-xs">The Triumphant Family Ministry</p>
              </div>
              <button
                onClick={() => shareToWhatsApp(selected)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-all hover:scale-105 shadow-lg"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Share on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent */}
      {recentDevotionals.length > 1 && (
        <div>
          <h2 className="text-white font-heading font-bold text-xl mb-4">📚 Past Devotionals</h2>
          <div className="space-y-2">
            {recentDevotionals.map((d) => (
              <button key={d.id} onClick={() => setSelected(d)}
                className={`w-full text-left relative rounded-2xl overflow-hidden border-2 p-4 transition-all hover:-translate-y-0.5 ${
                  selected?.id === d.id
                    ? "bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-brand-gold-400 shadow-xl"
                    : "bg-gradient-to-br from-brand-violet-900/80 via-brand-purple-800/80 to-brand-purple-900/80 border-brand-gold-400/30 hover:border-brand-gold-400/60"
                }`}>
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{d.title}</p>
                    <p className="text-brand-purple-200 text-xs">{d.scripture}</p>
                    <p className="text-brand-purple-300 text-xs mt-0.5">{getDaysAgo(d.publish_date)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isToday(d.publish_date) && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-brand-gold-400 text-brand-purple-900">TODAY</span>
                    )}
                    {isYesterday(d.publish_date) && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/40">YESTERDAY</span>
                    )}
                    {selected?.id === d.id && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-500/20 text-green-300 border border-green-400/40">Reading</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}