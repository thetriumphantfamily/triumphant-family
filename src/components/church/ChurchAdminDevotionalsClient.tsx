// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN DEVOTIONALS CLIENT – AI-Powered + notify all members
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { notifyAllMembers } from "@/lib/notifications";
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
  created_at: string;
}

interface GeneratedDevotional {
  title: string;
  scripture: string;
  body: string;
  prayer_point: string;
  confession: string;
  publish_date: string;
  approved: boolean;
}

type ActiveTab = "all" | "write" | "ai-single" | "ai-bulk";

function formatDate(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function getLocalToday(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr + "T12:00:00");
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function parseDevotionals(raw: string, startDate: string): GeneratedDevotional[] {
  const blocks = raw.split("---DEVOTIONAL START---").filter((b) => b.includes("---DEVOTIONAL END---"));
  return blocks.map((block, index) => {
    const clean = block.replace("---DEVOTIONAL END---", "").trim();
    const getField = (label: string, nextLabel?: string): string => {
      const regex = nextLabel
        ? new RegExp(`${label}:\\s*([\\s\\S]*?)(?=${nextLabel}:|$)`)
        : new RegExp(`${label}:\\s*([\\s\\S]*?)$`);
      const match = clean.match(regex);
      return match ? match[1].trim() : "";
    };
    return {
      title: getField("TITLE", "SCRIPTURE"),
      scripture: getField("SCRIPTURE", "MESSAGE"),
      body: getField("MESSAGE", "PRAYER"),
      prayer_point: getField("PRAYER", "CONFESSION"),
      confession: getField("CONFESSION"),
      publish_date: addDays(startDate, index),
      approved: false,
    };
  });
}

function parseSingleDevotional(raw: string, date: string): GeneratedDevotional {
  const getField = (label: string, nextLabel?: string): string => {
    const regex = nextLabel
      ? new RegExp(`${label}:\\s*([\\s\\S]*?)(?=${nextLabel}:|$)`)
      : new RegExp(`${label}:\\s*([\\s\\S]*?)$`);
    const match = raw.match(regex);
    return match ? match[1].trim() : "";
  };
  return {
    title: getField("TITLE", "SCRIPTURE"),
    scripture: getField("SCRIPTURE", "MESSAGE"),
    body: getField("MESSAGE", "PRAYER"),
    prayer_point: getField("PRAYER", "CONFESSION"),
    confession: getField("CONFESSION"),
    publish_date: date,
    approved: true,
  };
}

const EMPTY_FORM = {
  title: "", scripture: "", body: "",
  prayer_point: "", confession: "",
  publish_date: getLocalToday(),
  is_published: true,
};

export default function ChurchAdminDevotionalsClient() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [aiSingleTopic, setAiSingleTopic] = useState("");
  const [aiSingleScripture, setAiSingleScripture] = useState("");
  const [aiSingleDate, setAiSingleDate] = useState(getLocalToday());
  const [aiSingleLoading, setAiSingleLoading] = useState(false);
  const [aiSingleResult, setAiSingleResult] = useState<GeneratedDevotional | null>(null);
  const [bulkTheme, setBulkTheme] = useState("");
  const [bulkCount, setBulkCount] = useState(7);
  const [bulkStartDate, setBulkStartDate] = useState(getLocalToday());
  const [bulkTopics, setBulkTopics] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkResults, setBulkResults] = useState<GeneratedDevotional[]>([]);
  const [isSavingBulk, setIsSavingBulk] = useState(false);

  useEffect(() => { loadDevotionals(); }, []);

  const loadDevotionals = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tfam_devotionals")
        .select("*")
        .order("publish_date", { ascending: false });
      setDevotionals(data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const notifyIfToday = async (title: string, scripture: string, publishDate: string, isPublished: boolean) => {
    if (isPublished && publishDate === getLocalToday()) {
      await notifyAllMembers({
        title: "📖 New Daily Devotional",
        message: `${title} — ${scripture}. Read now and be blessed!`,
        type: "devotional",
        link: "/member/devotional",
      });
    }
  };

  const handleManualSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.scripture.trim() || !formData.body.trim()) {
      toast.error("Title, Scripture and Message required"); return;
    }
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const payload = {
        title: formData.title.trim(), scripture: formData.scripture.trim(),
        body: formData.body.trim(), prayer_point: formData.prayer_point.trim() || null,
        confession: formData.confession.trim() || null,
        publish_date: formData.publish_date, is_published: formData.is_published,
      };
      if (editingId) {
        await supabase.from("tfam_devotionals").update(payload).eq("id", editingId);
        toast.success("✅ Updated!");
      } else {
        await supabase.from("tfam_devotionals").insert(payload);
        await notifyIfToday(payload.title, payload.scripture, payload.publish_date, payload.is_published);
        toast.success("📖 Devotional saved!");
      }
      setFormData(EMPTY_FORM);
      setEditingId(null);
      setActiveTab("all");
      loadDevotionals();
    } catch { toast.error("Failed"); }
    finally { setIsSubmitting(false); }
  };

  const handleAiSingle = async () => {
    if (!aiSingleTopic.trim()) { toast.error("Enter a topic"); return; }
    setAiSingleLoading(true);
    setAiSingleResult(null);
    try {
      const prompt = `Topic: ${aiSingleTopic}\nScripture: ${aiSingleScripture || "Choose an appropriate scripture"}`;
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type: "devotional-single" }),
      });
      const data = await res.json();
      if (data.error) { toast.error(data.error); return; }
      const parsed = parseSingleDevotional(data.result, aiSingleDate);
      setAiSingleResult(parsed);
      toast.success("🤖 Devotional generated!");
    } catch { toast.error("AI generation failed"); }
    finally { setAiSingleLoading(false); }
  };

  const saveAiSingle = async () => {
    if (!aiSingleResult) return;
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      await supabase.from("tfam_devotionals").insert({
        title: aiSingleResult.title, scripture: aiSingleResult.scripture,
        body: aiSingleResult.body, prayer_point: aiSingleResult.prayer_point || null,
        confession: aiSingleResult.confession || null,
        publish_date: aiSingleResult.publish_date, is_published: true,
      });
      await notifyIfToday(aiSingleResult.title, aiSingleResult.scripture, aiSingleResult.publish_date, true);
      toast.success("📖 Devotional published!");
      setAiSingleResult(null);
      setAiSingleTopic("");
      setAiSingleScripture("");
      setActiveTab("all");
      loadDevotionals();
    } catch { toast.error("Failed to save"); }
    finally { setIsSubmitting(false); }
  };

  const handleBulkGenerate = async () => {
    if (!bulkTheme.trim()) { toast.error("Enter a series theme"); return; }
    setBulkLoading(true);
    setBulkResults([]);
    setBulkProgress(0);
    try {
      const batchSize = 7;
      const batches = Math.ceil(bulkCount / batchSize);
      let allResults: GeneratedDevotional[] = [];
      for (let i = 0; i < batches; i++) {
        const batchCount = Math.min(batchSize, bulkCount - i * batchSize);
        const batchStartDate = addDays(bulkStartDate, i * batchSize);
        const prompt = `Series Theme: "${bulkTheme}"\nGenerate exactly ${batchCount} devotionals.\n${bulkTopics ? `Key topics to cover: ${bulkTopics}` : ""}\nStarting from day ${i * batchSize + 1} of the series.\nMake each devotional unique with different scriptures.`;
        const res = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, type: "devotional-bulk" }),
        });
        const data = await res.json();
        if (data.error) { toast.error(data.error); setBulkLoading(false); return; }
        const parsed = parseDevotionals(data.result, batchStartDate);
        allResults = [...allResults, ...parsed];
        setBulkProgress(Math.round(((i + 1) / batches) * 100));
        setBulkResults([...allResults]);
      }
      toast.success(`🤖 ${allResults.length} devotionals generated!`);
    } catch { toast.error("Bulk generation failed"); }
    finally { setBulkLoading(false); setBulkProgress(100); }
  };

  const toggleBulkApproval = (index: number) => {
    setBulkResults((prev) => prev.map((d, i) => i === index ? { ...d, approved: !d.approved } : d));
  };

  const approveAll = () => {
    setBulkResults((prev) => prev.map((d) => ({ ...d, approved: true })));
    toast.success("✅ All approved!");
  };

  const saveApprovedBulk = async () => {
    const approved = bulkResults.filter((d) => d.approved);
    if (approved.length === 0) { toast.error("Approve at least one devotional"); return; }
    setIsSavingBulk(true);
    try {
      const supabase = createClient();
      const payload = approved.map((d) => ({
        title: d.title, scripture: d.scripture, body: d.body,
        prayer_point: d.prayer_point || null, confession: d.confession || null,
        publish_date: d.publish_date, is_published: true,
      }));
      await supabase.from("tfam_devotionals").insert(payload);
      const todayDev = approved.find((d) => d.publish_date === getLocalToday());
      if (todayDev) {
        await notifyAllMembers({
          title: "📖 New Daily Devotional",
          message: `${todayDev.title} — ${todayDev.scripture}. Read now and be blessed!`,
          type: "devotional",
          link: "/member/devotional",
        });
      }
      toast.success(`🎉 ${approved.length} devotionals scheduled!`);
      setBulkResults([]);
      setBulkTheme("");
      setBulkTopics("");
      setActiveTab("all");
      loadDevotionals();
    } catch { toast.error("Failed to save"); }
    finally { setIsSavingBulk(false); }
  };

  const togglePublish = async (id: string, current: boolean) => {
    try {
      const supabase = createClient();
      await supabase.from("tfam_devotionals").update({ is_published: !current }).eq("id", id);
      setDevotionals((prev) => prev.map((d) => d.id === id ? { ...d, is_published: !current } : d));
      const dev = devotionals.find((d) => d.id === id);
      if (dev && !current && dev.publish_date === getLocalToday()) {
        await notifyAllMembers({
          title: "📖 New Daily Devotional",
          message: `${dev.title} — ${dev.scripture}. Read now and be blessed!`,
          type: "devotional",
          link: "/member/devotional",
        });
      }
      toast.success(current ? "Unpublished" : "✅ Published!");
    } catch { toast.error("Failed"); }
  };

  const deleteDevotional = async (id: string) => {
    if (!confirm("Delete this devotional?")) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_devotionals").delete().eq("id", id);
      setDevotionals((prev) => prev.filter((d) => d.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  const openEdit = (d: Devotional) => {
    setFormData({
      title: d.title, scripture: d.scripture, body: d.body,
      prayer_point: d.prayer_point || "", confession: d.confession || "",
      publish_date: d.publish_date, is_published: d.is_published,
    });
    setEditingId(d.id);
    setActiveTab("write");
  };

  const todayStr = getLocalToday();
  const todayDevotional = devotionals.find((d) => d.publish_date === todayStr && d.is_published);

  const TABS = [
    { id: "all", label: "📋 All", count: devotionals.length },
    { id: "write", label: "✏️ Write", count: null },
    { id: "ai-single", label: "🤖 AI Single", count: null },
    { id: "ai-bulk", label: "🚀 AI Bulk", count: null },
  ];

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading devotionals..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Brand Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Daily Devotionals</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-2 leading-tight">
            Devotional Management
          </h1>
          <p className="text-brand-purple-100 text-sm mb-4">
            Write manually or use AI to generate and schedule devotionals.
          </p>
          <div className="flex flex-wrap gap-4 pt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{devotionals.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Total</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{devotionals.filter((d) => d.is_published).length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Published</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{devotionals.filter((d) => d.publish_date > todayStr).length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Scheduled</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{todayDevotional ? "✅" : "❌"}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── No Devotional Today Alert ── */}
      {!todayDevotional && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-red-400/60 p-5 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-400 via-red-500 to-red-400" />
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-3xl animate-pulse">⚠️</div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-white text-base">No devotional for today!</p>
              <p className="text-brand-purple-200 text-sm">Members need their daily word.</p>
            </div>
            <button
              onClick={() => setActiveTab("ai-single")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-xs flex-shrink-0 shadow-gold active:scale-95 transition-all"
            >
              🤖 Generate Now
            </button>
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ActiveTab)}
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-black transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                : "bg-brand-purple-950/60 text-white border border-brand-gold-400/40"
            }`}
          >
            {tab.label}
            {tab.count !== null && ` (${tab.count})`}
          </button>
        ))}
      </div>

      {/* ── ALL DEVOTIONALS TAB ── */}
      {activeTab === "all" && (
        <div className="space-y-3">
          {devotionals.length === 0 ? (
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <div className="text-4xl mb-4">📖</div>
              <h3 className="font-heading text-xl font-bold text-white mb-2">No devotionals yet</h3>
              <p className="text-brand-purple-200 mb-4">Use AI Bulk Generator to create 30 days in minutes!</p>
              <button
                onClick={() => setActiveTab("ai-bulk")}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all"
              >
                🚀 Generate Bulk Devotionals
              </button>
            </div>
          ) : (
            devotionals.map((d) => (
              <div
                key={d.id}
                className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${
                  d.publish_date === todayStr ? "border-brand-gold-400" : "border-brand-gold-400/40"
                } p-5 shadow-xl`}
              >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                <div className="mb-3">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {d.publish_date === todayStr && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900">
                        TODAY
                      </span>
                    )}
                    {d.publish_date > todayStr && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-400/40">
                        SCHEDULED
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black border ${
                      d.is_published
                        ? "bg-green-500/20 text-green-300 border-green-400/40"
                        : "bg-brand-purple-950/60 text-white/80 border-brand-gold-400/40"
                    }`}>
                      {d.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="font-black text-white text-base">{d.title}</p>
                  <p className="text-brand-purple-200 font-bold text-sm">{d.scripture}</p>
                  <p className="text-brand-purple-200 text-xs mt-1">📅 {formatDate(d.publish_date)}</p>
                  <p className="text-white font-semibold text-sm mt-2 line-clamp-2">{d.body}</p>
                </div>
                <div className="flex flex-col gap-2 pt-3 border-t border-brand-gold-400/30">
                  <button
                    onClick={() => openEdit(d)}
                    className="w-full py-2.5 rounded-xl bg-white text-brand-purple-900 text-xs font-black active:scale-95 transition-all"
                  >
                    ✏️ Edit Devotional
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => togglePublish(d.id, d.is_published)}
                      className={`py-2 rounded-xl text-xs font-bold border ${
                        d.is_published
                          ? "bg-brand-purple-950/60 text-white border-brand-gold-400/30"
                          : "bg-green-600 text-white border-green-500"
                      }`}
                    >
                      {d.is_published ? "📤 Unpublish" : "✅ Publish"}
                    </button>
                    <button
                      onClick={() => deleteDevotional(d.id)}
                      className="py-2 rounded-xl bg-red-600 text-white text-xs font-black active:scale-95 transition-all"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── WRITE MANUALLY TAB ── */}
      {activeTab === "write" && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <h2 className="font-heading text-base font-black text-white mb-4">
            ✏️ {editingId ? "Edit Devotional" : "Write Devotional"}
          </h2>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-white/80 mb-2">Title <span className="text-red-400">*</span></label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Walking in Victory" required
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
            </div>
            <div>
              <label className="block text-xs font-black text-white/80 mb-2">Scripture <span className="text-red-400">*</span></label>
              <input type="text" value={formData.scripture} onChange={(e) => setFormData({ ...formData, scripture: e.target.value })}
                placeholder="e.g. Romans 8:37" required
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
            </div>
            <div>
              <label className="block text-xs font-black text-white/80 mb-2">Message <span className="text-red-400">*</span></label>
              <textarea value={formData.body} onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                rows={6} placeholder="Write the devotional message..." required
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none resize-none font-semibold" />
            </div>
            <div>
              <label className="block text-xs font-black text-white/80 mb-2">Prayer Point</label>
              <textarea value={formData.prayer_point} onChange={(e) => setFormData({ ...formData, prayer_point: e.target.value })}
                rows={3} placeholder="Lord, I thank you for..."
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none resize-none font-semibold" />
            </div>
            <div>
              <label className="block text-xs font-black text-white/80 mb-2">Confession / Declaration</label>
              <textarea value={formData.confession} onChange={(e) => setFormData({ ...formData, confession: e.target.value })}
                rows={2} placeholder="I declare that..."
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none resize-none font-semibold" />
            </div>
            <div>
              <label className="block text-xs font-black text-white/80 mb-2">Publish Date</label>
              <input type="date" value={formData.publish_date} onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold" />
            </div>
            <div>
              <label
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setFormData({ ...formData, is_published: !formData.is_published })}
              >
                <div className={`relative w-12 h-6 rounded-full transition-colors ${formData.is_published ? "bg-green-500" : "bg-brand-purple-950/80"}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${formData.is_published ? "translate-x-7" : "translate-x-1"}`} />
                </div>
                <span className="text-sm font-black text-white">
                  {formData.is_published ? "Publish Now" : "Save as Draft"}
                </span>
              </label>
            </div>
            <div className="flex flex-col gap-2 pt-4">
              <button type="submit" disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50">
                {isSubmitting ? "Saving..." : editingId ? "✅ Update Devotional" : "📖 Save Devotional"}
              </button>
              <button type="button" onClick={() => { setFormData(EMPTY_FORM); setEditingId(null); }}
                className="w-full py-4 rounded-xl bg-brand-purple-950/60 text-white font-bold border border-brand-gold-400/40">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── AI SINGLE TAB ── */}
      {activeTab === "ai-single" && (
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-purple-950/80 border border-brand-gold-400/40 flex items-center justify-center text-xl">🤖</div>
              <div>
                <h2 className="font-heading text-base font-black text-white">AI Single Devotional</h2>
                <p className="text-brand-purple-200 text-xs">Generate one powerful devotional with AI</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-white/80 mb-2">Topic / Theme <span className="text-red-400">*</span></label>
                <input type="text" value={aiSingleTopic} onChange={(e) => setAiSingleTopic(e.target.value)}
                  placeholder="e.g. Trusting God in difficult times"
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
              </div>
              <div>
                <label className="block text-xs font-black text-white/80 mb-2">Scripture (Optional)</label>
                <input type="text" value={aiSingleScripture} onChange={(e) => setAiSingleScripture(e.target.value)}
                  placeholder="e.g. Proverbs 3:5-6"
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
              </div>
              <div>
                <label className="block text-xs font-black text-white/80 mb-2">Publish Date</label>
                <input type="date" value={aiSingleDate} onChange={(e) => setAiSingleDate(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold" />
              </div>
              <button onClick={handleAiSingle} disabled={aiSingleLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50">
                {aiSingleLoading ? "🤖 Generating..." : "🤖 Generate Devotional"}
              </button>
            </div>
          </div>

          {aiSingleResult && (
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-green-400/60 p-5 shadow-xl">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-green-400 via-green-500 to-green-400" />
              <h3 className="font-heading text-base font-black text-white mb-4">✅ Generated — Review & Edit</h3>
              <div className="space-y-3">
                {[
                  { label: "Title", field: "title", rows: 0 },
                  { label: "Scripture", field: "scripture", rows: 0 },
                  { label: "Message", field: "body", rows: 6 },
                  { label: "Prayer Point", field: "prayer_point", rows: 3 },
                  { label: "Confession", field: "confession", rows: 2 },
                ].map((f) => (
                  <div key={f.field}>
                    <label className="block text-xs font-black text-white/80 mb-1 uppercase tracking-widest">
                      {f.label}
                    </label>
                    {f.rows === 0 ? (
                      <input
                        type="text"
                        value={(aiSingleResult as unknown as Record<string, string>)[f.field]}
                        onChange={(e) => setAiSingleResult({ ...aiSingleResult, [f.field]: e.target.value })}
                        className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold"
                      />
                    ) : (
                      <textarea
                        value={(aiSingleResult as unknown as Record<string, string>)[f.field]}
                        onChange={(e) => setAiSingleResult({ ...aiSingleResult, [f.field]: e.target.value })}
                        rows={f.rows}
                        className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none resize-none font-semibold"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <button onClick={saveAiSingle} disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50">
                  {isSubmitting ? "Publishing..." : "📖 Publish Devotional"}
                </button>
                <button onClick={() => setAiSingleResult(null)}
                  className="w-full py-4 rounded-xl bg-brand-purple-950/60 text-white font-bold border border-brand-gold-400/40">
                  🔄 Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── AI BULK TAB ── */}
      {activeTab === "ai-bulk" && (
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-purple-950/80 border border-brand-gold-400/40 flex items-center justify-center text-xl">🚀</div>
              <div>
                <h2 className="font-heading text-base font-black text-white">AI Bulk Generator</h2>
                <p className="text-brand-purple-200 text-xs">Generate 7, 14, or 30 devotionals at once!</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-white/80 mb-2">Series Theme <span className="text-red-400">*</span></label>
                <input type="text" value={bulkTheme} onChange={(e) => setBulkTheme(e.target.value)}
                  placeholder="e.g. 30 Days of Supernatural Victory"
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
              </div>
              <div>
                <label className="block text-xs font-black text-white/80 mb-2">How Many Devotionals?</label>
                <div className="grid grid-cols-4 gap-2">
                  {[7, 14, 21, 30].map((n) => (
                    <button key={n} onClick={() => setBulkCount(n)}
                      className={`py-3 rounded-xl font-black text-sm transition-all ${
                        bulkCount === n
                          ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                          : "bg-brand-purple-950/60 text-white border border-brand-gold-400/40"
                      }`}>
                      {n}d
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-white/80 mb-2">Starting Date</label>
                <input type="date" value={bulkStartDate} onChange={(e) => setBulkStartDate(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold" />
              </div>
              <div>
                <label className="block text-xs font-black text-white/80 mb-2">Key Topics (Optional)</label>
                <input type="text" value={bulkTopics} onChange={(e) => setBulkTopics(e.target.value)}
                  placeholder="e.g. Faith, Healing, Prosperity..."
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
              </div>
              {bulkLoading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white font-black">🤖 Generating devotionals...</span>
                    <span className="text-white font-black">{bulkProgress}%</span>
                  </div>
                  <div className="w-full bg-brand-purple-950/60 rounded-full h-3">
                    <div className="h-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 transition-all duration-500"
                      style={{ width: `${bulkProgress}%` }} />
                  </div>
                </div>
              )}
              <button onClick={handleBulkGenerate} disabled={bulkLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50">
                {bulkLoading ? `🤖 Generating ${bulkCount} Devotionals...` : `🚀 Generate ${bulkCount} Devotionals`}
              </button>
            </div>
          </div>

          {bulkResults.length > 0 && (
            <div className="space-y-4">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-green-400/60 p-5 shadow-xl">
                <div className="flex flex-col gap-3">
                  <p className="font-black text-white text-base">
                    🎉 {bulkResults.length} Devotionals Generated!
                  </p>
                  <p className="text-brand-purple-200 text-sm">
                    {bulkResults.filter((d) => d.approved).length} approved, {bulkResults.filter((d) => !d.approved).length} pending
                  </p>
                  <button onClick={approveAll}
                    className="w-full py-3 rounded-xl bg-green-600 text-white font-black active:scale-95 transition-all">
                    ✅ Approve All
                  </button>
                  <button onClick={saveApprovedBulk} disabled={isSavingBulk}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50">
                    {isSavingBulk ? "Scheduling..." : `📅 Schedule ${bulkResults.filter((d) => d.approved).length} Approved`}
                  </button>
                </div>
              </div>

              {bulkResults.map((d, index) => (
                <div key={index} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${d.approved ? "border-green-400/60" : "border-brand-gold-400/40"} p-5 shadow-xl`}>
                  <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r ${d.approved ? "from-green-400 via-green-500 to-green-400" : "from-brand-gold-300 via-brand-gold-400 to-brand-gold-500"}`} />
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-brand-purple-950/60 text-white border border-brand-gold-400/30">
                          Day {index + 1} — {formatDate(d.publish_date)}
                        </span>
                        {d.approved && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-green-500/20 text-green-300 border border-green-400/40">
                            ✅ Approved
                          </span>
                        )}
                      </div>
                      <p className="font-black text-white text-sm">{d.title || "Untitled"}</p>
                      <p className="text-brand-purple-200 text-xs">{d.scripture}</p>
                      <p className="text-white font-semibold text-xs mt-1 line-clamp-2">{d.body}</p>
                    </div>
                    <button
                      onClick={() => toggleBulkApproval(index)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                        d.approved
                          ? "bg-green-500/20 text-green-300 border border-green-400/40"
                          : "bg-brand-purple-950/60 text-white border border-brand-gold-400/40"
                      }`}
                    >
                      {d.approved ? "✅" : "Approve"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}