// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER DEPARTMENTS — Same as Small Groups but for ministry service units
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { notifyAdmin } from "@/lib/notifications";
import LoadingScreen from "./LoadingScreen";

interface Department {
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
  member_count?: number;
}

interface MyDept {
  group_id: string;
}

const DEPT_ICONS: Record<string, string> = {
  worship: "🎵",
  ushering: "🚪",
  media: "📱",
  prayer_team: "🙏",
  children: "👶",
  evangelism: "📣",
  welfare: "❤️",
  general: "⛪",
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function MemberDepartmentsClient() {
  const [loading, setLoading] = useState(true);
  const [memberId, setMemberId] = useState("");
  const [memberName, setMemberName] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [myDepts, setMyDepts] = useState<MyDept[]>([]);

  useEffect(() => { loadEverything(); }, []);

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

    try {
      const supabase = createClient();

      const { data: deptsData } = await supabase
        .from("tfam_small_groups")
        .select("*")
        .eq("is_active", true)
        .eq("group_type", "department")
        .order("display_order");

      const deptsWithCounts = await Promise.all(
        (deptsData || []).map(async (d) => {
          const { count } = await supabase
            .from("tfam_small_group_members")
            .select("id", { count: "exact", head: true })
            .eq("group_id", d.id);
          return { ...d, member_count: count || 0 };
        })
      );

      setDepartments(deptsWithCounts);

      if (foundId) {
        const { data: myDeptsData } = await supabase
          .from("tfam_small_group_members")
          .select("group_id")
          .eq("member_id", foundId);
        setMyDepts(myDeptsData || []);
      }
    } catch (err) { console.error(err); }

    setLoading(false);
  };

  const isJoined = (deptId: string) => {
    return myDepts.some((d) => d.group_id === deptId);
  };

  const joinDept = async (dept: Department) => {
    if (!memberId) { toast.error("Please login"); return; }

    try {
      const supabase = createClient();
      const { error } = await supabase.from("tfam_small_group_members").insert({
        group_id: dept.id,
        member_id: memberId,
      });

      if (error) { toast.error(error.message); return; }

      await notifyAdmin({
        title: "⛪ New Department Member",
        message: `${memberName || "A member"} just joined "${dept.name}" department.`,
        type: "department",
        link: "/admin/church/small-groups",
      });

      setMyDepts((prev) => [...prev, { group_id: dept.id }]);
      setDepartments((prev) => prev.map((d) => d.id === dept.id ? { ...d, member_count: (d.member_count || 0) + 1 } : d));
      toast.success(`🎉 Joined ${dept.name}!`);
    } catch { toast.error("Failed"); }
  };

  const leaveDept = async (dept: Department) => {
    if (!confirm(`Leave ${dept.name}?`)) return;

    try {
      const supabase = createClient();
      await supabase
        .from("tfam_small_group_members")
        .delete()
        .eq("group_id", dept.id)
        .eq("member_id", memberId);

      await notifyAdmin({
        title: "🚪 Member Left Department",
        message: `${memberName || "A member"} left "${dept.name}" department.`,
        type: "department",
        link: "/admin/church/small-groups",
      });

      setMyDepts((prev) => prev.filter((d) => d.group_id !== dept.id));
      setDepartments((prev) => prev.map((d) => d.id === dept.id ? { ...d, member_count: Math.max(0, (d.member_count || 0) - 1) } : d));
      toast.success("Left department");
    } catch { toast.error("Failed"); }
  };

  const firstName = memberName.split(" ")[0] || "";
  const myDeptCount = myDepts.length;

  if (loading) {
    return <LoadingScreen message="Loading departments..." />;
  }

  return (
    <div className="space-y-6">
      {/* Brand Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">Departments</span>
          </div>
          <p className="text-white/80 font-semibold text-lg mb-1">{getGreeting()}{firstName ? `, ${firstName}` : ""}!</p>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">Ministry Departments</h1>
          <p className="text-brand-purple-100 text-sm md:text-base">Find a department to serve in the house of God</p>
          <div className="flex gap-6 pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{departments.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Departments</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{myDeptCount}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Serving In</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-brand-gold-400/30">
            <p className="text-brand-purple-200 italic text-sm">&ldquo;As every man hath received the gift, even so minister the same one to another.&rdquo;</p>
            <p className="text-brand-purple-300 text-xs mt-1 font-semibold">— 1 Peter 4:10</p>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      {departments.length === 0 ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">⛪</div>
          <h2 className="font-heading text-xl font-bold text-white mb-2">No Departments Yet</h2>
          <p className="text-brand-purple-200 text-sm">Departments will be listed here soon</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map((dept) => {
            const joined = isJoined(dept.id);
            const icon = DEPT_ICONS[dept.category] || "⛪";

            return (
              <div key={dept.id} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${joined ? "border-green-400" : "border-brand-gold-400/40"} p-6 shadow-xl`}>
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-white text-lg">{dept.name}</h3>
                      {joined && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-green-500/20 text-green-300 border border-green-400/40">
                          ✅ Serving
                        </span>
                      )}
                    </div>
                    <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">
                      {dept.member_count} {dept.member_count === 1 ? "member" : "members"} serving
                    </p>
                  </div>
                </div>

                {dept.description && (
                  <p className="text-white/80 font-semibold text-sm mb-4 text-justify">{dept.description}</p>
                )}

                <div className="space-y-1.5 text-xs text-brand-purple-200 mb-4">
                  {dept.leader_name && <p>👤 Leader: <span className="text-white font-bold">{dept.leader_name}</span></p>}
                  {dept.leader_phone && (
                    <div className="flex gap-2 mt-2">
                      <a href={`tel:${dept.leader_phone}`} className="px-3 py-1 rounded-full bg-brand-purple-950/60 text-white text-xs font-bold border border-brand-gold-400/30 hover:border-brand-gold-400 transition-colors">📱 Call</a>
                      <a href={`https://wa.me/${dept.leader_phone.replace(/[^0-9]/g, "")}`} target="_blank" className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition-colors">💚 WhatsApp</a>
                    </div>
                  )}
                  {dept.meeting_day && dept.meeting_time && (
                    <p className="mt-2">📅 {dept.meeting_day} at <span className="text-white font-bold">{dept.meeting_time}</span></p>
                  )}
                  {dept.meeting_location && <p>📍 {dept.meeting_location}</p>}
                </div>

                <div className="flex flex-col gap-2 pt-3 border-t border-brand-gold-400/30">
                  {/* View Department Detail */}
                  {joined && (
                    <Link
                      href={`/member/community/${dept.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-sm shadow-gold hover:scale-105 transition-all"
                    >
                      ⛪ Open Department
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  )}

                  {joined ? (
                    <button onClick={() => leaveDept(dept)}
                      className="w-full px-4 py-2.5 rounded-full bg-brand-purple-950/60 text-white text-sm font-bold border border-brand-gold-400/40 hover:border-brand-gold-400 transition-all">
                      🚪 Leave Department
                    </button>
                  ) : (
                    <button onClick={() => joinDept(dept)}
                      className="w-full px-4 py-2.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-sm shadow-gold hover:scale-105 transition-all">
                      ✅ Join Department
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}