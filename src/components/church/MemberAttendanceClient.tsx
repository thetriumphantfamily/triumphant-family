// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER ATTENDANCE CLIENT — Self check-in with time control
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface ServiceTemplate {
  id: string;
  name: string;
  day_of_week: number;
  service_time: string;
  check_in_opens: string;
  check_in_closes: string;
  location: string;
  is_active: boolean;
}

interface Service {
  id: string;
  title: string;
  service_type: string;
  service_date: string;
  service_time: string | null;
  check_in_opens_at: string | null;
  check_in_closes_at: string | null;
  is_cancelled: boolean;
  location: string | null;
  template_id: string | null;
}

interface AttendanceRecord {
  id: string;
  service_id: string;
  member_id: string;
  checked_in_at: string;
  service?: {
    title: string;
    service_date: string;
    service_time: string | null;
  } | null;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(timeStr: string): string {
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

function getCurrentTimeString(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:00`;
}

function isWithinTimeWindow(opens: string, closes: string): boolean {
  const current = getCurrentTimeString();
  return current >= opens && current <= closes;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function MemberAttendanceClient() {
  const [loading, setLoading] = useState(true);
  const [memberId, setMemberId] = useState("");
  const [memberName, setMemberName] = useState("");
  const [todayService, setTodayService] = useState<Service | null>(null);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState<AttendanceRecord | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  useEffect(() => {
    loadEverything();
    // Refresh every 30 seconds to update time window status
    const interval = setInterval(loadEverything, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadEverything = async () => {
    let foundId = "";
    let foundName = "";

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
                foundName = parsed.full_name;
                if (parsed.id) foundId = parsed.id;
                break;
              }
            }
          } catch { /* ignore */ }
        }
      }
    } catch { /* ignore */ }

    setMemberId(foundId);
    setMemberName(foundName);

    if (!foundId) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const todayStr = getLocalToday();
    const todayDayOfWeek = new Date().getDay();

    // 1. Check if there's a service for today (created or auto-generate from template)
    let { data: existingService } = await supabase
      .from("tfam_services")
      .select("*")
      .eq("service_date", todayStr)
      .maybeSingle();

    // If no service for today, check if there's a template for today's day
    if (!existingService) {
      const { data: template } = await supabase
        .from("tfam_service_templates")
        .select("*")
        .eq("day_of_week", todayDayOfWeek)
        .eq("is_active", true)
        .maybeSingle();

      if (template) {
        // Auto-generate service from template
        const { data: newService } = await supabase
          .from("tfam_services")
          .insert({
            title: template.name,
            service_type: DAY_NAMES[template.day_of_week].toLowerCase(),
            service_date: todayStr,
            service_time: template.service_time,
            check_in_opens_at: template.check_in_opens,
            check_in_closes_at: template.check_in_closes,
            location: template.location,
            template_id: template.id,
            is_cancelled: false,
          })
          .select()
          .single();

        existingService = newService;
      }
    }

    setTodayService(existingService);

    // 2. Check if already checked in
    if (existingService) {
      const { data: attendance } = await supabase
        .from("tfam_attendance")
        .select("*")
        .eq("service_id", existingService.id)
        .eq("member_id", foundId)
        .maybeSingle();

      setAlreadyCheckedIn(attendance);
    }

    // 3. Load attendance history
    const { data: history } = await supabase
      .from("tfam_attendance")
      .select("*, service:tfam_services(title, service_date, service_time)")
      .eq("member_id", foundId)
      .order("checked_in_at", { ascending: false })
      .limit(20);

    setAttendanceHistory((history as AttendanceRecord[]) || []);
    setLoading(false);
  };

  const handleCheckIn = async () => {
    if (!todayService || !memberId) return;

    setIsCheckingIn(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tfam_attendance").insert({
        service_id: todayService.id,
        member_id: memberId,
        check_in_method: "self",
        checked_in_at: new Date().toISOString(),
      });

      if (error) {
        toast.error("Failed to check in");
        setIsCheckingIn(false);
        return;
      }

      toast.success("🎉 Checked in successfully! God bless you!");
      loadEverything();
    } catch {
      toast.error("Failed to check in");
    } finally {
      setIsCheckingIn(false);
    }
  };

  const firstName = memberName.split(" ")[0] || "";

  // Determine check-in status
  let checkInStatus: "open" | "closed" | "future" | "past" | "none" = "none";
  let statusMessage = "";

  if (todayService) {
    if (todayService.is_cancelled) {
      checkInStatus = "none";
      statusMessage = "This service has been cancelled";
    } else if (todayService.check_in_opens_at && todayService.check_in_closes_at) {
      const currentTime = getCurrentTimeString();
      if (currentTime < todayService.check_in_opens_at) {
        checkInStatus = "future";
        statusMessage = `Check-in opens at ${formatTime(todayService.check_in_opens_at)}`;
      } else if (currentTime > todayService.check_in_closes_at) {
        checkInStatus = "past";
        statusMessage = `Check-in closed at ${formatTime(todayService.check_in_closes_at)}`;
      } else {
        checkInStatus = "open";
        statusMessage = `Check-in is OPEN until ${formatTime(todayService.check_in_closes_at)}`;
      }
    }
  }

  // Calculate stats
  const totalAttended = attendanceHistory.length;
  const thisMonth = attendanceHistory.filter((a) => {
    if (!a.service?.service_date) return false;
    const d = new Date(a.service.service_date + "T12:00:00");
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">✅</div>
          <p className="text-gray-500">Loading attendance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Brand Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">
              Attendance
            </span>
          </div>
          <p className="text-white/80 font-semibold text-lg mb-1">
            {getGreeting()}{firstName ? `, ${firstName}` : ""}!
          </p>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            Service Attendance
          </h1>
          <p className="text-brand-purple-100 text-sm md:text-base">
            Check in when you attend service and track your presence
          </p>
          <div className="flex gap-6 pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{totalAttended}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Total</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{thisMonth}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">This Month</p>
            </div>
          </div>
        </div>
      </div>

      {/* TODAY'S SERVICE CARD */}
      {!todayService && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">📅</div>
          <h2 className="font-heading text-xl font-bold text-white mb-2">
            No Service Today
          </h2>
          <p className="text-brand-purple-200 text-sm">
            There is no service scheduled for today.
          </p>
        </div>
      )}

      {todayService && (
        <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${
          alreadyCheckedIn ? "border-green-400" :
          checkInStatus === "open" ? "border-brand-gold-400" :
          "border-brand-gold-400/40"
        } p-6 md:p-8 shadow-xl`}>
          <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${
            alreadyCheckedIn ? "from-green-400 via-green-500 to-green-400" :
            "from-brand-gold-300 via-brand-gold-400 to-brand-gold-500"
          }`} />

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
              <span className="text-brand-gold-300 text-xs font-black uppercase tracking-widest">
                📅 Today's Service
              </span>
            </div>

            {/* Service Info */}
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
              {todayService.title}
            </h2>

            <div className="space-y-1 mb-6">
              <p className="text-brand-purple-100 text-sm">
                📅 {formatDate(todayService.service_date)}
              </p>
              {todayService.service_time && (
                <p className="text-brand-purple-100 text-sm">
                  🕐 Service Time: <span className="font-bold text-white">{formatTime(todayService.service_time)}</span>
                </p>
              )}
              {todayService.location && (
                <p className="text-brand-purple-100 text-sm">
                  📍 {todayService.location}
                </p>
              )}
            </div>

            {/* CHECK-IN STATUS */}
            {alreadyCheckedIn ? (
              <div className="bg-green-500/20 border-2 border-green-400 rounded-2xl p-5 text-center">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-white font-black text-lg mb-1">
                  You&apos;re Checked In!
                </p>
                <p className="text-green-300 font-bold text-sm">
                  Checked in at {new Date(alreadyCheckedIn.checked_in_at).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-white/80 text-sm mt-2">
                  God bless you for coming! Enjoy the service. 🙏
                </p>
              </div>
            ) : todayService.is_cancelled ? (
              <div className="bg-red-500/20 border-2 border-red-400 rounded-2xl p-5 text-center">
                <div className="text-4xl mb-2">❌</div>
                <p className="text-white font-black text-lg">Service Cancelled</p>
                <p className="text-red-300 text-sm mt-1">
                  This service has been cancelled. Check back for updates.
                </p>
              </div>
            ) : checkInStatus === "open" ? (
              <div className="space-y-3">
                <div className="bg-brand-gold-400/20 border-2 border-brand-gold-400 rounded-2xl p-4 text-center">
                  <p className="text-white font-black text-sm">
                    ✅ {statusMessage}
                  </p>
                </div>
                <button
                  onClick={handleCheckIn}
                  disabled={isCheckingIn}
                  className="w-full px-6 py-5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-lg shadow-gold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isCheckingIn ? "Checking In..." : "✅ Check In Now"}
                </button>
              </div>
            ) : checkInStatus === "future" ? (
              <div className="bg-blue-500/20 border-2 border-blue-400/60 rounded-2xl p-5 text-center">
                <div className="text-4xl mb-2">⏰</div>
                <p className="text-white font-black text-base mb-1">
                  Check-in Not Yet Open
                </p>
                <p className="text-blue-300 text-sm">{statusMessage}</p>
              </div>
            ) : (
              <div className="bg-red-500/20 border-2 border-red-400/60 rounded-2xl p-5 text-center">
                <div className="text-4xl mb-2">⛔</div>
                <p className="text-white font-black text-base mb-1">
                  Check-in Closed
                </p>
                <p className="text-red-300 text-sm">{statusMessage}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ATTENDANCE HISTORY */}
      {attendanceHistory.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-lg">📋</div>
            <h2 className="font-heading text-xl font-bold text-brand-purple-900">Recent Attendance</h2>
          </div>

          <div className="space-y-2">
            {attendanceHistory.map((record) => (
              <div key={record.id} className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4 shadow-xl">
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-white truncate">
                      {record.service?.title || "Service"}
                    </p>
                    {record.service?.service_date && (
                      <p className="text-brand-purple-200 text-xs font-semibold">
                        📅 {formatDate(record.service.service_date)}
                      </p>
                    )}
                    <p className="text-brand-purple-300 text-xs">
                      ✅ Checked in at {new Date(record.checked_in_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-green-500/20 text-green-300 border border-green-400/40 flex-shrink-0">
                    ✅ Present
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}