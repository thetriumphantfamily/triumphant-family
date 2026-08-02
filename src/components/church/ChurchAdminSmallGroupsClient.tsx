// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN SMALL GROUPS — Manage small groups (with View link)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface SmallGroup {
  id: string;
  name: string;
  description: string | null;
  category: string;
  leader_name: string | null;
  leader_phone: string | null;
  meeting_day: string | null;
  meeting_time: string | null;
  meeting_location: string | null;
  meeting_link: string | null;
  max_members: number | null;
  is_active: boolean;
  display_order: number;
  member_count?: number;
}

const CATEGORIES = [
  { value: "youth", label: "🎓 Youth" },
  { value: "women", label: "👩 Women" },
  { value: "men", label: "👨 Men" },
  { value: "couples", label: "💑 Couples" },
  { value: "prayer", label: "🙏 Prayer" },
  { value: "new", label: "🌱 New Members" },
  { value: "general", label: "⛪ General" },
];

const EMPTY_FORM = {
  name: "",
  description: "",
  category: "general",
  leader_name: "",
  leader_phone: "",
  meeting_day: "",
  meeting_time: "",
  meeting_location: "",
  meeting_link: "",
  max_members: "",
  is_active: true,
};

export default function ChurchAdminSmallGroupsClient() {
  const [groups, setGroups] = useState<SmallGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => { loadGroups(); }, []);

  const loadGroups = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tfam_small_groups")
        .select("*")
        .order("display_order");

      const groupsWithCounts = await Promise.all(
        (data || []).map(async (g) => {
          const { count } = await supabase
            .from("tfam_small_group_members")
            .select("id", { count: "exact", head: true })
            .eq("group_id", g.id);
          return { ...g, member_count: count || 0 };
        })
      );

      setGroups(groupsWithCounts);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setShowForm(false);
    setEditingId(null);
  };

  const openEdit = (g: SmallGroup) => {
    setFormData({
      name: g.name,
      description: g.description || "",
      category: g.category,
      leader_name: g.leader_name || "",
      leader_phone: g.leader_phone || "",
      meeting_day: g.meeting_day || "",
      meeting_time: g.meeting_time || "",
      meeting_location: g.meeting_location || "",
      meeting_link: g.meeting_link || "",
      max_members: g.max_members ? String(g.max_members) : "",
      is_active: g.is_active,
    });
    setEditingId(g.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error("Name required"); return; }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        category: formData.category,
        leader_name: formData.leader_name.trim() || null,
        leader_phone: formData.leader_phone.trim() || null,
        meeting_day: formData.meeting_day.trim() || null,
        meeting_time: formData.meeting_time.trim() || null,
        meeting_location: formData.meeting_location.trim() || null,
        meeting_link: formData.meeting_link.trim() || null,
        max_members: formData.max_members ? parseInt(formData.max_members) : null,
        is_active: formData.is_active,
      };

      if (editingId) {
        await supabase.from("tfam_small_groups").update(payload).eq("id", editingId);
        toast.success("✅ Updated!");
      } else {
        await supabase.from("tfam_small_groups").insert({ ...payload, display_order: groups.length + 1 });
        toast.success("✅ Group created!");
      }

      resetForm();
      loadGroups();
    } catch { toast.error("Failed"); }
    finally { setIsSubmitting(false); }
  };

  const deleteGroup = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" and all its members, announcements, meetings?`)) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_small_groups").delete().eq("id", id);
      setGroups((prev) => prev.filter((g) => g.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const supabase = createClient();
      await supabase.from("tfam_small_groups").update({ is_active: !current }).eq("id", id);
      setGroups((prev) => prev.map((g) => g.id === id ? { ...g, is_active: !current } : g));
      toast.success(current ? "Deactivated" : "Activated");
    } catch { toast.error("Failed"); }
  };

  const totalMembers = groups.reduce((sum, g) => sum + (g.member_count || 0), 0);
  const activeCount = groups.filter((g) => g.is_active).length;

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;

  return (
    <div className="space-y-6">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">Small Groups</span>
          </div>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            Small Groups Management
          </h1>
          <p className="text-brand-purple-100 text-sm md:text-base">
            Create and manage small groups for community fellowship
          </p>
          <div className="flex gap-6 pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{groups.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Groups</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{activeCount}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Active</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{totalMembers}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Members</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all">
          ➕ Create Group
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">No groups yet</h3>
          <p className="text-gray-500">Create your first small group</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((g) => (
            <div key={g.id} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl ${!g.is_active ? "opacity-60" : ""}`}>
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black border ${g.is_active ? "bg-green-500/20 text-green-300 border-green-400/40" : "bg-gray-500/20 text-gray-300 border-gray-400/40"}`}>
                      {g.is_active ? "Active" : "Inactive"}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-brand-purple-950/60 text-white border border-brand-gold-400/30 capitalize">
                      {g.category}
                    </span>
                  </div>
                  <p className="font-black text-white text-lg">{g.name}</p>
                  <p className="text-brand-gold-400 text-xs font-bold">
                    👥 {g.member_count} member{g.member_count !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {g.description && (
                <p className="text-white/80 font-semibold text-sm mb-3 line-clamp-2">{g.description}</p>
              )}

              <div className="space-y-1 text-xs text-brand-purple-200 mb-3">
                {g.leader_name && <p>👤 {g.leader_name}</p>}
                {g.meeting_day && g.meeting_time && <p>📅 {g.meeting_day} at {g.meeting_time}</p>}
                {g.meeting_location && <p>📍 {g.meeting_location}</p>}
              </div>

              {/* View Details Button — Primary Action */}
              <Link
                href={`/admin/church/small-groups/${g.id}`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-sm shadow-gold hover:scale-105 transition-all mb-2"
              >
                👥 Manage Group
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              {/* Secondary Actions */}
              <div className="flex gap-2 pt-3 border-t border-brand-gold-400/30 flex-wrap">
                <button onClick={() => openEdit(g)} className="px-3 py-1.5 rounded-full bg-brand-purple-950/60 text-white text-xs font-bold border border-brand-gold-400/30 hover:border-brand-gold-400/60 transition-colors">
                  ✏️ Edit Details
                </button>
                <button onClick={() => toggleActive(g.id, g.is_active)} className="px-3 py-1.5 rounded-full bg-brand-purple-950/60 text-white text-xs font-bold border border-brand-gold-400/30 hover:border-brand-gold-400/60 transition-colors">
                  {g.is_active ? "⏸️ Deactivate" : "▶️ Activate"}
                </button>
                <button onClick={() => deleteGroup(g.id, g.name)} className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-300 text-xs font-bold hover:bg-red-500/30 transition-colors">
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <>
          <div onClick={resetForm} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-8 pointer-events-auto max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-bold text-brand-purple-900">💬 {editingId ? "Edit" : "New"} Group</h2>
                  <button onClick={resetForm} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Group Name <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900">
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Leader Name</label>
                    <input type="text" value={formData.leader_name} onChange={(e) => setFormData({ ...formData, leader_name: e.target.value })} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Leader Phone</label>
                    <input type="tel" value={formData.leader_phone} onChange={(e) => setFormData({ ...formData, leader_phone: e.target.value })} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Meeting Day</label>
                    <input type="text" value={formData.meeting_day} onChange={(e) => setFormData({ ...formData, meeting_day: e.target.value })} placeholder="e.g. Saturday" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Meeting Time</label>
                    <input type="text" value={formData.meeting_time} onChange={(e) => setFormData({ ...formData, meeting_time: e.target.value })} placeholder="e.g. 4:00 PM" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Meeting Location</label>
                  <input type="text" value={formData.meeting_location} onChange={(e) => setFormData({ ...formData, meeting_location: e.target.value })} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Online Meeting Link (Optional)</label>
                  <input type="url" value={formData.meeting_link} onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })} placeholder="https://..." className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Max Members (Optional)</label>
                  <input type="number" min="1" value={formData.max_members} onChange={(e) => setFormData({ ...formData, max_members: e.target.value })} placeholder="Leave blank for unlimited" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button type="button" onClick={resetForm} className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all disabled:opacity-50">
                    {isSubmitting ? "Saving..." : editingId ? "✅ Update" : "💬 Create Group"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}