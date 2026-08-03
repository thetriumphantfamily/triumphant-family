// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADMIN GROUP DETAIL – Full management + Pastor Chat notifies all
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { notifyMember } from "@/lib/notifications";
import LoadingScreen from "./LoadingScreen";

interface Group {
  id: string;
  name: string;
  description: string | null;
  category: string;
  leader_name: string | null;
  meeting_day: string | null;
  meeting_time: string | null;
  meeting_location: string | null;
}

interface GroupMember {
  id: string;
  member_id: string;
  role: string;
  joined_at: string;
  member?: {
    full_name: string;
    photo_url: string | null;
    phone: string | null;
    email: string;
    department: string | null;
  } | null;
}

interface AllMember {
  id: string;
  full_name: string;
  email: string;
  member_id: string;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  is_important: boolean;
  is_from_admin: boolean;
  posted_by_name: string | null;
  created_at: string;
}

interface Meeting {
  id: string;
  title: string;
  description: string | null;
  meeting_date: string;
  meeting_time: string | null;
  location: string | null;
  meeting_link: string | null;
  is_cancelled: boolean;
}

interface Message {
  id: string;
  member_id: string | null;
  member_name: string;
  member_photo: string | null;
  message: string;
  created_at: string;
}

type ActiveTab = "members" | "announcements" | "meetings" | "chat";

const ADMIN_MARKER = "__ADMIN_PASTOR__";

function timeAgo(d: string): string {
  const now = new Date();
  const then = new Date(d);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function formatDate(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function ChurchAdminGroupDetailClient({ groupId }: { groupId: string }) {
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [allMembers, setAllMembers] = useState<AllMember[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("members");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [showAddMember, setShowAddMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const [showAnnForm, setShowAnnForm] = useState(false);
  const [annTitle, setAnnTitle] = useState("");
  const [annMessage, setAnnMessage] = useState("");
  const [annImportant, setAnnImportant] = useState(false);

  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [meetingForm, setMeetingForm] = useState({
    title: "", description: "",
    meeting_date: new Date().toISOString().split("T")[0],
    meeting_time: "", location: "", meeting_link: "",
  });

  const [chatInput, setChatInput] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadEverything();
    const supabase = createClient();
    const channel = supabase
      .channel(`admin-group-messages-${groupId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tfam_group_messages", filter: `group_id=eq.${groupId}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [...prev, payload.new as Message]);
          } else if (payload.eventType === "DELETE") {
            setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [groupId]);

  useEffect(() => {
    if (activeTab === "chat") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  const loadEverything = async () => {
    try {
      const supabase = createClient();
      const [groupRes, membersRes, allMembersRes, annRes, meetRes, msgRes] = await Promise.all([
        supabase.from("tfam_small_groups").select("*").eq("id", groupId).single(),
        supabase.from("tfam_small_group_members").select("*, member:tfam_members(full_name, photo_url, phone, email, department)").eq("group_id", groupId).order("joined_at", { ascending: false }),
        supabase.from("tfam_members").select("id, full_name, email, member_id").eq("status", "approved").order("full_name"),
        supabase.from("tfam_group_announcements").select("*").eq("group_id", groupId).order("created_at", { ascending: false }),
        supabase.from("tfam_group_meetings").select("*").eq("group_id", groupId).order("meeting_date", { ascending: false }),
        supabase.from("tfam_group_messages").select("*").eq("group_id", groupId).order("created_at", { ascending: true }).limit(200),
      ]);
      setGroup(groupRes.data);
      setMembers((membersRes.data as GroupMember[]) || []);
      setAllMembers(allMembersRes.data || []);
      setAnnouncements(annRes.data || []);
      setMeetings(meetRes.data || []);
      setMessages(msgRes.data || []);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const addMember = async () => {
    if (!selectedMemberId) { toast.error("Select a member"); return; }
    if (members.some((m) => m.member_id === selectedMemberId)) { toast.error("Already a member"); return; }
    try {
      const supabase = createClient();
      await supabase.from("tfam_small_group_members").insert({ group_id: groupId, member_id: selectedMemberId, role: "member" });
      if (group) {
        await notifyMember({ memberId: selectedMemberId, title: "💬 Added to Small Group", message: `You've been added to "${group.name}" small group by admin.`, type: "small_group", link: `/member/community/${groupId}` });
      }
      toast.success("✅ Member added!");
      setSelectedMemberId(""); setSearchQuery(""); setShowAddMember(false);
      loadEverything();
    } catch { toast.error("Failed"); }
  };

  const removeMember = async (member: GroupMember) => {
    if (!confirm(`Remove ${member.member?.full_name} from this group?`)) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_small_group_members").delete().eq("id", member.id);
      if (group && member.member_id) {
        await notifyMember({ memberId: member.member_id, title: "🚪 Removed from Small Group", message: `You've been removed from "${group.name}" small group.`, type: "small_group", link: "/member/community" });
      }
      toast.success("Member removed");
      loadEverything();
    } catch { toast.error("Failed"); }
  };

  const updateRole = async (memberRowId: string, newRole: string) => {
    try {
      const supabase = createClient();
      await supabase.from("tfam_small_group_members").update({ role: newRole }).eq("id", memberRowId);
      setMembers((prev) => prev.map((m) => m.id === memberRowId ? { ...m, role: newRole } : m));
      toast.success(`Role updated to ${newRole}`);
    } catch { toast.error("Failed"); }
  };

  const postAnnouncement = async (e: FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMessage.trim()) { toast.error("Title and message required"); return; }
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      await supabase.from("tfam_group_announcements").insert({
        group_id: groupId, title: annTitle.trim(), message: annMessage.trim(),
        is_important: annImportant, is_from_admin: true, posted_by_name: "Admin",
      });
      for (const m of members) {
        if (m.member_id && group) {
          await notifyMember({
            memberId: m.member_id,
            title: annImportant ? `🔴 Important: ${group.name}` : `📢 ${group.name}`,
            message: annTitle, type: "group_announcement",
            link: `/member/community/${groupId}`,
          });
        }
      }
      toast.success("📢 Announcement posted!");
      setAnnTitle(""); setAnnMessage(""); setAnnImportant(false); setShowAnnForm(false);
      loadEverything();
    } catch { toast.error("Failed"); }
    finally { setIsSubmitting(false); }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_group_announcements").delete().eq("id", id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  const openMeetingForm = (m?: Meeting) => {
    if (m) {
      setEditingMeetingId(m.id);
      setMeetingForm({ title: m.title, description: m.description || "", meeting_date: m.meeting_date, meeting_time: m.meeting_time || "", location: m.location || "", meeting_link: m.meeting_link || "" });
    } else {
      setEditingMeetingId(null);
      setMeetingForm({ title: "", description: "", meeting_date: new Date().toISOString().split("T")[0], meeting_time: "", location: "", meeting_link: "" });
    }
    setShowMeetingForm(true);
  };

  const saveMeeting = async (e: FormEvent) => {
    e.preventDefault();
    if (!meetingForm.title.trim()) { toast.error("Title required"); return; }
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const payload = {
        group_id: groupId, title: meetingForm.title.trim(), description: meetingForm.description.trim() || null,
        meeting_date: meetingForm.meeting_date, meeting_time: meetingForm.meeting_time.trim() || null,
        location: meetingForm.location.trim() || null, meeting_link: meetingForm.meeting_link.trim() || null, is_cancelled: false,
      };
      if (editingMeetingId) {
        await supabase.from("tfam_group_meetings").update(payload).eq("id", editingMeetingId);
        toast.success("Updated!");
      } else {
        await supabase.from("tfam_group_meetings").insert(payload);
        for (const m of members) {
          if (m.member_id && group) {
            await notifyMember({ memberId: m.member_id, title: `📅 New ${group.name} Meeting`, message: `${payload.title} — ${formatDate(payload.meeting_date)}`, type: "group_meeting", link: `/member/community/${groupId}` });
          }
        }
        toast.success("Meeting created!");
      }
      setShowMeetingForm(false);
      loadEverything();
    } catch { toast.error("Failed"); }
    finally { setIsSubmitting(false); }
  };

  const deleteMeeting = async (id: string) => {
    if (!confirm("Delete this meeting?")) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_group_meetings").delete().eq("id", id);
      setMeetings((prev) => prev.filter((m) => m.id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  const toggleCancelMeeting = async (id: string, current: boolean) => {
    try {
      const supabase = createClient();
      await supabase.from("tfam_group_meetings").update({ is_cancelled: !current }).eq("id", id);
      loadEverything();
      toast.success(current ? "Restored" : "Cancelled");
    } catch { toast.error("Failed"); }
  };

  const sendAdminMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setIsSendingChat(true);
    try {
      const supabase = createClient();
      const messageText = chatInput.trim();
      await supabase.from("tfam_group_messages").insert({
        group_id: groupId, member_id: null, member_name: ADMIN_MARKER,
        member_photo: null, message: messageText,
      });
      if (members.length > 0 && group) {
        const notifications = members.filter((m) => m.member_id).map((m) => ({
          recipient_type: "member", recipient_id: m.member_id,
          title: `👑 Pastor in ${group.name}`,
          message: messageText.substring(0, 100) + (messageText.length > 100 ? "..." : ""),
          type: "group_chat", link: `/member/community/${groupId}`, is_read: false,
        }));
        if (notifications.length > 0) await supabase.from("tfam_notifications").insert(notifications);
      }
      setChatInput("");
    } catch { toast.error("Failed"); }
    finally { setIsSendingChat(false); }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_group_messages").delete().eq("id", id);
    } catch { toast.error("Failed"); }
  };

  const filteredAvailableMembers = allMembers.filter((m) => {
    if (members.some((gm) => gm.member_id === m.id)) return false;
    if (!searchQuery) return true;
    return m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || m.member_id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading group..." />;

  // ✅ GROUP NOT FOUND
  if (!group) {
    return (
      <div className="space-y-4">
        <Link href="/admin/church/small-groups" className="inline-flex items-center gap-2 text-white/80 font-bold hover:text-white text-sm">
          ← Back to Small Groups
        </Link>
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-10 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <p className="text-white font-bold">Group not found</p>
          <Link href="/admin/church/small-groups" className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold mt-4">
            ← Back
          </Link>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: "members", label: `👥 Members (${members.length})` },
    { id: "announcements", label: `📢 Announcements (${announcements.length})` },
    { id: "meetings", label: `📅 Meetings (${meetings.length})` },
    { id: "chat", label: `💬 Chat (${messages.length})` },
  ];

  return (
    <div className="space-y-4 pb-6">

      {/* ── Back Link ── */}
      <Link
        href="/admin/church/small-groups"
        className="inline-flex items-center gap-2 text-white/80 font-bold hover:text-white text-sm"
      >
        ← Back to All Groups
      </Link>

      {/* ── Brand Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">{group.category}</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-2">{group.name}</h1>
          {group.description && <p className="text-brand-purple-100 text-sm mb-3">{group.description}</p>}
          <div className="flex gap-4 flex-wrap pt-4 border-t border-brand-gold-400/30">
            <div className="text-center"><p className="text-white font-black text-2xl">{members.length}</p><p className="text-brand-purple-200 text-xs font-semibold uppercase">Members</p></div>
            <div className="text-center"><p className="text-white font-black text-2xl">{announcements.length}</p><p className="text-brand-purple-200 text-xs font-semibold uppercase">Notices</p></div>
            <div className="text-center"><p className="text-white font-black text-2xl">{meetings.length}</p><p className="text-brand-purple-200 text-xs font-semibold uppercase">Meetings</p></div>
            <div className="text-center"><p className="text-white font-black text-2xl">{messages.length}</p><p className="text-brand-purple-200 text-xs font-semibold uppercase">Messages</p></div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ActiveTab)}
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-black transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 shadow-gold"
                : "bg-brand-purple-950/60 text-white border border-brand-gold-400/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── MEMBERS TAB ── */}
      {activeTab === "members" && (
        <div className="space-y-4">
          <button
            onClick={() => setShowAddMember(true)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all"
          >
            ➕ Add Member
          </button>
          {members.length === 0 ? (
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <p className="text-brand-purple-200 font-semibold">No members yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {members.map((m) => (
                <div key={m.id} className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4 shadow-xl">
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                  <div className="flex items-center gap-3 mb-3">
                    {m.member?.photo_url ? (
                      <img src={m.member.photo_url} alt={m.member.full_name} className="w-12 h-12 rounded-full object-cover border-2 border-brand-gold-400/40 flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-brand-purple-950/80 border-2 border-brand-gold-400/40 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                        {m.member?.full_name.charAt(0) || "?"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-white truncate text-sm">{m.member?.full_name || "Unknown"}</p>
                      {m.member?.email && <p className="text-xs text-brand-purple-200 truncate">📧 {m.member.email}</p>}
                      {m.member?.phone && <p className="text-xs text-brand-purple-200 truncate">📱 {m.member.phone}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-brand-gold-400/30">
                    <select
                      value={m.role}
                      onChange={(e) => updateRole(m.id, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-brand-purple-950/60 text-white text-xs font-bold border border-brand-gold-400/40 focus:outline-none"
                    >
                      <option value="member">Member</option>
                      <option value="leader">👑 Leader</option>
                      <option value="assistant">⭐ Assistant</option>
                    </select>
                    <button
                      onClick={() => removeMember(m)}
                      className="px-3 py-2 rounded-xl bg-red-600 text-white text-xs font-black active:scale-95 transition-all"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── ANNOUNCEMENTS TAB ── */}
      {activeTab === "announcements" && (
        <div className="space-y-4">
          <button
            onClick={() => setShowAnnForm(true)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all"
          >
            ➕ Post Announcement
          </button>
          {announcements.length === 0 ? (
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <p className="text-brand-purple-200 font-semibold">No announcements yet</p>
            </div>
          ) : (
            announcements.map((a) => (
              <div key={a.id} className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${a.is_important ? "border-red-400/60" : "border-brand-gold-400/40"} p-5 shadow-xl`}>
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {a.is_important && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-red-500 text-white">🔴 IMPORTANT</span>}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-white text-brand-purple-900">👑 Admin</span>
                  <span className="text-brand-purple-200 text-xs font-semibold">{timeAgo(a.created_at)}</span>
                </div>
                <p className="font-black text-white text-base">{a.title}</p>
                <p className="text-white font-semibold text-sm mt-2 whitespace-pre-wrap">{a.message}</p>
                <div className="pt-3 border-t border-brand-gold-400/30 mt-3">
                  <button
                    onClick={() => deleteAnnouncement(a.id)}
                    className="w-full py-2.5 rounded-xl bg-red-600 text-white text-xs font-black active:scale-95 transition-all"
                  >
                    🗑️ Delete Announcement
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── MEETINGS TAB ── */}
      {activeTab === "meetings" && (
        <div className="space-y-4">
          <button
            onClick={() => openMeetingForm()}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all"
          >
            ➕ Schedule Meeting
          </button>
          {meetings.length === 0 ? (
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <p className="text-brand-purple-200 font-semibold">No meetings scheduled</p>
            </div>
          ) : (
            meetings.map((m) => (
              <div key={m.id} className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${m.is_cancelled ? "border-red-400/60" : "border-brand-gold-400/40"} p-5 shadow-xl`}>
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                {m.is_cancelled && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-red-500 text-white mb-2">CANCELLED</span>}
                <p className="font-black text-white text-base">{m.title}</p>
                <p className="text-brand-purple-200 text-sm">📅 {formatDate(m.meeting_date)} {m.meeting_time && `at ${m.meeting_time}`}</p>
                {m.location && <p className="text-brand-purple-200 text-sm">📍 {m.location}</p>}
                {m.description && <p className="text-white font-semibold text-sm mt-2">{m.description}</p>}
                <div className="flex flex-col gap-2 pt-3 border-t border-brand-gold-400/30 mt-3">
                  <button
                    onClick={() => openMeetingForm(m)}
                    className="w-full py-2.5 rounded-xl bg-white text-brand-purple-900 text-xs font-black active:scale-95 transition-all"
                  >
                    ✏️ Edit Meeting
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => toggleCancelMeeting(m.id, m.is_cancelled)}
                      className="py-2 rounded-xl bg-brand-purple-950/60 text-white text-xs font-bold border border-brand-gold-400/40"
                    >
                      {m.is_cancelled ? "✅ Restore" : "❌ Cancel"}
                    </button>
                    <button
                      onClick={() => deleteMeeting(m.id)}
                      className="py-2 rounded-xl bg-red-600 text-white text-xs font-black active:scale-95 transition-all"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── CHAT TAB ── */}
      {activeTab === "chat" && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-2xl flex flex-col h-[600px]">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="flex-shrink-0 p-4 border-b border-brand-gold-400/30 bg-brand-purple-950/40">
            <p className="text-white font-black text-sm">💬 {group.name} Chat</p>
            <p className="text-brand-purple-200 text-xs">🟢 Real-time • Posting as 👑 Pastor • Notifies {members.length} members</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-brand-purple-200">No messages yet. Start the conversation!</p>
              </div>
            ) : messages.map((m) => {
              const isAdmin = m.member_name === ADMIN_MARKER || m.member_id === null;
              return (
                <div key={m.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"} group`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 relative ${
                    isAdmin
                      ? "bg-brand-purple-950/80 text-white border-2 border-green-400/60"
                      : "bg-brand-purple-950/60 text-white border border-brand-gold-400/30"
                  }`}>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {isAdmin ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-white text-brand-purple-900">
                          👑 PASTOR
                        </span>
                      ) : (
                        <p className="text-xs font-black text-white/80">{m.member_name}</p>
                      )}
                    </div>
                    <p className="text-sm font-semibold whitespace-pre-wrap text-white">{m.message}</p>
                    <p className="text-xs mt-1 text-brand-purple-200">
                      {new Date(m.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <button
                      onClick={() => deleteMessage(m.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >✕</button>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={sendAdminMessage} className="p-3 border-t border-brand-gold-400/30 flex gap-2">
            <input
              type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message as Pastor..." disabled={isSendingChat}
              className="flex-1 p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold text-sm disabled:opacity-50"
            />
            <button type="submit" disabled={isSendingChat || !chatInput.trim()}
              className="px-5 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50 flex-shrink-0">
              {isSendingChat ? "..." : "Send →"}
            </button>
          </form>
        </div>
      )}

      {/* ── Add Member Modal — KEEP bg-white — slides up mobile ── */}
      {showAddMember && (
        <>
          <div onClick={() => setShowAddMember(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-md pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-brand-purple-900">➕ Add Member</h2>
                  <button onClick={() => setShowAddMember(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              <div className="p-5">
                <input
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or ID..."
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 mb-4"
                />
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredAvailableMembers.length === 0 ? (
                    <p className="text-center text-gray-500 py-4 text-sm">No members found</p>
                  ) : filteredAvailableMembers.map((m) => (
                    <button key={m.id} onClick={() => setSelectedMemberId(m.id)}
                      className={`w-full text-left p-3 rounded-xl border-2 transition-all ${selectedMemberId === m.id ? "border-brand-purple-500 bg-brand-purple-50" : "border-gray-200 hover:border-brand-purple-300"}`}>
                      <p className="font-bold text-brand-purple-900 text-sm">{m.full_name}</p>
                      <p className="text-xs text-gray-600">{m.member_id}</p>
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 mt-4">
                  <button
                    onClick={addMember}
                    disabled={!selectedMemberId}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50"
                  >
                    ✅ Add Member
                  </button>
                  <button
                    onClick={() => setShowAddMember(false)}
                    className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Announcement Form Modal ── */}
      {showAnnForm && (
        <>
          <div onClick={() => setShowAnnForm(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-lg pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-brand-purple-900">📢 Post Announcement</h2>
                  <button onClick={() => setShowAnnForm(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              <form onSubmit={postAnnouncement} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Title <span className="text-red-500">*</span></label>
                  <input type="text" value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} required className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message <span className="text-red-500">*</span></label>
                  <textarea value={annMessage} onChange={(e) => setAnnMessage(e.target.value)} rows={5} required className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={annImportant} onChange={(e) => setAnnImportant(e.target.checked)} className="w-4 h-4" />
                  <span className="text-sm font-bold text-gray-700">🔴 Mark as Important</span>
                </label>
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50">
                    {isSubmitting ? "Posting..." : "📢 Post & Notify Members"}
                  </button>
                  <button type="button" onClick={() => setShowAnnForm(false)} className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-bold">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* ── Meeting Form Modal ── */}
      {showMeetingForm && (
        <>
          <div onClick={() => setShowMeetingForm(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-lg pointer-events-auto max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-5 z-10 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-brand-purple-900">
                    📅 {editingMeetingId ? "Edit" : "Schedule"} Meeting
                  </h2>
                  <button onClick={() => setShowMeetingForm(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
              <form onSubmit={saveMeeting} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Meeting Title <span className="text-red-500">*</span></label>
                  <input type="text" value={meetingForm.title} onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })} required className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                  <input type="date" value={meetingForm.meeting_date} onChange={(e) => setMeetingForm({ ...meetingForm, meeting_date: e.target.value })} required className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Time</label>
                  <input type="text" value={meetingForm.meeting_time} onChange={(e) => setMeetingForm({ ...meetingForm, meeting_time: e.target.value })} placeholder="e.g. 4:00 PM" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                  <input type="text" value={meetingForm.location} onChange={(e) => setMeetingForm({ ...meetingForm, location: e.target.value })} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Online Meeting Link</label>
                  <input type="url" value={meetingForm.meeting_link} onChange={(e) => setMeetingForm({ ...meetingForm, meeting_link: e.target.value })} placeholder="https://..." className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea value={meetingForm.description} onChange={(e) => setMeetingForm({ ...meetingForm, description: e.target.value })} rows={3} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 resize-none" />
                </div>
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50">
                    {isSubmitting ? "Saving..." : editingMeetingId ? "✅ Update Meeting" : "📅 Schedule & Notify Members"}
                  </button>
                  <button type="button" onClick={() => setShowMeetingForm(false)} className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 font-bold">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}