// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER CELEBRATIONS CLIENT — Birthdays and anniversaries
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Member { id: string; full_name: string; photo_url: string | null; date_of_birth: string | null; department: string | null; }

export default function MemberCelebrationsClient() {
  const [todayBirthdays, setTodayBirthdays] = useState<Member[]>([]);
  const [thisWeekBirthdays, setThisWeekBirthdays] = useState<Member[]>([]);
  const [thisMonthBirthdays, setThisMonthBirthdays] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadBirthdays(); }, []);

  const loadBirthdays = async () => {
    try {
      const supabase = createClient();
      const { data: members } = await supabase.from("tfam_members").select("id, full_name, photo_url, date_of_birth, department").eq("status", "approved").not("date_of_birth", "is", null);

      if (!members) { setLoading(false); return; }

      const today = new Date();
      const todayMonth = today.getMonth() + 1;
      const todayDay = today.getDate();

      const todayList: Member[] = [];
      const weekList: Member[] = [];
      const monthList: Member[] = [];

      members.forEach((m) => {
        if (!m.date_of_birth) return;
        const dob = new Date(m.date_of_birth);
        const month = dob.getMonth() + 1;
        const day = dob.getDate();

        if (month === todayMonth && day === todayDay) {
          todayList.push(m);
        } else if (month === todayMonth) {
          const diff = day - todayDay;
          if (diff > 0 && diff <= 7) weekList.push(m);
          monthList.push(m);
        }
      });

      setTodayBirthdays(todayList);
      setThisWeekBirthdays(weekList);
      setThisMonthBirthdays(monthList);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const formatBirthday = (dob: string | null) => {
    if (!dob) return "";
    const d = new Date(dob);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  };

  if (loading) return <div className="min-h-[400px] flex items-center justify-center"><p className="text-gray-500">Loading celebrations...</p></div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">🎂 Celebrations</h1>
        <p className="text-gray-600 text-sm">Birthdays and special occasions in our church family</p>
      </div>

      {/* Today's Birthdays */}
      <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md overflow-hidden">
        <div className="bg-brand-gold-50 border-b-2 border-brand-gold-100 p-5">
          <h2 className="font-heading text-lg font-bold text-brand-purple-900 flex items-center gap-2">
            <span className="text-2xl">🎉</span> Today&rsquo;s Birthdays
          </h2>
        </div>
        <div className="p-5">
          {todayBirthdays.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No birthdays today</p>
          ) : (
            <div className="space-y-3">
              {todayBirthdays.map((m) => (
                <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-brand-gold-50 border-2 border-brand-gold-200">
                  {m.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.photo_url} alt={m.full_name} className="w-12 h-12 rounded-full object-cover border-2 border-brand-gold-400" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-brand-gold-400 flex items-center justify-center text-brand-purple-900 font-bold">{m.full_name.charAt(0)}</div>
                  )}
                  <div>
                    <p className="font-bold text-brand-purple-900">{m.full_name} 🎂</p>
                    {m.department && <p className="text-xs text-gray-500">{m.department}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* This Week */}
      {thisWeekBirthdays.length > 0 && (
        <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md overflow-hidden">
          <div className="bg-blue-50 border-b-2 border-blue-100 p-5">
            <h2 className="font-heading text-lg font-bold text-brand-purple-900 flex items-center gap-2">
              <span className="text-2xl">📅</span> Coming This Week
            </h2>
          </div>
          <div className="p-5 space-y-2">
            {thisWeekBirthdays.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-xl border-2 border-gray-100">
                <div className="flex items-center gap-3">
                  {m.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.photo_url} alt={m.full_name} className="w-10 h-10 rounded-full object-cover border-2 border-brand-gold-400" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-gold-400 flex items-center justify-center text-brand-purple-900 font-bold text-sm">{m.full_name.charAt(0)}</div>
                  )}
                  <p className="font-bold text-brand-purple-900 text-sm">{m.full_name}</p>
                </div>
                <p className="text-xs text-brand-gold-600 font-bold">{formatBirthday(m.date_of_birth)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* This Month */}
      {thisMonthBirthdays.length > 0 && (
        <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md overflow-hidden">
          <div className="bg-green-50 border-b-2 border-green-100 p-5">
            <h2 className="font-heading text-lg font-bold text-brand-purple-900 flex items-center gap-2">
              <span className="text-2xl">🗓️</span> This Month
            </h2>
          </div>
          <div className="p-5 space-y-2">
            {thisMonthBirthdays.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-xl border-2 border-gray-100">
                <p className="font-bold text-brand-purple-900 text-sm">{m.full_name}</p>
                <p className="text-xs text-gray-500">{formatBirthday(m.date_of_birth)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}