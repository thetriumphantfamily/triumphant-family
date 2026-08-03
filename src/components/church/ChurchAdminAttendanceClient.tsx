// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN ATTENDANCE – Templates + Services + Reschedule
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "./LoadingScreen";

interface ServiceTemplate {
  id: string;
  name: string;
  day_of_week: number;
  service_time: string;
  check_in_opens: string;
  check_in_closes: string;
  location: string;
  is_active: boolean;
  display_order: number;
}

interface Service {
  id: string;
  title: string;
  service_type: string;
  service_date: string;
  service_time: string | null;
  check_in_opens_at: string | null;
  check_in_closes_at: string | null;
  location: string | null;
  total_attendance: number;
  visitor_count: number;
  notes: string | null;
  is_cancelled: boolean;
  cancel_reason: string | null;
  template_id: string | null;
  created_at: string;
}

interface AttendanceRecord {
  id: string;
  member_id: string;
  checked_in_at: string;
  check_in_method: string;
  member?: { full_name: string; member_id: string } | null;
}

type ActiveTab = "services" | "templates";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short", year: "numeric", month: "short", day: "numeric",
  });
}

function formatTime(timeStr: string | null): string {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${m} ${period}`;
}

function getLocalToday(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export default function ChurchAdminAttendanceClient() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("services");
  const [services, setServices] = useState<Service[]>([]);
  const [templates, setTemplates] = useState<ServiceTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [attendees, setAttendees] = useState<AttendanceRecord[]>([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState({
    title: "", service_type: "sunday",
    service_date: getLocalToday(),
    service_time: "08:00", check_in_opens_at: "07:00",
    check_in_closes_at: "10:30",
    location: "1, Arifanla Bus Stop, Akute",
    notes: "", is_cancelled: false, cancel_reason: "",
  });
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [templateForm, setTemplateForm] = useState({
    name: "", day_of_week: 0, service_time: "08:00",
    check_in_opens: "07:00", check_in_closes: "10:30",
    location: "1, Arifanla Bus Stop, Akute", is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const supabase = createClient();
      const [servicesRes, templatesRes] = await Promise.all([
        supabase.from("tfam_services").select("*").order("service_date", { ascending: false }),
        supabase.from("tfam_service_templates").select("*").order("display_order"),
      ]);
      setServices(servicesRes.data || []);
      setTemplates(templatesRes.data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const loadAttendees = async (serviceId: string) => {
    setLoadingAttendees(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("tfam_attendance")
        .select("*, member:tfam_members(full_name, member_id)")
        .eq("service_id", serviceId)
        .order("checked_in_at", { ascending: false });
      setAttendees((data as AttendanceRecord[]) || []);
    } catch { toast.error("Failed to load"); }
    finally { setLoadingAttendees(false); }
  };

  const openServiceForm = (service?: Service) => {
    if (service) {
      setEditingServiceId(service.id);
      setServiceForm({
        title: service.title, service_type: service.service_type,
        service_date: service.service_date,
        service_time: service.service_time || "08:00",
        check_in_opens_at: service.check_in_opens_at || "07:00",
        check_in_closes_at: service.check_in_closes_at || "10:30",
        location: service.location || "1, Arifanla Bus Stop, Akute",
        notes: service.notes || "", is_cancelled: service.is_cancelled,
        cancel_reason: service.cancel_reason || "",
      });
    } else {
      setEditingServiceId(null);
      setServiceForm({
        title: "", service_type: "sunday",
        service_date: getLocalToday(), service_time: "08:00",
        check_in_opens_at: "07:00", check_in_closes_at: "10:30",
        location: "1, Arifanla Bus Stop, Akute",
        notes: "", is_cancelled: false, cancel_reason: "",
      });
    }
    setShowServiceForm(true);
  };

  const handleServiceSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title.trim()) { toast.error("Title required"); return; }
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const payload = {
        title: serviceForm.title.trim(), service_type: serviceForm.service_type,
        service_date: serviceForm.service_date, service_time: serviceForm.service_time,
        check_in_opens_at: serviceForm.check_in_opens_at,
        check_in_closes_at: serviceForm.check_in_closes_at,
        location: serviceForm.location.trim() || null,
        notes: serviceForm.notes.trim() || null,
        is_cancelled: serviceForm.is_cancelled,
        cancel_reason: serviceForm.cancel_reason.trim() || null,
      };
      if (editingServiceId) {
        await supabase.from("tfam_services").update(payload).eq("id", editingServiceId);
        toast.success("✅ Service updated!");
      } else {
        await supabase.from("tfam_services").insert(payload);
        toast.success("✅ Service created!");
      }
      setShowServiceForm(false);
      setEditingServiceId(null);
      loadAll();
    } catch { toast.error("Failed"); }
    finally { setIsSubmitting(false); }
  };

  const deleteService = async (id: string) => {
    if (!confirm("Delete this service and all its attendance records?")) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_services").delete().eq("id", id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      if (selectedService?.id === id) { setSelectedService(null); setAttendees([]); }
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  const toggleCancelService = async (service: Service) => {
    const newState = !service.is_cancelled;
    const reason = newState ? prompt("Reason for cancellation?") : null;
    if (newState && !reason) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_services").update({
        is_cancelled: newState, cancel_reason: reason || null,
      }).eq("id", service.id);
      loadAll();
      toast.success(newState ? "Service cancelled" : "Service restored");
    } catch { toast.error("Failed"); }
  };

  const openTemplateEdit = (t: ServiceTemplate) => {
    setEditingTemplateId(t.id);
    setTemplateForm({
      name: t.name, day_of_week: t.day_of_week,
      service_time: t.service_time, check_in_opens: t.check_in_opens,
      check_in_closes: t.check_in_closes, location: t.location,
      is_active: t.is_active,
    });
  };

  const handleTemplateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!templateForm.name.trim()) { toast.error("Name required"); return; }
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const payload = {
        name: templateForm.name.trim(), day_of_week: templateForm.day_of_week,
        service_time: templateForm.service_time,
        check_in_opens: templateForm.check_in_opens,
        check_in_closes: templateForm.check_in_closes,
        location: templateForm.location.trim(),
        is_active: templateForm.is_active,
      };
      if (editingTemplateId) {
        await supabase.from("tfam_service_templates").update(payload).eq("id", editingTemplateId);
        toast.success("✅ Template updated!");
      } else {
        await supabase.from("tfam_service_templates").insert({ ...payload, display_order: templates.length + 1 });
        toast.success("✅ Template created!");
      }
      setEditingTemplateId(null);
      setTemplateForm({ name: "", day_of_week: 0, service_time: "08:00", check_in_opens: "07:00", check_in_closes: "10:30", location: "1, Arifanla Bus Stop, Akute", is_active: true });
      loadAll();
    } catch { toast.error("Failed"); }
    finally { setIsSubmitting(false); }
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_service_templates").delete().eq("id", id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  const toggleTemplateActive = async (id: string, current: boolean) => {
    try {
      const supabase = createClient();
      await supabase.from("tfam_service_templates").update({ is_active: !current }).eq("id", id);
      setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, is_active: !current } : t));
      toast.success(current ? "Deactivated" : "Activated");
    } catch { toast.error("Failed"); }
  };

  const totalCheckIns = services.reduce((sum, s) => sum + s.total_attendance, 0);
  const todayService = services.find((s) => s.service_date === getLocalToday());

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading attendance..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Brand Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Attendance</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-2 leading-tight">
            Attendance Management
          </h1>
          <p className="text-brand-purple-100 text-sm">
            Manage service templates, create sessions, and view check-ins.
          </p>
          <div className="flex gap-4 flex-wrap pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{services.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Services</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{totalCheckIns}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Check-ins</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{todayService ? "✅" : "—"}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { id: "services", icon: "📅", label: "Services", sub: `${services.length} sessions` },
          { id: "templates", icon: "🔁", label: "Templates", sub: `${templates.length} templates` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ActiveTab)}
            className={`relative rounded-2xl overflow-hidden p-4 transition-all text-left ${
              activeTab === tab.id
                ? "bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400 shadow-xl"
                : "bg-gradient-to-br from-brand-violet-900/80 via-brand-purple-800/80 to-brand-purple-900/80 border-2 border-brand-gold-400/40"
            }`}
          >
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <div className="flex flex-col gap-2">
              <div className="w-10 h-10 rounded-xl bg-brand-purple-950/80 border border-brand-gold-400/40 flex items-center justify-center text-xl">
                {tab.icon}
              </div>
              <p className="font-black text-white text-sm">{tab.label}</p>
              <p className="text-brand-purple-200 text-xs">{tab.sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* ── SERVICES TAB ── */}
      {activeTab === "services" && (
        <div className="space-y-4">
          <button
            onClick={() => openServiceForm()}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all"
          >
            ➕ Create Special Service
          </button>

          {services.length === 0 ? (
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <div className="text-4xl mb-4">📅</div>
              <h3 className="font-heading text-xl font-bold text-white mb-2">No services yet</h3>
              <p className="text-brand-purple-200 text-sm">
                Services auto-create when members open attendance on template days.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {services.map((s) => (
                <div
                  key={s.id}
                  className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${
                    s.service_date === getLocalToday() ? "border-brand-gold-400" :
                    s.is_cancelled ? "border-red-400/60" : "border-brand-gold-400/40"
                  } p-5 shadow-xl`}
                >
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {s.service_date === getLocalToday() && !s.is_cancelled && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900">
                            TODAY
                          </span>
                        )}
                        {s.is_cancelled && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-red-500 text-white">
                            CANCELLED
                          </span>
                        )}
                        {s.template_id && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-400/40">
                            🔁 Auto
                          </span>
                        )}
                      </div>
                      <p className="font-black text-white text-base">{s.title}</p>
                      <p className="text-brand-purple-200 text-xs">📅 {formatDate(s.service_date)}</p>
                      {s.service_time && <p className="text-brand-purple-200 text-xs">🕐 {formatTime(s.service_time)}</p>}
                      {s.check_in_opens_at && s.check_in_closes_at && (
                        <p className="text-brand-purple-200 text-xs">
                          ⏰ {formatTime(s.check_in_opens_at)} - {formatTime(s.check_in_closes_at)}
                        </p>
                      )}
                      {s.cancel_reason && <p className="text-red-300 text-xs mt-1">❌ {s.cancel_reason}</p>}
                    </div>
                    <div className="text-center flex-shrink-0">
                      <p className="text-white font-black text-2xl">{s.total_attendance}</p>
                      <p className="text-brand-purple-200 text-xs font-semibold">Attended</p>
                    </div>
                  </div>

                  {/* Actions — full width stacked */}
                  <div className="flex flex-col gap-2 pt-3 border-t border-brand-gold-400/30">
                    <button
                      onClick={() => { setSelectedService(s); loadAttendees(s.id); }}
                      className="w-full py-2.5 rounded-xl bg-brand-purple-950/60 text-white text-xs font-black border border-brand-gold-400/40 active:scale-95 transition-all"
                    >
                      👥 View Attendees ({s.total_attendance})
                    </button>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => openServiceForm(s)}
                        className="py-2 rounded-xl bg-brand-purple-950/60 text-white text-xs font-bold border border-brand-gold-400/30"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => toggleCancelService(s)}
                        className="py-2 rounded-xl bg-brand-purple-950/60 text-white text-xs font-bold border border-brand-gold-400/30"
                      >
                        {s.is_cancelled ? "✅ Restore" : "❌ Cancel"}
                      </button>
                      <button
                        onClick={() => deleteService(s.id)}
                        className="py-2 rounded-xl bg-red-500/20 text-red-300 text-xs font-bold border border-red-400/40"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TEMPLATES TAB ── */}
      {activeTab === "templates" && (
        <div className="space-y-4">

          {/* Info Box */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-blue-400/40 p-4">
            <p className="text-white/80 text-sm">
              <strong className="text-white">💡 How Templates Work:</strong> Templates define your recurring services (like Sunday 8AM). When members open attendance on that day, the service auto-creates with correct times.
            </p>
          </div>

          {/* Template Form */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <h2 className="font-black text-white text-base mb-4">
              {editingTemplateId ? "✏️ Edit Template" : "➕ New Template"}
            </h2>
            <form onSubmit={handleTemplateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-white/80 mb-2">Service Name</label>
                <input
                  type="text"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                  placeholder="e.g. Sunday Worship Service"
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-white/80 mb-2">Day of Week</label>
                <select
                  value={templateForm.day_of_week}
                  onChange={(e) => setTemplateForm({ ...templateForm, day_of_week: parseInt(e.target.value) })}
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold"
                >
                  {DAY_NAMES.map((day, i) => <option key={i} value={i}>{day}</option>)}
                </select>
              </div>
              {/* Time fields — stacked on mobile */}
              <div>
                <label className="block text-xs font-black text-white/80 mb-2">Check-in Opens</label>
                <input
                  type="time"
                  value={templateForm.check_in_opens}
                  onChange={(e) => setTemplateForm({ ...templateForm, check_in_opens: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-white/80 mb-2">Service Time</label>
                <input
                  type="time"
                  value={templateForm.service_time}
                  onChange={(e) => setTemplateForm({ ...templateForm, service_time: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-white/80 mb-2">Check-in Closes</label>
                <input
                  type="time"
                  value={templateForm.check_in_closes}
                  onChange={(e) => setTemplateForm({ ...templateForm, check_in_closes: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-white/80 mb-2">Location</label>
                <input
                  type="text"
                  value={templateForm.location}
                  onChange={(e) => setTemplateForm({ ...templateForm, location: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold"
                />
              </div>
              <div className="flex flex-col gap-2">
                {editingTemplateId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTemplateId(null);
                      setTemplateForm({ name: "", day_of_week: 0, service_time: "08:00", check_in_opens: "07:00", check_in_closes: "10:30", location: "1, Arifanla Bus Stop, Akute", is_active: true });
                    }}
                    className="w-full py-3 rounded-xl bg-brand-purple-950/60 text-white font-bold border border-brand-gold-400/40"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingTemplateId ? "✅ Update Template" : "🔁 Create Template"}
                </button>
              </div>
            </form>
          </div>

          {/* Templates List */}
          {templates.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-white font-heading font-bold text-base">Existing Templates</h3>
              {templates.map((t) => (
                <div
                  key={t.id}
                  className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl ${!t.is_active ? "opacity-60" : ""}`}
                >
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                  <div className="mb-3">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black border ${
                        t.is_active
                          ? "bg-green-500/20 text-green-300 border-green-400/40"
                          : "bg-brand-purple-950/60 text-white/50 border-brand-gold-400/20"
                      }`}>
                        {t.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="font-black text-white text-base">{t.name}</p>
                    <p className="text-brand-purple-200 text-sm">
                      Every {DAY_NAMES[t.day_of_week]} at {formatTime(t.service_time)}
                    </p>
                    <p className="text-brand-purple-300 text-xs mt-1">
                      ⏰ Check-in: {formatTime(t.check_in_opens)} - {formatTime(t.check_in_closes)}
                    </p>
                    <p className="text-brand-purple-300 text-xs">📍 {t.location}</p>
                  </div>
                  <div className="flex flex-col gap-2 pt-3 border-t border-brand-gold-400/30">
                    <button
                      onClick={() => openTemplateEdit(t)}
                      className="w-full py-2.5 rounded-xl bg-brand-purple-950/60 text-white text-xs font-black border border-brand-gold-400/40"
                    >
                      ✏️ Edit Template
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => toggleTemplateActive(t.id, t.is_active)}
                        className="py-2 rounded-xl bg-brand-purple-950/60 text-white text-xs font-bold border border-brand-gold-400/30"
                      >
                        {t.is_active ? "⏸️ Deactivate" : "▶️ Activate"}
                      </button>
                      <button
                        onClick={() => deleteTemplate(t.id)}
                        className="py-2 rounded-xl bg-red-500/20 text-red-300 text-xs font-bold border border-red-400/40"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Service Form Modal — KEEP bg-white — slides up mobile ── */}
      {showServiceForm && (
        <>
          <div onClick={() => setShowServiceForm(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-lg pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-brand-purple-900">
                    📅 {editingServiceId ? "Edit Service" : "Create Service"}
                  </h2>
                  <button onClick={() => setShowServiceForm(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleServiceSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Service Title</label>
                  <input type="text" value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    placeholder="e.g. Special Vigil Service" required
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                  <input type="date" value={serviceForm.service_date} onChange={(e) => setServiceForm({ ...serviceForm, service_date: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Check-in Opens</label>
                  <input type="time" value={serviceForm.check_in_opens_at} onChange={(e) => setServiceForm({ ...serviceForm, check_in_opens_at: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Service Time</label>
                  <input type="time" value={serviceForm.service_time} onChange={(e) => setServiceForm({ ...serviceForm, service_time: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Check-in Closes</label>
                  <input type="time" value={serviceForm.check_in_closes_at} onChange={(e) => setServiceForm({ ...serviceForm, check_in_closes_at: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                  <input type="text" value={serviceForm.location} onChange={(e) => setServiceForm({ ...serviceForm, location: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Notes (Optional)</label>
                  <textarea value={serviceForm.notes} onChange={(e) => setServiceForm({ ...serviceForm, notes: e.target.value })}
                    rows={2} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none" />
                </div>
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <button type="submit" disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50">
                    {isSubmitting ? "Saving..." : editingServiceId ? "✅ Update Service" : "📅 Create Service"}
                  </button>
                  <button type="button" onClick={() => setShowServiceForm(false)}
                    className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-bold">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* ── Attendees Modal — KEEP bg-white — slides up mobile ── */}
      {selectedService && (
        <>
          <div onClick={() => { setSelectedService(null); setAttendees([]); }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-lg pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-lg font-bold text-brand-purple-900">👥 Attendees</h2>
                    <p className="text-gray-600 text-sm">{selectedService.title}</p>
                  </div>
                  <button onClick={() => { setSelectedService(null); setAttendees([]); }} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-5">
                {loadingAttendees ? (
                  <p className="text-center text-gray-500 py-8">Loading attendees...</p>
                ) : attendees.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">👥</div>
                    <p className="text-gray-500">No check-ins yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-brand-purple-900 font-bold text-sm mb-3">
                      Total: {attendees.length} member{attendees.length > 1 ? "s" : ""}
                    </p>
                    {attendees.map((a) => (
                      <div key={a.id} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-brand-purple-900 truncate text-sm">
                              {a.member?.full_name || "Unknown"}
                            </p>
                            <p className="text-xs text-brand-purple-600 font-semibold">
                              {a.member?.member_id || ""}
                            </p>
                          </div>
                          <span className="text-xs font-semibold text-gray-600 flex-shrink-0">
                            {new Date(a.checked_in_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}