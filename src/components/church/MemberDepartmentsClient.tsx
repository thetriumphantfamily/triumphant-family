// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER DEPARTMENTS CLIENT — View church departments
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Department { id: string; name: string; description: string | null; leader_name: string | null; leader_phone: string | null; meeting_schedule: string | null; member_count: number; is_active: boolean; }

const DEPT_ICONS: Record<string, string> = {
  "Worship & Choir": "🎵",
  "Ushering": "🤝",
  "Media & Tech": "🎬",
  "Prayer Team": "🙏",
  "Children Ministry": "👶",
  "Youth Ministry": "🧑‍🤝‍🧑",
  "Evangelism & Outreach": "🌍",
  "Welfare & Hospitality": "💝",
};

export default function MemberDepartmentsClient() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [memberDept, setMemberDept] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDepartments(); }, []);

  const loadDepartments = async () => {
    try {
      const session = localStorage.getItem("tfam_member_session");
      if (session) {
        const sessionData = JSON.parse(session);
        setMemberDept(sessionData.department);
      }

      const supabase = createClient();
      const { data } = await supabase.from("tfam_departments").select("*").eq("is_active", true).order("display_order", { ascending: true });
      setDepartments(data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><p className="text-gray-500">Loading departments...</p></div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">⛪ Church Departments</h1>
        <p className="text-gray-600 text-sm">Explore ministry departments and find where to serve</p>
      </div>

      {memberDept && (
        <div className="bg-brand-gold-50 border-2 border-brand-gold-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⭐</span>
            <div>
              <p className="text-xs font-bold text-brand-gold-600 uppercase tracking-widest">Your Department</p>
              <p className="font-heading font-bold text-brand-purple-900 text-lg">{memberDept}</p>
            </div>
          </div>
        </div>
      )}

      {departments.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-4">⛪</div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">No departments yet</h3>
          <p className="text-gray-500">Departments will appear here once added by admin</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map((dept) => {
            const icon = DEPT_ICONS[dept.name] || "⛪";
            const isMyDept = memberDept === dept.name;

            return (
              <div key={dept.id} className={`bg-white rounded-2xl p-5 border-2 shadow-md transition-all ${isMyDept ? "border-brand-gold-400" : "border-gray-100"}`}>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-brand-purple-900">{dept.name}</h3>
                      {isMyDept && <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-gold-100 text-brand-gold-700 text-[10px] font-bold border border-brand-gold-300">My Dept</span>}
                    </div>
                    {dept.description && <p className="text-gray-600 text-sm mt-1">{dept.description}</p>}
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  {dept.leader_name && (
                    <p className="text-gray-700"><span className="font-semibold">Leader:</span> {dept.leader_name}</p>
                  )}
                  {dept.meeting_schedule && (
                    <p className="text-gray-700"><span className="font-semibold">Meetings:</span> {dept.meeting_schedule}</p>
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