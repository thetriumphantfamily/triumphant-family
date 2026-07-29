// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ADMIN ATTENDANCE CLIENT — Create sessions, mark attendance
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

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
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
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

  // Marking attendance
  const [markingSession, setMarkingSession] = useState<Session | null>(null);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    session_date: "",
    session_time: "",
    location: "",
    level: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const supabase = createClient();

      const [sessionsRes, studentsRes, attendanceRes] = await Promise.all([
        supabase
          .from("tda_sessions")
          .select("*")
          .order("session_date", { ascending: false }),
        supabase
          .from("tda_students")
          .select("id, student_id, full_name, photo_url, level")
          .eq("status", "approved")
          .order("full_name", { ascending: true }),
        supabase.from("tda_attendance").select("*"),
      ]);

      setSessions(sessionsRes.data || []);
      setStudents(studentsRes.data || []);
      setAttendance(attendanceRes.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Load error:", err);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      session_date: "",
      session_time: "",
      location: "",
      level: "",
    });
    setShowCreateForm(false);
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.session_date) {
      toast.error("Please enter title and date");
      return;
    }

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

      if (error) {
        toast.error(`Failed: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      toast.success("✅ Session created!");
      resetForm();
      loadData();
      setIsSubmitting(false);
    } catch (err) {
      console.error("Create error:", err);
      toast.error("Failed to create");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?\n\nAll attendance records will also be deleted.`))
      return;

    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tda_sessions").delete().eq("id", id);

      if (error) {
        toast.error("Failed to delete");
        setBusyId(null);
        return;
      }

      setSessions((prev) => prev.filter((s) => s.id !== id));
      setAttendance((prev) => prev.filter((a) => a.session_id !== id));
      toast.success("🗑️ Deleted");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  const openMarkAttendance = (session: Session) => {
    setMarkingSession(session);

    // Pre-populate with existing attendance
    const sessionAttendance = attendance.filter((a) => a.session_id === session.id);
    const map: Record<string, boolean> = {};

    // Filter students by session level
    const eligibleStudents = session.level
      ? students.filter((s) => s.level === session.level)
      : students;

    eligibleStudents.forEach((student) => {
      const record = sessionAttendance.find((a) => a.student_id === student.id);
      map[student.id] = record?.status === "present";
    });

    setAttendanceMap(map);
  };

  const toggleAttendance = (studentId: string) => {
    setAttendanceMap({
      ...attendanceMap,
      [studentId]: !attendanceMap[studentId],
    });
  };

  const markAllPresent = () => {
    const map: Record<string, boolean> = {};
    Object.keys(attendanceMap).forEach((id) => {
      map[id] = true;
    });
    setAttendanceMap(map);
  };

  const clearAll = () => {
    const map: Record<string, boolean> = {};
    Object.keys(attendanceMap).forEach((id) => {
      map[id] = false;
    });
    setAttendanceMap(map);
  };

  const saveAttendance = async () => {
    if (!markingSession) return;

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Delete existing attendance for this session
      await supabase
        .from("tda_attendance")
        .delete()
        .eq("session_id", markingSession.id);

      // Insert new attendance records
      const records = Object.entries(attendanceMap).map(([studentId, isPresent]) => ({
        session_id: markingSession.id,
        student_id: studentId,
        status: isPresent ? "present" : "absent",
      }));

      const { error } = await supabase.from("tda_attendance").insert(records);

      if (error) {
        toast.error(`Failed: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      toast.success("✅ Attendance saved!");
      setMarkingSession(null);
      loadData();
      setIsSubmitting(false);
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save");
      setIsSubmitting(false);
    }
  };

  const getAttendanceCount = (sessionId: string, sessionLevel: string | null) => {
    const sessionAttendance = attendance.filter((a) => a.session_id === sessionId);
    const eligibleStudents = sessionLevel
      ? students.filter((s) => s.level === sessionLevel)
      : students;

    const presentCount = sessionAttendance.filter((a) => a.status === "present").length;
    return { present: presentCount, total: eligibleStudents.length };
  };

  const eligibleStudentsForMarking = markingSession
    ? markingSession.level
      ? students.filter((s) => s.level === markingSession.level)
      : students
    : [];

  const presentCount = Object.values(attendanceMap).filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Loading attendance...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">
            ✅ Sessions & Attendance
          </h1>
          <p className="text-gray-600 text-sm">
            Create class sessions and mark student attendance
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Create Session
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-md">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
            Total Sessions
          </p>
          <p className="text-3xl font-bold text-brand-purple-900">
            {sessions.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-md">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
            Total Records
          </p>
          <p className="text-3xl font-bold text-brand-purple-900">
            {attendance.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-green-200 shadow-md">
          <p className="text-xs text-green-600 uppercase font-semibold mb-1">
            Total Present
          </p>
          <p className="text-3xl font-bold text-green-600">
            {attendance.filter((a) => a.status === "present").length}
          </p>
        </div>
      </div>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-purple-100 mb-4">
            <svg
              className="w-10 h-10 text-brand-purple-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5"
              />
            </svg>
          </div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">
            No sessions yet
          </h3>
          <p className="text-gray-500">
            Click &ldquo;Create Session&rdquo; to add your first session
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => {
            const { present, total } = getAttendanceCount(session.id, session.level);
            const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
            const isBusy = busyId === session.id;

            return (
              <div
                key={session.id}
                className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {session.level ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                          Level {session.level}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
                          All Levels
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading font-bold text-brand-purple-900 text-lg mb-1">
                      {session.title}
                    </h3>

                    {session.description && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                        {session.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span>📅 {formatDate(session.session_date)}</span>
                      {session.session_time && <span>🕐 {session.session_time}</span>}
                      {session.location && <span>📍 {session.location}</span>}
                    </div>
                  </div>
                </div>

                {/* Attendance Summary */}
                <div className="p-3 bg-gray-50 rounded-xl mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">
                      Attendance
                    </span>
                    <span className="text-lg font-bold text-brand-purple-900">
                      {present} / {total} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => openMarkAttendance(session)}
                    className="flex-1 px-4 py-2 rounded-full bg-brand-purple-100 hover:bg-brand-purple-200 text-brand-purple-700 text-sm font-bold transition-all"
                  >
                    ✏️ Mark Attendance
                  </button>
                  <button
                    onClick={() => handleDelete(session.id, session.title)}
                    disabled={isBusy}
                    className="px-4 py-2 rounded-full bg-red-100 hover:bg-red-200 text-red-700 text-sm font-bold transition-all disabled:opacity-50"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ━━━ CREATE SESSION MODAL ━━━ */}
      {showCreateForm && (
        <>
          <div
            onClick={resetForm}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 pointer-events-auto max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-brand-purple-900">
                      ✅ Create Session
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Schedule a new class session
                    </p>
                  </div>
                  <button
                    onClick={resetForm}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreate} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Session Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. Prayer & Fasting Class"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="What will be taught in this session..."
                    rows={3}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Session Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.session_date}
                      onChange={(e) =>
                        setFormData({ ...formData, session_date: e.target.value })
                      }
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Session Time
                    </label>
                    <input
                      type="time"
                      value={formData.session_time}
                      onChange={(e) =>
                        setFormData({ ...formData, session_time: e.target.value })
                      }
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="e.g. Main Sanctuary"
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      For Which Level
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) =>
                        setFormData({ ...formData, level: e.target.value })
                      }
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
                    >
                      <option value="">All Levels</option>
                      <option value="100">Level 100 only</option>
                      <option value="200">Level 200 only</option>
                      <option value="300">Level 300 only</option>
                      <option value="400">Level 400 only</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Creating..." : "✅ Create Session"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* ━━━ MARK ATTENDANCE MODAL ━━━ */}
      {markingSession && (
        <>
          <div
            onClick={() => setMarkingSession(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 pointer-events-auto max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 z-10 rounded-t-3xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">
                      Mark Attendance
                    </p>
                    <h2 className="font-heading text-xl font-bold text-brand-purple-900">
                      {markingSession.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatShortDate(markingSession.session_date)}
                      {markingSession.session_time && ` • ${markingSession.session_time}`}
                    </p>
                  </div>
                  <button
                    onClick={() => setMarkingSession(null)}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Counter + Bulk Actions */}
                <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="p-3 bg-brand-purple-50 rounded-xl border-2 border-brand-purple-100 flex-1">
                    <p className="text-sm font-bold text-brand-purple-900">
                      {presentCount} of {eligibleStudentsForMarking.length} present
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={markAllPresent}
                      className="px-4 py-2 rounded-full bg-green-100 hover:bg-green-200 text-green-700 text-sm font-bold transition-all"
                    >
                      ✅ All Present
                    </button>
                    <button
                      onClick={clearAll}
                      className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition-all"
                    >
                      ✗ Clear All
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {eligibleStudentsForMarking.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">
                      No approved students for this level
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {eligibleStudentsForMarking.map((student) => {
                      const isPresent = attendanceMap[student.id] || false;

                      return (
                        <div
                          key={student.id}
                          onClick={() => toggleAttendance(student.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            isPresent
                              ? "border-green-400 bg-green-50"
                              : "border-gray-100 hover:border-gray-300"
                          }`}
                        >
                          {student.photo_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={student.photo_url}
                              alt={student.full_name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-brand-gold-400"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-brand-gold-400 flex items-center justify-center text-brand-purple-900 font-bold">
                              {student.full_name.charAt(0)}
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-brand-purple-900 truncate">
                              {student.full_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {student.student_id} • Level {student.level}
                            </p>
                          </div>

                          {/* Toggle Switch */}
                          <div
                            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors flex-shrink-0 ${
                              isPresent ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                                isPresent ? "translate-x-9" : "translate-x-1"
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="sticky bottom-0 bg-white border-t-2 border-gray-100 p-6 rounded-b-3xl">
                <div className="flex gap-3">
                  <button
                    onClick={() => setMarkingSession(null)}
                    className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveAttendance}
                    disabled={isSubmitting || eligibleStudentsForMarking.length === 0}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "💾 Save Attendance"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}