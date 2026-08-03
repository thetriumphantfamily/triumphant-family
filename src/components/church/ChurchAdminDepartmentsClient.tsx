// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN DEPARTMENTS CLIENT – Manage ministry departments
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "./LoadingScreen";

interface Department {
  id: string;
  name: string;
  description: string | null;
  leader_name: string | null;
  leader_phone: string | null;
  meeting_schedule: string | null;
  member_count: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export default function ChurchAdminDepartmentsClient() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "", description: "", leader_name: "", leader_phone: "",
    meeting_schedule: "", is_active: true,
  });

  useEffect(() => { loadDepartments(); }, []);

  const loadDepartments = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tfam_departments")
        .select("*")
        .order("display_order", { ascending: true });
      setDepartments(data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const resetForm = () => {
    setFormData({
      name: "", description: "", leader_name: "", leader_phone: "",
      meeting_schedule: "", is_active: true,
    });
    setShowForm(false);
    setEditingId(null);
  };

  const openEdit = (d: Department) => {
    setFormData({
      name: d.name, description: d.description || "",
      leader_name: d.leader_name || "", leader_phone: d.leader_phone || "",
      meeting_schedule: d.meeting_schedule || "", is_active: d.is_active,
    });
    setEditingId(d.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error("Department name required"); return; }
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        leader_name: formData.leader_name.trim() || null,
        leader_phone: formData.leader_phone.trim() || null,
        meeting_schedule: formData.meeting_schedule.trim() || null,
        is_active: formData.is_active,
      };
      if (editingId) {
        await supabase.from("tfam_departments").update(payload).eq("id", editingId);
        toast.success("✅ Updated!");
      } else {
        await supabase.from("tfam_departments").insert({
          ...payload, display_order: departments.length + 1,
        });
        toast.success("⛪ Department added!");
      }
      resetForm();
      loadDepartments();
    } catch { toast.error("Failed"); }
    finally { setIsSubmitting(false); }
  };

  const deleteDepartment = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" department?`)) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_departments").delete().eq("id", id);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const supabase = createClient();
      await supabase.from("tfam_departments").update({ is_active: !current }).eq("id", id);
      setDepartments((prev) =>
        prev.map((d) => d.id === id ? { ...d, is_active: !current } : d)
      );
      toast.success(current ? "Deactivated" : "Activated!");
    } catch { toast.error("Failed"); }
  };

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading departments..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Brand Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Departments</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-2 leading-tight">
            Ministry Departments
          </h1>
          <p className="text-brand-purple-100 text-sm">
            Manage ministry units, leaders, and schedules.
          </p>
          <div className="flex gap-4 pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{departments.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Total</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">
                {departments.filter((d) => d.is_active).length}
              </p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Add Button — full width mobile ── */}
      <button
        onClick={() => setShowForm(true)}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all"
      >
        ➕ Add Department
      </button>

      {/* ── Empty State ── */}
      {departments.length === 0 ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-4xl mb-4">⛪</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">No departments yet</h3>
          <p className="text-brand-purple-200 text-sm">Add your first ministry department.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl ${!dept.is_active ? "opacity-60" : ""}`}
            >
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

              {/* Badge + Name */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black border ${
                    dept.is_active
                      ? "bg-green-500/20 text-green-300 border-green-400/40"
                      : "bg-brand-purple-950/60 text-white/80 border-brand-gold-400/40"
                  }`}>
                    {dept.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="font-black text-white text-base">{dept.name}</p>
              </div>

              {dept.description && (
                <p className="text-white font-semibold text-sm mb-3">{dept.description}</p>
              )}

              <div className="space-y-1 text-xs text-brand-purple-200 font-semibold mb-3">
                {dept.leader_name && (
                  <p>👤 Leader: <span className="text-white font-bold">{dept.leader_name}</span></p>
                )}
                {dept.leader_phone && (
                  <p>📱 Phone: <span className="text-white font-bold">{dept.leader_phone}</span></p>
                )}
                {dept.meeting_schedule && (
                  <p>📅 Schedule: <span className="text-white font-bold">{dept.meeting_schedule}</span></p>
                )}
              </div>

              {/* Actions — full width stacked */}
              <div className="flex flex-col gap-2 pt-3 border-t border-brand-gold-400/30">
                <button
                  onClick={() => openEdit(dept)}
                  className="w-full py-2.5 rounded-xl bg-white text-brand-purple-900 text-xs font-black active:scale-95 transition-all"
                >
                  ✏️ Edit Department
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => toggleActive(dept.id, dept.is_active)}
                    className="py-2 rounded-xl bg-brand-purple-950/60 text-white text-xs font-bold border border-brand-gold-400/40"
                  >
                    {dept.is_active ? "⏸️ Deactivate" : "▶️ Activate"}
                  </button>
                  <button
                    onClick={() => deleteDepartment(dept.id, dept.name)}
                    className="py-2 rounded-xl bg-red-600 text-white text-xs font-black active:scale-95 transition-all"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Form Modal — KEEP bg-white — slides up mobile ── */}
      {showForm && (
        <>
          <div onClick={resetForm} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-lg pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-brand-purple-900">
                    ⛪ {editingId ? "Edit" : "Add"} Department
                  </h2>
                  <button
                    onClick={resetForm}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Department Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Worship & Choir"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="What this department does..."
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Leader Name</label>
                  <input
                    type="text"
                    value={formData.leader_name}
                    onChange={(e) => setFormData({ ...formData, leader_name: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Leader Phone</label>
                  <input
                    type="tel"
                    value={formData.leader_phone}
                    onChange={(e) => setFormData({ ...formData, leader_phone: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Meeting Schedule</label>
                  <input
                    type="text"
                    value={formData.meeting_schedule}
                    onChange={(e) => setFormData({ ...formData, meeting_schedule: e.target.value })}
                    placeholder="e.g. Saturdays at 4:00 PM"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                  />
                </div>
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : editingId ? "✅ Update Department" : "⛪ Add Department"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-bold"
                  >
                    Cancel
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