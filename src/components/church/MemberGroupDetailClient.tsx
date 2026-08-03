// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER GROUP DETAIL – Full features + chat notifies all group members
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { notifyAdmin } from "@/lib/notifications";
import LoadingScreen from "./LoadingScreen";

interface Group {
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
  is_active: boolean;
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

interface Announcement {
  id: string;
  title: string;
  message: string;
  is_important: boolean;
  is_from_admin: boolean;
  posted_by_name: string | null;
  created_at: string;
}

interface Prayer {
  id: string;
  member_id: string | null;
  member_name: string | null;
  prayer_point: string;
  is_anonymous: boolean;
  is_answered: boolean;
  answer_testimony: string | null;
  pray_count: number;
  created_at: string;
}

interface Message {
  id: string;
  member_id: string | null;
  member_name: string;
  member_photo: string | null;
  message: string;
  created_at: string;
}

interface Photo {
  id: string;
  photo_url: string;
  caption: string | null;
  uploaded_by_name: string | null;
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

type ActiveTab = "members" | "announcements" | "prayers" | "chat" | "photos" | "meetings";

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

export default function MemberGroupDetailClient({ groupId }: { groupId: string }) {
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("members");
  const [memberId, setMemberId] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberPhoto, setMemberPhoto] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [newPrayer, setNewPrayer] = useState("");
  const [prayerAnonymous, setPrayerAnonymous] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadEverything();

    const supabase = createClient();
    const channel = supabase
      .channel(`group-messages-${groupId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tfam_group_messages",
          filter: `group_id=eq.${groupId}`,
        },
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
    let foundId = "";
    let foundName = "";
    let foundPhoto = "";

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
                if (parsed.photo_url) foundPhoto = parsed.photo_url;
                break;
              }
            }
          } catch { /* ignore */ }
        }
      }
    } catch { /* ignore */ }

    setMemberId(foundId);
    setMemberName(foundName);
    setMemberPhoto(foundPhoto || null);

    const supabase = createClient();

    const { data: groupData } = await supabase
      .from("tfam_small_groups")
      .select("*")
      .eq("id", groupId)
      .single();
    setGroup(groupData);

    const { data: membersData } = await supabase
      .from("tfam_small_group_members")
      .select("*, member:tfam_members(full_name, photo_url, phone, email, department)")
      .eq("group_id", groupId)
      .order("joined_at", { ascending: false });
    setMembers((membersData as GroupMember[]) || []);

    if (foundId) {
      const isJoined = (membersData || []).some((m) => m.member_id === foundId);
      setIsMember(isJoined);
    }

    const [annRes, prayerRes, msgRes, photoRes, meetRes] = await Promise.all([
      supabase.from("tfam_group_announcements").select("*").eq("group_id", groupId).order("created_at", { ascending: false }),
      supabase.from("tfam_group_prayers").select("*").eq("group_id", groupId).order("created_at", { ascending: false }),
      supabase.from("tfam_group_messages").select("*").eq("group_id", groupId).order("created_at", { ascending: true }).limit(200),
      supabase.from("tfam_group_photos").select("*").eq("group_id", groupId).order("created_at", { ascending: false }),
      supabase.from("tfam_group_meetings").select("*").eq("group_id", groupId).order("meeting_date", { ascending: false }),
    ]);

    setAnnouncements(annRes.data || []);
    setPrayers(prayerRes.data || []);
    setMessages(msgRes.data || []);
    setPhotos(photoRes.data || []);
    setMeetings(meetRes.data || []);
    setLoading(false);
  };

  const submitPrayer = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPrayer.trim()) return;
    if (!memberId) { toast.error("Please login"); return; }

    try {
      const supabase = createClient();
      await supabase.from("tfam_group_prayers").insert({
        group_id: groupId,
        member_id: memberId,
        member_name: memberName,
        prayer_point: newPrayer.trim(),
        is_anonymous: prayerAnonymous,
      });
      toast.success("🙏 Prayer request added!");
      setNewPrayer("");
      setPrayerAnonymous(false);
      loadEverything();
    } catch { toast.error("Failed"); }
  };

  const incrementPray = async (prayerId: string) => {
    try {
      const supabase = createClient();
      const prayer = prayers.find((p) => p.id === prayerId);
      if (!prayer) return;
      await supabase
        .from("tfam_group_prayers")
        .update({ pray_count: prayer.pray_count + 1 })
        .eq("id", prayerId);
      setPrayers((prev) =>
        prev.map((p) =>
          p.id === prayerId ? { ...p, pray_count: p.pray_count + 1 } : p
        )
      );
      toast.success("🙏 Prayed for this!");
    } catch { toast.error("Failed"); }
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    if (!memberId) { toast.error("Please login"); return; }

    try {
      const supabase = createClient();
      const messageText = chatInput.trim();

      await supabase.from("tfam_group_messages").insert({
        group_id: groupId,
        member_id: memberId,
        member_name: memberName,
        member_photo: memberPhoto,
        message: messageText,
      });

      await notifyAdmin({
        title: `💬 ${group?.name || "Group"} Chat`,
        message: `${memberName}: ${messageText.substring(0, 100)}${messageText.length > 100 ? "..." : ""}`,
        type: "group_chat",
        link: `/admin/church/small-groups/${groupId}`,
      });

      const otherMembers = members.filter((m) => m.member_id !== memberId);
      if (otherMembers.length > 0) {
        const notifications = otherMembers.map((m) => ({
          recipient_type: "member",
          recipient_id: m.member_id,
          title: `💬 ${memberName} in ${group?.name || "Group"}`,
          message: messageText.substring(0, 100) + (messageText.length > 100 ? "..." : ""),
          type: "group_chat",
          link: `/member/community/${groupId}`,
          is_read: false,
        }));
        await supabase.from("tfam_notifications").insert(notifications);
      }

      setChatInput("");
    } catch { toast.error("Failed"); }
  };

  const deleteMyMessage = async (msgId: string, senderId: string | null) => {
    if (senderId !== memberId) return;
    if (!confirm("Delete this message?")) return;
    try {
      const supabase = createClient();
      await supabase.from("tfam_group_messages").delete().eq("id", msgId);
    } catch { toast.error("Failed"); }
  };

  const handlePhotoUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!photoFile) return;
    if (!memberId) { toast.error("Please login"); return; }

    setUploadingPhoto(true);
    try {
      const supabase = createClient();
      const fileName = `group-photos/${groupId}/${Date.now()}-${photoFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("tfam-groups")
        .upload(fileName, photoFile);
      if (uploadError) { toast.error("Upload failed"); setUploadingPhoto(false); return; }
      const { data: urlData } = supabase.storage.from("tfam-groups").getPublicUrl(fileName);
      await supabase.from("tfam_group_photos").insert({
        group_id: groupId,
        member_id: memberId,
        uploaded_by_name: memberName,
        photo_url: urlData.publicUrl,
        caption: photoCaption.trim() || null,
      });
      toast.success("📸 Photo uploaded!");
      setPhotoFile(null);
      setPhotoCaption("");
      loadEverything();
    } catch { toast.error("Failed"); }
    finally { setUploadingPhoto(false); }
  };

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading group..." />;

  // ✅ GROUP NOT FOUND
  if (!group) {
    return (
      <div className="space-y-4">
        <Link
          href="/member/community"
          className="inline-flex items-center gap-2 text-white/80 font-bold hover:text-white text-sm"
        >
          ← Back to Small Groups
        </Link>
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-10 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-4xl mb-3">❌</div>
          <p className="text-white font-black text-lg">Group not found</p>
          <Link
            href="/member/community"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold mt-4 hover:scale-105 transition-all"
          >
            ← Back
          </Link>
        </div>
      </div>
    );
  }

  // ✅ NOT A MEMBER
  if (!isMember) {
    return (
      <div className="space-y-6">
        <Link
          href="/member/community"
          className="inline-flex items-center gap-2 text-white/80 font-bold hover:text-white text-sm"
        >
          ← Back to Small Groups
        </Link>
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="font-heading text-xl font-bold text-white mb-2">Join to Access</h2>
          <p className="text-brand-purple-200 text-sm mb-4">
            You need to join <strong className="text-white">{group.name}</strong> to view its content.
          </p>
          <Link
            href="/member/community"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all"
          >
            Join This Group
          </Link>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: "members", label: `👥 Members (${members.length})` },
    { id: "announcements", label: `📢 News (${announcements.length})` },
    { id: "prayers", label: `🙏 Prayers (${prayers.length})` },
    { id: "chat", label: `💬 Chat (${messages.length})` },
    { id: "photos", label: `📸 Photos (${photos.length})` },
    { id: "meetings", label: `📅 Meetings (${meetings.length})` },
  ];

  return (
    <div className="space-y-6">

      {/* ── Back Link ── */}
      <Link
        href="/member/community"
        className="inline-flex items-center gap-2 text-white/80 font-bold hover:text-white text-sm"
      >
        ← Back to Small Groups
      </Link>

      {/* ── Brand Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-sm md:text-base lg:text-lg uppercase tracking-widest">
              {group.category}
            </span>
          </div>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
            {group.name}
          </h1>
          {group.description && (
            <p className="text-brand-purple-100 text-sm md:text-base mb-4">
              {group.description}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-brand-gold-400/30">
            {group.leader_name && (
              <div className="bg-brand-purple-950/60 rounded-xl p-3 border border-brand-gold-400/30">
                <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">
                  Leader
                </p>
                <p className="text-white font-bold">{group.leader_name}</p>
                {group.leader_phone && (
                  <div className="flex gap-2 mt-2">
                    <a
                      href={`tel:${group.leader_phone}`}
                      className="flex-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 text-xs font-black text-center shadow-gold"
                    >
                      📱 Call
                    </a>
                    <a
                      href={`https://wa.me/${group.leader_phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-1.5 rounded-full bg-green-600 text-white text-xs font-black text-center"
                    >
                      💚 WhatsApp
                    </a>
                  </div>
                )}
              </div>
            )}
            {group.meeting_day && (
              <div className="bg-brand-purple-950/60 rounded-xl p-3 border border-brand-gold-400/30">
                <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">
                  Meeting
                </p>
                <p className="text-white font-bold text-sm">
                  📅 {group.meeting_day} at {group.meeting_time}
                </p>
                {group.meeting_location && (
                  <p className="text-brand-purple-200 text-xs mt-1">
                    📍 {group.meeting_location}
                  </p>
                )}
                {group.meeting_link && (
                  <a
                    href={group.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 text-xs mt-2 inline-block hover:text-white underline"
                  >
                    🔗 Join Online
                  </a>
                )}
              </div>
            )}
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
                : "bg-brand-purple-950/60 text-white/80 border border-brand-gold-400/40 hover:border-brand-gold-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── MEMBERS TAB ── */}
      {activeTab === "members" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {members.map((m) => (
            <div
              key={m.id}
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4 shadow-xl"
            >
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <div className="flex items-center gap-3">
                {m.member?.photo_url ? (
                  <img
                    src={m.member.photo_url}
                    alt={m.member.full_name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-brand-gold-400/40 flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-brand-purple-950/80 border-2 border-brand-gold-400/40 flex items-center justify-center text-white font-black text-xl flex-shrink-0">
                    {m.member?.full_name.charAt(0) || "?"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-white truncate">
                    {m.member?.full_name || "Unknown"}
                  </p>
                  {m.role !== "member" && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-white text-brand-purple-900">
                      {m.role === "leader" ? "👑 Leader" : "⭐ Assistant"}
                    </span>
                  )}
                  {m.member?.department && (
                    <p className="text-xs text-brand-purple-200 truncate">
                      {m.member.department}
                    </p>
                  )}
                  {m.member?.phone && (
                    <div className="flex gap-1 mt-1">
                      <a
                        href={`tel:${m.member.phone}`}
                        className="text-xs text-white/70 hover:text-white underline"
                      >
                        📱 Call
                      </a>
                      <span className="text-brand-purple-300">•</span>
                      <a
                        href={`https://wa.me/${m.member.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-400 hover:text-green-300 underline"
                      >
                        💚 WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ANNOUNCEMENTS TAB ── */}
      {activeTab === "announcements" && (
        <div className="space-y-3">
          {announcements.length === 0 ? (
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <p className="text-brand-purple-200 font-semibold">No announcements yet</p>
            </div>
          ) : (
            announcements.map((a) => (
              <div
                key={a.id}
                className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${
                  a.is_important ? "border-red-400/60" : "border-brand-gold-400/40"
                } p-5 shadow-xl`}
              >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {a.is_important && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-red-500 text-white">
                      🔴 IMPORTANT
                    </span>
                  )}
                  {a.is_from_admin && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-white text-brand-purple-900">
                      👑 From Pastor
                    </span>
                  )}
                  <span className="text-brand-purple-300 text-xs font-semibold">
                    {timeAgo(a.created_at)}
                  </span>
                </div>
                <p className="font-black text-white text-lg">{a.title}</p>
                <p className="text-white/80 font-semibold text-sm mt-2 whitespace-pre-wrap">
                  {a.message}
                </p>
                {a.posted_by_name && (
                  <p className="text-brand-purple-300 text-xs mt-3">
                    — {a.posted_by_name}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ── PRAYERS TAB ── */}
      {activeTab === "prayers" && (
        <div className="space-y-4">
          <form
            onSubmit={submitPrayer}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl"
          >
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <h3 className="font-black text-white mb-3">🙏 Share Prayer Request</h3>
            <textarea
              value={newPrayer}
              onChange={(e) => setNewPrayer(e.target.value)}
              rows={3}
              placeholder="What do you need prayer for?"
              className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold text-sm resize-none mb-3"
            />
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prayerAnonymous}
                  onChange={(e) => setPrayerAnonymous(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-white text-sm font-semibold">Post anonymously</span>
              </label>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-sm shadow-gold hover:scale-105 transition-all"
              >
                🙏 Submit
              </button>
            </div>
          </form>

          {prayers.length === 0 ? (
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <p className="text-brand-purple-200 font-semibold">No prayer requests yet</p>
            </div>
          ) : (
            prayers.map((p) => (
              <div
                key={p.id}
                className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${
                  p.is_answered ? "border-green-400/40" : "border-brand-gold-400/40"
                } p-5 shadow-xl`}
              >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {p.is_answered && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-green-500/20 text-green-300 border border-green-400/40">
                      ✅ Answered
                    </span>
                  )}
                  <p className="text-white/60 font-black text-xs">
                    {p.is_anonymous ? "🕊️ Anonymous" : `👤 ${p.member_name || "Member"}`}
                  </p>
                  <span className="text-brand-purple-300 text-xs font-semibold">
                    {timeAgo(p.created_at)}
                  </span>
                </div>
                <p className="text-white font-semibold text-sm whitespace-pre-wrap">
                  {p.prayer_point}
                </p>
                {p.is_answered && p.answer_testimony && (
                  <div className="mt-3 bg-green-500/10 border border-green-400/30 rounded-xl p-3">
                    <p className="text-green-300 text-xs font-black uppercase mb-1">
                      🎉 Testimony
                    </p>
                    <p className="text-white text-sm">{p.answer_testimony}</p>
                  </div>
                )}
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-brand-gold-400/30">
                  <button
                    onClick={() => incrementPray(p.id)}
                    className="px-3 py-1 rounded-full bg-brand-purple-950/60 text-white/80 text-xs font-bold border border-brand-gold-400/40 hover:border-brand-gold-400 transition-all"
                  >
                    🙏 I Prayed ({p.pray_count})
                  </button>
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

          {/* Chat Header */}
          <div className="flex-shrink-0 p-4 border-b border-brand-gold-400/30 bg-brand-purple-950/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-purple-950/80 border border-brand-gold-400/40 flex items-center justify-center text-lg">
                💬
              </div>
              <div>
                <p className="text-white font-black text-sm">{group.name} Chat</p>
                <p className="text-brand-purple-200 text-xs">
                  🟢 Real-time • {members.length} members notified
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-brand-purple-200">Start the conversation!</p>
              </div>
            ) : (
              messages.map((m) => {
                const isAdmin = m.member_name === ADMIN_MARKER || m.member_id === null;
                const isMine = !isAdmin && m.member_id === memberId;
                return (
                  <div
                    key={m.id}
                    className={`flex ${isMine ? "justify-end" : "justify-start"} group`}
                  >
                    <div className="max-w-[85%] flex gap-2 items-start">
                      {!isMine && !isAdmin && (
                        <>
                          {m.member_photo ? (
                            <img
                              src={m.member_photo}
                              alt={m.member_name}
                              className="w-8 h-8 rounded-full object-cover border border-brand-gold-400/40 flex-shrink-0 mt-1"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-brand-purple-950/80 border border-brand-gold-400/40 flex items-center justify-center text-white font-black text-xs flex-shrink-0 mt-1">
                              {m.member_name.charAt(0)}
                            </div>
                          )}
                        </>
                      )}
                      <div
                        className={`rounded-2xl p-3 relative ${
                          isAdmin
                            ? "bg-brand-purple-950/80 text-white border-2 border-green-400/60 shadow-lg"
                            : isMine
                            ? "bg-brand-purple-950/80 text-white border border-brand-gold-400/40"
                            : "bg-brand-purple-950/60 text-white border border-brand-gold-400/30"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {isAdmin ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-white text-brand-purple-900">
                              👑 PASTOR
                            </span>
                          ) : !isMine ? (
                            <p className="text-xs font-black text-white/60">
                              {m.member_name}
                            </p>
                          ) : null}
                        </div>
                        <p className="text-sm font-semibold whitespace-pre-wrap break-words">
                          {m.message}
                        </p>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <p className="text-xs text-brand-purple-300">
                            {timeAgo(m.created_at)}
                          </p>
                          {isMine && (
                            <button
                              onClick={() => deleteMyMessage(m.id, m.member_id)}
                              className="text-xs opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <form
            onSubmit={sendMessage}
            className="p-3 border-t border-brand-gold-400/30 flex gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold text-sm"
            />
            <button
              type="submit"
              className="px-5 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all flex-shrink-0"
            >
              →
            </button>
          </form>
        </div>
      )}

      {/* ── PHOTOS TAB ── */}
      {activeTab === "photos" && (
        <div className="space-y-4">
          <form
            onSubmit={handlePhotoUpload}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl"
          >
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <h3 className="font-black text-white mb-3">📸 Upload Photo</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold text-sm mb-3 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-brand-purple-950 file:text-white file:font-bold"
            />
            <input
              type="text"
              value={photoCaption}
              onChange={(e) => setPhotoCaption(e.target.value)}
              placeholder="Optional caption..."
              className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold text-sm mb-3"
            />
            <button
              type="submit"
              disabled={!photoFile || uploadingPhoto}
              className="w-full px-5 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all disabled:opacity-50"
            >
              {uploadingPhoto ? "Uploading..." : "📸 Upload Photo"}
            </button>
          </form>

          {photos.length === 0 ? (
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <p className="text-brand-purple-200 font-semibold">No photos yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {photos.map((p) => (
                <div
                  key={p.id}
                  className="relative rounded-2xl overflow-hidden bg-brand-purple-950/60 border-2 border-brand-gold-400/40"
                >
                  <img
                    src={p.photo_url}
                    alt={p.caption || "Photo"}
                    className="w-full h-40 object-cover"
                  />
                  {p.caption && (
                    <p className="text-white text-xs p-2 font-semibold">{p.caption}</p>
                  )}
                  {p.uploaded_by_name && (
                    <p className="text-brand-purple-300 text-xs px-2 pb-2">
                      — {p.uploaded_by_name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MEETINGS TAB ── */}
      {activeTab === "meetings" && (
        <div className="space-y-3">
          {meetings.length === 0 ? (
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
              <p className="text-brand-purple-200 font-semibold">No meetings scheduled</p>
            </div>
          ) : (
            meetings.map((m) => (
              <div
                key={m.id}
                className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${
                  m.is_cancelled ? "border-red-400/60" : "border-brand-gold-400/40"
                } p-5 shadow-xl`}
              >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                {m.is_cancelled && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-red-500 text-white mb-2">
                    CANCELLED
                  </span>
                )}
                <p className="font-black text-white text-lg">{m.title}</p>
                <p className="text-brand-purple-200 text-sm">
                  📅 {formatDate(m.meeting_date)}{" "}
                  {m.meeting_time && `at ${m.meeting_time}`}
                </p>
                {m.location && (
                  <p className="text-brand-purple-200 text-sm">📍 {m.location}</p>
                )}
                {m.description && (
                  <p className="text-white/80 text-sm mt-2">{m.description}</p>
                )}
                {m.meeting_link && (
                  <a
                    href={m.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-xs shadow-gold hover:scale-105 transition-all"
                  >
                    🔗 Join Online
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}