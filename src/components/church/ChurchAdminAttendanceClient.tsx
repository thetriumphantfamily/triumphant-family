// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN ATTENDANCE CLIENT — Track service attendance
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface Service {
  id: string;
  title: string;
  service_type: string;
  service_date: string;
  service_time: string | null;
  total_attendance: number;
  visitor_count: number;
  notes: string | null;
  created_at: string;
}

const SERVICE_TYPES = ["sunday", "wednesday", "friday", "special", "conference", "crusade", "prayer_meeting", "other"];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

const EMPTY_FORM = {
  title: "", service_type: "sunday", service_date: new Date().toISOString().split("T")[0],
  service_time: "", total_attendance: "", visitor_count: "", notes: "",
};

export default function ChurchAdminAttendanceClient() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase.from("tfam_services").select("*").order("service_date", { ascending: false });
      setServices(data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const resetForm = () => { setFormData(EMPTY_FORM); setShowForm(false); setEditingId(null); };

  const openEdit = (s: Service) => {
    setFormData({ title: s.title, service_type: s.service_type, service_date: s.service_date, service_time: s.service_time || "", total_attendance: s.total_attendance.toString(), visitor_count: s.visitor_count.toString(), notes: s.notes || "" });
    setEditingId(s.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.service_date) { toast.error("Title and date required"); return; }
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const payload = {
        title: formData.title.trim(), service_type: formData.service_type,
        service_date: formData.service_date, service_time: formData.service_time.trim() || null,
        total_attendance: Number(formData.total_attendance) || 0,
        visitor_count: Number(formData.visitor_count) || 0,
        notes: formData.notes.trim() || null,
      };
      if (editingId) {
        const { error } = await supabase.from("tfam_services").update(payload).eq("id", editingId);
        if (error) { toast.error(error.message); setIsSubmitting(false); return; }
        toast.success("✅ Updated!");
      } else {
        const { error } = await supabase.from("tfam_services").insert(payload);
        if (error) { toast.error(error.message); setIsSubmitting(false); return; }
        toast.success("✅ Service recorded!");
      }
      resetForm();
      loadServices();
    } catch (err) { toast.error("Failed"); }
    finally { setIsSubmitting(false); }
  };

  const deleteService = async (id: string) => {
    if (!confirm("Delete this service record?")) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_services").delete().eq("id", id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success("Deleted");
    } catch (err) { toast.error("Failed"); }
  };

  const totalAttendance = services.reduce((sum, s) => sum + s.total_attendance, 0);
  const avgAttendance = services.length > 0 ? Math.round(totalAttendance / services.length) : 0;

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">✅ Attendance Records</h1>
          <p className="text-gray-600 text-sm">Track attendance for every service and program</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:scale-105 transition-all">
          ➕ Record Service
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Services", value: services.length, icon: "⛪" },
          { label: "Total Attendance", value: totalAttendance, icon: "👥" },
          { label: "Average Per Service", value: avgAttendance, icon: "📊" },
        ].map((s) => (
          <div key={s.label} className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 flex items-center justify-center text-xl shadow-gold">{s.icon}</div>
              <div>
                <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold">{s.label}</p>
                <p className="text-white font-heading font-bold text-2xl">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Services List */}
      {services.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-4">⛪</div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">No services recorded yet</h3>
          <p className="text-gray-500">Record your first service attendance</p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.id} className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-brand-purple-950/60 text-brand-purple-200 border border-brand-gold-400/30 capitalize">{service.service_type.replace(/_/g, " ")}</span>
                  </div>
                  <p className="font-bold text-white text-lg">{service.title}</p>
                  <p className="text-brand-purple-200 text-sm">📅 {formatDate(service.service_date)}{service.service_time && ` at ${service.service_time}`}</p>
                  <div className="flex gap-4 mt-2">
                    <div className="text-center">
                      <p className="text-brand-gold-400 font-heading font-bold text-2xl">{service.total_attendance}</p>
                      <p className="text-brand-purple-300 text-xs">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-green-400 font-heading font-bold text-2xl">{service.visitor_count}</p>
                      <p className="text-brand-purple-300 text-xs">Visitors</p>
                    </div>
                  </div>
                  {service.notes && <p className="text-brand-purple-300 text-sm mt-2">📝 {service.notes}</p>}
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-brand-gold-400/30 mt-3">
                <button onClick={() => openEdit(service)} className="px-3 py-1.5 rounded-full bg-brand-gold-400/20 text-brand-gold-300 text-xs font-bold hover:bg-brand-gold-400/30 transition-colors">✏️ Edit</button>
                <button onClick={() => deleteService(service.id)} className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-300 text-xs font-bold hover:bg-red-500/30 transition-colors">🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <>
          <div onClick={resetForm} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-8 pointer-events-auto max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-bold text-brand-purple-900">✅ {editingId ? "Edit" : "Record"} Service</h2>
                  <button onClick={resetForm} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Service Title <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Sunday Service — July 31, 2026" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                    <select value={formData.service_type} onChange={(e) => setFormData({ ...formData, service_type: e.target.value })} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 capitalize">
                      {SERVICE_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Date <span className="text-red-500">*</span></label>
                    <input type="date" value={formData.service_date} onChange={(e) => setFormData({ ...formData, service_date: e.target.value })} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Total Attendance</label>
                    <input type="number" min="0" value={formData.total_attendance} onChange={(e) => setFormData({ ...formData, total_attendance: e.target.value })} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">First Timers</label>
                    <input type="number" min="0" value={formData.visitor_count} onChange={(e) => setFormData({ ...formData, visitor_count: e.target.value })} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Notes (Optional)</label>
                  <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none" />
                </div>
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button type="button" onClick={resetForm} className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:scale-105 transition-all disabled:opacity-50">
                    {isSubmitting ? "Saving..." : editingId ? "✅ Update" : "✅ Record Service"}
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