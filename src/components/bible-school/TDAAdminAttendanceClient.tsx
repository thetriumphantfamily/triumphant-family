// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ADMIN ATTENDANCE CLIENT – Create sessions + notify students
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";
import { notifyAllTDAStudents } from "@/lib/tda-notifications";

interface Session {
  id: string;
  title: string;
  description: string | null;
  session_date: string;
  session_time: string | null;
  location: string | null;
  level: string | null;
  created_at: string;
}

interface Student {
  id: string;
  student_id: string;
  full_name: string;
  photo_url: string | null;
  level: string;
}

interface Attendance {
  id: string;
  session_id: string;
  student_id: string;
  status: string;
  marked_at: string;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function TDAAdminAttendanceClient() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [markingSession, setMarkingSession] = useState<Session | null>(null);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    title: "", description: "", session_date: "",
    session_time: "", location: "", level: "",
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const supabase = createClient();
      const [sessionsRes, studentsRes, attendanceRes] = await Promise.all([
        supabase.from("tda_sessions").select("*").order("session_date", { ascending: false }),
        supabase.from("tda_students").select("id, student_id, full_name, photo_url, level").eq("status", "approved").order("full_name", { ascending: true }),
        supabase.from("tda_attendance").select("*"),
      ]);
      setSessions(sessionsRes.data || []);
      setStudents(studentsRes.data || []);
      setAttendance(attendanceRes.data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", session_date: "", session_time: "", location: "", level: "" });
    setShowCreateForm(false);
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.session_date) { toast.error("Please enter title and date"); return; }
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tda_sessions").insert({
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        session_date: formData.session_date,
        session_time: formData.session_time || null,
        location: formData.location.trim() || null,
        level: formData.level || null,
      });
      if (error) { toast.error(`Failed: ${error.message}`); setIsSubmitting(false); return; }

      // ✅ NOTIFY ALL STUDENTS
      await notifyAllTDAStudents({
        title: "📅 New Class Session Scheduled",
        message: `${formData.title.trim()} on ${formatShortDate(formData.session_date)}${formData.session_time ? " at " + formData.session_time : ""}${formData.location ? " — " + formData.location : ""}. Mark your calendar!`,
        type: "attendance",
        link: "/bible-school/portal/attendance",
      });

      toast.success("✅ Session created and students notified!");
      resetForm();
      loadData();
    } catch { toast.error("Failed to create"); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?\n\nAll attendance records will also be deleted.`)) return;
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tda_sessions").delete().eq("id", id);
      if (error) { toast.error("Failed to delete"); setBusyId(null); return; }
      setSessions((prev) => prev.filter((s) => s.id !== id));
      setAttendance((prev) => prev.filter((a) => a.session_id !== id));
      toast.success("🗑️ Deleted");
    } catch { toast.error("Delete failed"); }
    finally { setBusyId(null); }
  };

  const openMarkAttendance = (session: Session) => {
    setMarkingSession(session);
    const sessionAttendance = attendance.filter((a) => a.session_id === session.id);
    const eligibleStudents = session.level ? students.filter((s) => s.level === session.level) : students;
    const map: Record<string, boolean> = {};
    eligibleStudents.forEach((student) => {
      const record = sessionAttendance.find((a) => a.student_id === student.id);
      map[student.id] = record?.status === "present";
    });
    setAttendanceMap(map);
  };

  const toggleAttendance = (studentId: string) => {
    setAttendanceMap({ ...attendanceMap, [studentId]: !attendanceMap[studentId] });
  };

  const markAllPresent = () => {
    const map: Record<string, boolean> = {};
    Object.keys(attendanceMap).forEach((id) => { map[id] = true; });
    setAttendanceMap(map);
  };

  const clearAll = () => {
    const map: Record<string, boolean> = {};
    Object.keys(attendanceMap).forEach((id) => { map[id] = false; });
    setAttendanceMap(map);
  };

  const saveAttendance = async () => {
    if (!markingSession) return;
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      await supabase.from("tda_attendance").delete().eq("session_id", markingSession.id);
      const records = Object.entries(attendanceMap).map(([studentId, isPresent]) => ({
        session_id: markingSession.id, student_id: studentId,
        status: isPresent ? "present" : "absent",
      }));
      const { error } = await supabase.from("tda_attendance").insert(records);
      if (error) { toast.error(`Failed: ${error.message}`); setIsSubmitting(false); return; }
      toast.success("✅ Attendance saved!");
      setMarkingSession(null);
      loadData();
    } catch { toast.error("Failed to save"); }
    finally { setIsSubmitting(false); }
  };

  const getAttendanceCount = (sessionId: string, sessionLevel: string | null) => {
    const sessionAttendance = attendance.filter((a) => a.session_id === sessionId);
    const eligibleStudents = sessionLevel ? students.filter((s) => s.level === sessionLevel) : students;
    const presentCount = sessionAttendance.filter((a) => a.status === "present").length;
    return { present: presentCount, total: eligibleStudents.length };
  };

  const eligibleStudentsForMarking = markingSession
    ? markingSession.level ? students.filter((s) => s.level === markingSession.level) : students
    : [];

  const presentCount = Object.values(attendanceMap).filter(Boolean).length;

  if (loading) return <LoadingScreen message="Loading attendance..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Page Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Attendance</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-1">
            ✅ Sessions & Attendance
          </h1>
          <p className="text-brand-purple-200 text-sm mb-4">
            Create sessions and mark attendance. Students notified automatically.
          </p>
          <button onClick={() => setShowCreateForm(true)}
            className="w-full md:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all">
            ➕ Create Session
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Sessions", value: sessions.length, border: "border-brand-gold-400/40" },
          { label: "Records", value: attendance.length, border: "border-brand-gold-400/40" },
          { label: "Total Present", value: attendance.filter((a) => a.status === "present").length, border: "border-green-400/40" },
        ].map((s) => (
          <div key={s.label} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${s.border} p-4 shadow-xl`}>
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-1">{s.label}</p>
            <p className="text-white font-black text-3xl">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Sessions List ── */}
      {sessions.length === 0 ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">✅</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">No sessions yet</h3>
          <p className="text-brand-purple-200 text-sm">Click &ldquo;Create Session&rdquo; to add your first session</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const { present, total } = getAttendanceCount(session.id, session.level);
            const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
            const isBusy = busyId === session.id;

            return (
              <div key={session.id} className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {session.level ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black border border-blue-400/40">Level {session.level}</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-purple-950/60 text-white text-xs font-black border border-brand-gold-400/40">All Levels</span>
                  )}
                </div>

                <h3 className="font-heading font-black text-white text-base mb-1">{session.title}</h3>
                {session.description && <p className="text-brand-purple-200 text-sm line-clamp-2 mb-2">{session.description}</p>}

                <div className="flex flex-wrap items-center gap-3 text-xs text-brand-purple-200 mb-3">
                  <span>📅 {formatDate(session.session_date)}</span>
                  {session.session_time && <span>🕐 {session.session_time}</span>}
                  {session.location && <span>📍 {session.location}</span>}
                </div>

                <div className="bg-brand-purple-950/60 rounded-xl p-3 border border-brand-gold-400/30 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-white uppercase tracking-widest">Attendance</span>
                    <span className="text-white font-black text-sm">{present} / {total} ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-brand-purple-950/80 rounded-full overflow-hidden border border-brand-gold-400/20">
                    <div className="h-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-3 border-t border-brand-gold-400/30">
                  <button onClick={() => openMarkAttendance(session)}
                    className="w-full py-2.5 rounded-xl bg-white text-brand-purple-900 text-xs font-black active:scale-95 transition-all">
                    ✏️ Mark Attendance
                  </button>
                  <button onClick={() => handleDelete(session.id, session.title)} disabled={isBusy}
                    className="w-full py-2.5 rounded-xl bg-red-600 text-white text-xs font-black disabled:opacity-50 active:scale-95 transition-all">
                    🗑️ Delete Session
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── CREATE SESSION MODAL ── */}
      {showCreateForm && (
        <>
          <div onClick={resetForm} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-lg pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-brand-purple-900">✅ Create Session</h2>
                  <button onClick={resetForm} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleCreate} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Session Title <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Prayer & Fasting Class" required
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What will be taught..." rows={3}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Session Date <span className="text-red-500">*</span></label>
                  <input type="date" value={formData.session_date} onChange={(e) => setFormData({ ...formData, session_date: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Session Time</label>
                  <input type="time" value={formData.session_time} onChange={(e) => setFormData({ ...formData, session_time: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Main Sanctuary"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">For Which Level</label>
                  <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white">
                    <option value="">All Levels</option>
                    <option value="100">Level 100 only</option>
                    <option value="200">Level 200 only</option>
                    <option value="300">Level 300 only</option>
                    <option value="400">Level 400 only</option>
                  </select>
                </div>
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <button type="submit" disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50">
                    {isSubmitting ? "Creating..." : "✅ Create & Notify Students"}
                  </button>
                  <button type="button" onClick={resetForm} className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-bold">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* ── MARK ATTENDANCE MODAL ── */}
      {markingSession && (
        <>
          <div onClick={() => setMarkingSession(null)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-lg pointer-events-auto max-h-[92vh] overflow-y-auto flex flex-col">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Mark Attendance</p>
                    <h2 className="font-heading text-lg font-bold text-brand-purple-900">{markingSession.title}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {formatShortDate(markingSession.session_date)}{markingSession.session_time && ` • ${markingSession.session_time}`}
                    </p>
                  </div>
                  <button onClick={() => setMarkingSession(null)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm font-black text-brand-purple-900">
                      {presentCount} of {eligibleStudentsForMarking.length} present
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={markAllPresent} className="px-3 py-2 rounded-xl bg-green-600 text-white text-xs font-black active:scale-95 transition-all">
                      ✅ All Present
                    </button>
                    <button onClick={clearAll} className="px-3 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold active:scale-95 transition-all">
                      ✕ Clear All
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {eligibleStudentsForMarking.length === 0 ? (
                  <div className="text-center py-10"><p className="text-gray-500">No approved students for this level</p></div>
                ) : (
                  <div className="space-y-2">
                    {eligibleStudentsForMarking.map((student) => {
                      const isPresent = attendanceMap[student.id] || false;
                      return (
                        <div key={student.id} onClick={() => toggleAttendance(student.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            isPresent ? "border-green-400 bg-green-50" : "border-gray-100 hover:border-gray-300"
                          }`}>
                          {student.photo_url ? (
                            <img src={student.photo_url} alt={student.full_name} className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-brand-purple-100 flex items-center justify-center text-brand-purple-900 font-black flex-shrink-0">
                              {student.full_name.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-brand-purple-900 truncate text-sm">{student.full_name}</p>
                            <p className="text-xs text-gray-500">{student.student_id} • Level {student.level}</p>
                          </div>
                          <div className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors flex-shrink-0 ${isPresent ? "bg-green-500" : "bg-gray-300"}`}>
                            <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${isPresent ? "translate-x-9" : "translate-x-1"}`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-white border-t-2 border-gray-100 p-5 rounded-b-3xl">
                <div className="flex flex-col gap-3">
                  <button onClick={saveAttendance} disabled={isSubmitting || eligibleStudentsForMarking.length === 0}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50">
                    {isSubmitting ? "Saving..." : "💾 Save Attendance"}
                  </button>
                  <button onClick={() => setMarkingSession(null)} className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-bold">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}