// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER ATTENDANCE CLIENT — View personal church attendance
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Service { id: string; title: string; service_type: string; service_date: string; service_time: string | null; }
interface AttendanceRecord { id: string; service_id: string; checked_in_at: string; }
interface ServiceWithAttendance extends Service { attended: boolean; }

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
}

export default function MemberAttendanceClient() {
  const [services, setServices] = useState<ServiceWithAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAttendance(); }, []);

  const loadAttendance = async () => {
    try {
      const session = localStorage.getItem("tfam_member_session");
      if (!session) return;
      const sessionData = JSON.parse(session);
      const supabase = createClient();

      const [servicesRes, attendanceRes] = await Promise.all([
        supabase.from("tfam_services").select("*").order("service_date", { ascending: false }),
        supabase.from("tfam_attendance").select("*").eq("member_id", sessionData.id),
      ]);

      const combined: ServiceWithAttendance[] = (servicesRes.data || []).map((s) => ({
        ...s,
        attended: (attendanceRes.data || []).some((a) => a.service_id === s.id),
      }));

      setServices(combined);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const attendedCount = services.filter((s) => s.attended).length;
  const percentage = services.length > 0 ? Math.round((attendedCount / services.length) * 100) : 0;

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><p className="text-gray-500">Loading attendance...</p></div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">✅ My Attendance</h1>
        <p className="text-gray-600 text-sm">Track your church service attendance</p>
      </div>

      {/* Progress */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading text-lg font-bold text-white">🎯 Attendance Rate</h2>
          <span className="text-3xl font-bold text-brand-gold-400">{percentage}%</span>
        </div>
        <div className="w-full h-4 bg-brand-purple-950 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 rounded-full transition-all" style={{ width: `${percentage}%` }} />
        </div>
        <p className="text-brand-purple-100 text-sm mt-2">{attendedCount} of {services.length} services attended</p>
      </div>

      {/* Services List */}
      {services.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">No services recorded yet</h3>
          <p className="text-gray-500">Attendance records will appear here after services</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-purple-50 border-b-2 border-brand-purple-100">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-brand-purple-900 text-sm">Service</th>
                  <th className="text-left px-4 py-3 font-bold text-brand-purple-900 text-sm hidden md:table-cell">Date</th>
                  <th className="text-center px-4 py-3 font-bold text-brand-purple-900 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="font-bold text-brand-purple-900 text-sm">{service.title}</p>
                      <p className="text-gray-400 text-xs mt-1 md:hidden">{formatDate(service.service_date)}</p>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <p className="text-gray-700 text-sm">{formatDate(service.service_date)}</p>
                      {service.service_time && <p className="text-gray-500 text-xs">🕐 {service.service_time}</p>}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {service.attended ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-300">✅ Present</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-300">❌ Absent</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}