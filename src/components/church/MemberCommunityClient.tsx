// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER COMMUNITY — Small groups + join/leave + notify admin
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { notifyAdmin } from "@/lib/notifications";

interface SmallGroup {
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

interface MyGroup {
  group_id: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  youth: "🎓",
  women: "👩",
  men: "👨",
  couples: "💑",
  prayer: "🙏",
  new: "🌱",
  general: "⛪",
};

const CATEGORY_COLORS: Record<string, string> = {
  youth: "from-blue-500 to-blue-600",
  women: "from-pink-500 to-pink-600",
  men: "from-indigo-500 to-indigo-600",
  couples: "from-red-500 to-red-600",
  prayer: "from-purple-500 to-purple-600",
  new: "from-green-500 to-green-600",
  general: "from-amber-500 to-amber-600",
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function MemberCommunityClient() {
  const [loading, setLoading] = useState(true);
  const [memberId, setMemberId] = useState("");
  const [memberName, setMemberName] = useState("");
  const [groups, setGroups] = useState<SmallGroup[]>([]);
  const [myGroups, setMyGroups] = useState<MyGroup[]>([]);

  useEffect(() => {
    loadEverything();
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

    try {
      const supabase = createClient();

      const { data: groupsData } = await supabase
        .from("tfam_small_groups")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      const groupsWithCounts = await Promise.all(
        (groupsData || []).map(async (g) => {
          const { count } = await supabase
            .from("tfam_small_group_members")
            .select("id", { count: "exact", head: true })
            .eq("group_id", g.id);
          return { ...g, member_count: count || 0 };
        })
      );

      setGroups(groupsWithCounts);

      if (foundId) {
        const { data: myGroupsData } = await supabase
          .from("tfam_small_group_members")
          .select("group_id")
          .eq("member_id", foundId);
        setMyGroups(myGroupsData || []);
      }
    } catch (err) { console.error(err); }

    setLoading(false);
  };

  const isJoined = (groupId: string) => {
    return myGroups.some((g) => g.group_id === groupId);
  };

  const joinGroup = async (group: SmallGroup) => {
    if (!memberId) { toast.error("Please login"); return; }

    try {
      const supabase = createClient();
      const { error } = await supabase.from("tfam_small_group_members").insert({
        group_id: group.id,
        member_id: memberId,
      });

      if (error) { toast.error(error.message); return; }

      // 🔔 NOTIFY ADMIN
      await notifyAdmin({
        title: "💬 New Small Group Member",
        message: `${memberName || "A member"} just joined "${group.name}" small group.`,
        type: "small_group",
        link: "/admin/church/small-groups",
      });

      setMyGroups((prev) => [...prev, { group_id: group.id }]);
      setGroups((prev) => prev.map((g) => g.id === group.id ? { ...g, member_count: (g.member_count || 0) + 1 } : g));
      toast.success(`🎉 Joined ${group.name}!`);
    } catch { toast.error("Failed"); }
  };

  const leaveGroup = async (group: SmallGroup) => {
    if (!confirm(`Leave ${group.name}?`)) return;

    try {
      const supabase = createClient();
      await supabase
        .from("tfam_small_group_members")
        .delete()
        .eq("group_id", group.id)
        .eq("member_id", memberId);

      // 🔔 NOTIFY ADMIN
      await notifyAdmin({
        title: "🚪 Member Left Small Group",
        message: `${memberName || "A member"} left "${group.name}" small group.`,
        type: "small_group",
        link: "/admin/church/small-groups",
      });

      setMyGroups((prev) => prev.filter((g) => g.group_id !== group.id));
      setGroups((prev) => prev.map((g) => g.id === group.id ? { ...g, member_count: Math.max(0, (g.member_count || 0) - 1) } : g));
      toast.success("Left group");
    } catch { toast.error("Failed"); }
  };

  const firstName = memberName.split(" ")[0] || "";
  const myGroupsCount = myGroups.length;

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">💬</div>
          <p className="text-gray-500">Loading small groups...</p>
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
              Small Groups
            </span>
          </div>
          <p className="text-white/80 font-semibold text-lg mb-1">
            {getGreeting()}{firstName ? `, ${firstName}` : ""}!
          </p>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            Small Groups & Fellowship
          </h1>
          <p className="text-brand-purple-100 text-sm md:text-base">
            Join a small group to grow together with other believers
          </p>
          <div className="flex gap-6 pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{groups.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Groups</p>
            </div>
            <div className="text-center">
              <p className="text-brand-gold-400 font-black text-2xl">{myGroupsCount}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Joined</p>
            </div>
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      {groups.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">No small groups yet</h3>
          <p className="text-gray-500">Small groups will be listed here soon</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((group) => {
            const joined = isJoined(group.id);
            const icon = CATEGORY_ICONS[group.category] || "⛪";
            const gradient = CATEGORY_COLORS[group.category] || "from-amber-500 to-amber-600";
            const isFull = group.max_members && group.member_count && group.member_count >= group.max_members;

            return (
              <div key={group.id} className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${joined ? "border-green-400" : "border-brand-gold-400/40"} p-6 shadow-xl`}>
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-white text-lg">{group.name}</h3>
                      {joined && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-green-500/20 text-green-300 border border-green-400/40">
                          ✅ Member
                        </span>
                      )}
                    </div>
                    <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">
                      {group.member_count} {group.member_count === 1 ? "member" : "members"}
                    </p>
                  </div>
                </div>

                {group.description && (
                  <p className="text-white/80 font-semibold text-sm mb-4">{group.description}</p>
                )}

                <div className="space-y-1.5 text-xs text-brand-purple-200 mb-4">
                  {group.leader_name && <p>👤 Leader: <span className="text-white font-bold">{group.leader_name}</span></p>}
                  {group.leader_phone && <p>📱 <a href={`tel:${group.leader_phone}`} className="text-brand-gold-400 hover:underline">{group.leader_phone}</a></p>}
                  {group.meeting_day && group.meeting_time && (
                    <p>📅 {group.meeting_day} at <span className="text-white font-bold">{group.meeting_time}</span></p>
                  )}
                  {group.meeting_location && <p>📍 {group.meeting_location}</p>}
                  {group.meeting_link && (
                    <p>🔗 <a href={group.meeting_link} target="_blank" rel="noopener noreferrer" className="text-brand-gold-400 hover:underline">Join online</a></p>
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t border-brand-gold-400/30">
                  {joined ? (
                    <button
                      onClick={() => leaveGroup(group)}
                      className="flex-1 px-4 py-2.5 rounded-full bg-brand-purple-950/60 text-white text-sm font-bold border border-brand-gold-400/40 hover:border-brand-gold-400 transition-all"
                    >
                      🚪 Leave Group
                    </button>
                  ) : isFull ? (
                    <button
                      disabled
                      className="flex-1 px-4 py-2.5 rounded-full bg-gray-500/20 text-gray-400 text-sm font-bold border border-gray-400/40 cursor-not-allowed"
                    >
                      🔒 Group Full
                    </button>
                  ) : (
                    <button
                      onClick={() => joinGroup(group)}
                      className="flex-1 px-4 py-2.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-sm shadow-gold hover:scale-105 transition-all"
                    >
                      ✅ Join Group
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