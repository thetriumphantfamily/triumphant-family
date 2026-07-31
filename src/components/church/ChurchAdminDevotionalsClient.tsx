// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN DEVOTIONALS CLIENT — AI-Powered Devotional Management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

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

  // Manual form
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // AI Single
  const [aiSingleTopic, setAiSingleTopic] = useState("");
  const [aiSingleScripture, setAiSingleScripture] = useState("");
  const [aiSingleDate, setAiSingleDate] = useState(getLocalToday());
  const [aiSingleLoading, setAiSingleLoading] = useState(false);
  const [aiSingleResult, setAiSingleResult] = useState<GeneratedDevotional | null>(null);

  // AI Bulk
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
    { id: "all", label: "📋 All Devotionals", count: devotionals.length },
    { id: "write", label: "✍️ Write Manually", count: null },
    { id: "ai-single", label: "🤖 AI Single", count: null },
    { id: "ai-bulk", label: "🚀 AI Bulk Generator", count: null },
  ];

  return (
    <div className="space-y-6">

      {/* ━━━ BRAND HEADER CARD ━━━ */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          {/* ✅ WHITE BOLD BIGGER BADGE */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">
              Daily Devotionals
            </span>
          </div>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            Devotional{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
              Management
            </span>
          </h1>
          <p className="text-brand-purple-100 text-sm md:text-base mb-4">
            Write manually or use AI to generate and schedule devotionals for your members
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
              <p className={`font-black text-2xl ${todayDevotional ? "text-green-400" : "text-red-400"}`}>{todayDevotional ? "✅" : "❌"}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today Alert */}
      {!todayDevotional && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-700 via-amber-600 to-amber-700 border-2 border-amber-400/60 p-5 shadow-xl">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-3xl animate-pulse">⚠️</div>
            <div className="flex-1">
              <p className="font-black text-white text-lg">No devotional for today!</p>
              <p className="text-white/80 text-sm font-semibold">Members need their daily word. Use AI to generate one now!</p>
            </div>
            <button onClick={() => setActiveTab("ai-single")}
              className="px-4 py-2 rounded-full bg-white text-amber-700 font-black text-sm hover:bg-white/90 transition-colors flex-shrink-0">
              🤖 Generate Now
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as ActiveTab)}
            className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === tab.id
              ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
              : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"}`}>
            {tab.label}
            {tab.count !== null && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? "bg-brand-purple-900/20" : "bg-gray-100"}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ━━━ TAB: ALL DEVOTIONALS ━━━ */}
      {activeTab === "all" && (
        <div className="space-y-3">
          {loading ? (
            <p className="text-center text-gray-500 py-10">Loading...</p>
          ) : devotionals.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">No devotionals yet</h3>
              <p className="text-gray-500 mb-4">Use AI Bulk Generator to create 30 days in minutes!</p>
              <button onClick={() => setActiveTab("ai-bulk")}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:scale-105 transition-all">
                🚀 Generate Bulk Devotionals
              </button>
            </div>
          ) : (
            devotionals.map((d) => (
              <div key={d.id} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${d.publish_date === todayStr ? "border-brand-gold-400" : "border-brand-gold-400/40"} p-5 shadow-xl`}>
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {d.publish_date === todayStr && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-brand-gold-400 text-brand-purple-900">TODAY</span>}
                      {d.publish_date > todayStr && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-400/40">SCHEDULED</span>}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black border ${d.is_published ? "bg-green-500/20 text-green-300 border-green-400/40" : "bg-gray-500/20 text-gray-300 border-gray-400/40"}`}>
                        {d.is_published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="font-black text-white text-lg">{d.title}</p>
                    <p className="text-brand-gold-300 font-bold text-sm">{d.scripture}</p>
                    <p className="text-brand-purple-200 font-semibold text-xs mt-1">📅 {formatDate(d.publish_date)}</p>
                    <p className="text-brand-purple-300 text-sm mt-2 line-clamp-2">{d.body}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-3 border-t border-brand-gold-400/30 mt-3 flex-wrap">
                  <button onClick={() => openEdit(d)} className="px-3 py-1.5 rounded-full bg-brand-gold-400/20 text-brand-gold-300 text-xs font-bold hover:bg-brand-gold-400/30 transition-colors">✏️ Edit</button>
                  <button onClick={() => togglePublish(d.id, d.is_published)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${d.is_published ? "bg-gray-500/20 text-gray-300" : "bg-green-500/20 text-green-300"}`}>
                    {d.is_published ? "📤 Unpublish" : "✅ Publish"}
                  </button>
                  <button onClick={() => deleteDevotional(d.id)} className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-300 text-xs font-bold">🗑️ Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ━━━ TAB: WRITE MANUALLY ━━━ */}
      {activeTab === "write" && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <h2 className="font-heading text-xl font-black text-white mb-6">
            ✍️ {editingId ? "Edit Devotional" : "Write Devotional"}
          </h2>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-black text-white mb-2">Title <span className="text-red-400">*</span></label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Walking in Victory" required
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
            </div>
            <div>
              <label className="block text-sm font-black text-white mb-2">Scripture <span className="text-red-400">*</span></label>
              <input type="text" value={formData.scripture} onChange={(e) => setFormData({ ...formData, scripture: e.target.value })}
                placeholder="e.g. Romans 8:37" required
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
            </div>
            <div>
              <label className="block text-sm font-black text-white mb-2">Message <span className="text-red-400">*</span></label>
              <textarea value={formData.body} onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                rows={6} placeholder="Write the devotional message..." required
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none resize-none font-semibold" />
            </div>
            <div>
              <label className="block text-sm font-black text-white mb-2">Prayer Point</label>
              <textarea value={formData.prayer_point} onChange={(e) => setFormData({ ...formData, prayer_point: e.target.value })}
                rows={3} placeholder="Lord, I thank you for..."
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none resize-none font-semibold" />
            </div>
            <div>
              <label className="block text-sm font-black text-white mb-2">Confession / Declaration</label>
              <textarea value={formData.confession} onChange={(e) => setFormData({ ...formData, confession: e.target.value })}
                rows={2} placeholder="I declare that..."
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none resize-none font-semibold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-black text-white mb-2">Publish Date</label>
                <input type="date" value={formData.publish_date} onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold" />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`relative w-12 h-6 rounded-full transition-colors ${formData.is_published ? "bg-green-500" : "bg-gray-500"}`}
                    onClick={() => setFormData({ ...formData, is_published: !formData.is_published })}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${formData.is_published ? "translate-x-7" : "translate-x-1"}`} />
                  </div>
                  <span className="text-sm font-black text-white">{formData.is_published ? "Publish Now" : "Save as Draft"}</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => { setFormData(EMPTY_FORM); setEditingId(null); }}
                className="px-6 py-3 rounded-full bg-brand-purple-950/60 text-white font-bold border border-brand-gold-400/40 hover:border-brand-gold-400 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting}
                className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all disabled:opacity-50">
                {isSubmitting ? "Saving..." : editingId ? "✅ Update Devotional" : "📖 Save Devotional"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ━━━ TAB: AI SINGLE ━━━ */}
      {activeTab === "ai-single" && (
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 shadow-xl">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-2xl">🤖</div>
              <div>
                <h2 className="font-heading text-xl font-black text-white">AI Single Devotional</h2>
                <p className="text-brand-purple-200 font-semibold text-sm">Generate one powerful devotional with AI</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-black text-white mb-2">Topic / Theme <span className="text-red-400">*</span></label>
                <input type="text" value={aiSingleTopic} onChange={(e) => setAiSingleTopic(e.target.value)}
                  placeholder="e.g. Trusting God in difficult times"
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
              </div>
              <div>
                <label className="block text-sm font-black text-white mb-2">Scripture (Optional)</label>
                <input type="text" value={aiSingleScripture} onChange={(e) => setAiSingleScripture(e.target.value)}
                  placeholder="e.g. Proverbs 3:5-6 (leave blank for AI to choose)"
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
              </div>
              <div>
                <label className="block text-sm font-black text-white mb-2">Publish Date</label>
                <input type="date" value={aiSingleDate} onChange={(e) => setAiSingleDate(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold" />
              </div>
              <button onClick={handleAiSingle} disabled={aiSingleLoading}
                className="w-full px-6 py-4 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100">
                {aiSingleLoading ? "🤖 Generating..." : "🤖 Generate Devotional"}
              </button>
            </div>
          </div>

          {aiSingleResult && (
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-green-400/60 p-6 shadow-xl">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-green-400 via-green-500 to-green-400" />
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">✅</span>
                <h3 className="font-heading text-lg font-black text-white">Generated — Review & Edit</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-black text-white mb-1 uppercase tracking-widest">Title</label>
                  <input type="text" value={aiSingleResult.title}
                    onChange={(e) => setAiSingleResult({ ...aiSingleResult, title: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-black" />
                </div>
                <div>
                  <label className="block text-xs font-black text-white mb-1 uppercase tracking-widest">Scripture</label>
                  <input type="text" value={aiSingleResult.scripture}
                    onChange={(e) => setAiSingleResult({ ...aiSingleResult, scripture: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-black text-white mb-1 uppercase tracking-widest">Message</label>
                  <textarea value={aiSingleResult.body}
                    onChange={(e) => setAiSingleResult({ ...aiSingleResult, body: e.target.value })}
                    rows={6} className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none resize-none font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-black text-white mb-1 uppercase tracking-widest">Prayer Point</label>
                  <textarea value={aiSingleResult.prayer_point}
                    onChange={(e) => setAiSingleResult({ ...aiSingleResult, prayer_point: e.target.value })}
                    rows={3} className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none resize-none font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-black text-white mb-1 uppercase tracking-widest">Confession</label>
                  <textarea value={aiSingleResult.confession}
                    onChange={(e) => setAiSingleResult({ ...aiSingleResult, confession: e.target.value })}
                    rows={2} className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none resize-none font-semibold" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setAiSingleResult(null)}
                  className="px-6 py-3 rounded-full bg-brand-purple-950/60 text-white font-bold border border-brand-gold-400/40 hover:border-brand-gold-400 transition-colors">
                  🔄 Regenerate
                </button>
                <button onClick={saveAiSingle} disabled={isSubmitting}
                  className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all disabled:opacity-50">
                  {isSubmitting ? "Publishing..." : "📖 Publish Devotional"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ━━━ TAB: AI BULK GENERATOR ━━━ */}
      {activeTab === "ai-bulk" && (
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 shadow-xl">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-2xl">🚀</div>
              <div>
                <h2 className="font-heading text-xl font-black text-white">AI Bulk Generator</h2>
                <p className="text-brand-purple-200 font-semibold text-sm">Generate 7, 14, or 30 devotionals at once and schedule them!</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-black text-white mb-2">Series Theme <span className="text-red-400">*</span></label>
                <input type="text" value={bulkTheme} onChange={(e) => setBulkTheme(e.target.value)}
                  placeholder="e.g. 30 Days of Supernatural Victory"
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
              </div>
              <div>
                <label className="block text-sm font-black text-white mb-2">How Many Devotionals?</label>
                <div className="flex gap-3">
                  {[7, 14, 21, 30].map((n) => (
                    <button key={n} onClick={() => setBulkCount(n)}
                      className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${bulkCount === n
                        ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                        : "bg-brand-purple-950/60 text-white border-2 border-brand-gold-400/40 hover:border-brand-gold-400"}`}>
                      {n} Days
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-black text-white mb-2">Starting Date</label>
                <input type="date" value={bulkStartDate} onChange={(e) => setBulkStartDate(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold" />
              </div>
              <div>
                <label className="block text-sm font-black text-white mb-2">Key Topics (Optional)</label>
                <input type="text" value={bulkTopics} onChange={(e) => setBulkTopics(e.target.value)}
                  placeholder="e.g. Faith, Healing, Prosperity, Prayer, Family..."
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
              </div>

              {bulkLoading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white font-black">🤖 Generating devotionals...</span>
                    <span className="text-brand-gold-400 font-black">{bulkProgress}%</span>
                  </div>
                  <div className="w-full bg-brand-purple-950/60 rounded-full h-3">
                    <div className="h-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 transition-all duration-500"
                      style={{ width: `${bulkProgress}%` }} />
                  </div>
                </div>
              )}

              <button onClick={handleBulkGenerate} disabled={bulkLoading}
                className="w-full px-6 py-4 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 text-lg">
                {bulkLoading ? `🤖 Generating ${bulkCount} Devotionals...` : `🚀 Generate ${bulkCount} Devotionals`}
              </button>
            </div>
          </div>

          {bulkResults.length > 0 && (
            <div className="space-y-4">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-green-400/60 p-5 shadow-xl">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-black text-white text-lg">🎉 {bulkResults.length} Devotionals Generated!</p>
                    <p className="text-white font-semibold text-sm">
                      {bulkResults.filter((d) => d.approved).length} approved, {bulkResults.filter((d) => !d.approved).length} pending review
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={approveAll}
                      className="px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-black text-sm transition-colors">
                      ✅ Approve All
                    </button>
                    <button onClick={saveApprovedBulk} disabled={isSavingBulk}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-sm shadow-gold hover:scale-105 transition-all disabled:opacity-50">
                      {isSavingBulk ? "Scheduling..." : `📅 Schedule ${bulkResults.filter((d) => d.approved).length} Approved`}
                    </button>
                  </div>
                </div>
              </div>

              {bulkResults.map((d, index) => (
                <div key={index} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${d.approved ? "border-green-400/60" : "border-brand-gold-400/40"} p-5 shadow-xl`}>
                  <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r ${d.approved ? "from-green-400 via-green-500 to-green-400" : "from-brand-gold-300 via-brand-gold-400 to-brand-gold-500"}`} />
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-brand-purple-950/60 text-white border border-brand-gold-400/30">
                          Day {index + 1} — {formatDate(d.publish_date)}
                        </span>
                        {d.approved && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-green-500/20 text-green-300 border border-green-400/40">✅ Approved</span>}
                      </div>
                      <p className="font-black text-white">{d.title || "Untitled"}</p>
                      <p className="text-brand-gold-300 font-bold text-sm">{d.scripture}</p>
                      <p className="text-brand-purple-300 text-sm mt-1 line-clamp-2">{d.body}</p>
                    </div>
                    <button onClick={() => toggleBulkApproval(index)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-black transition-all ${d.approved
                        ? "bg-green-500/20 text-green-300 border border-green-400/40 hover:bg-red-500/20 hover:text-red-300 hover:border-red-400/40"
                        : "bg-brand-purple-950/60 text-white border border-brand-gold-400/40 hover:bg-green-500/20 hover:text-green-300 hover:border-green-400/40"}`}>
                      {d.approved ? "✅ Approved" : "⬜ Approve"}
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