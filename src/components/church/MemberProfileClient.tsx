// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER PROFILE CLIENT – Beautiful themed profile with photo upload
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "./LoadingScreen";

interface Member {
  id: string;
  member_id: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string | null;
  date_of_birth: string | null;
  marital_status: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  photo_url: string | null;
  department: string | null;
  role_in_church: string | null;
  date_joined: string | null;
  baptism_status: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  status: string;
  created_at: string;
}

const MAX_PHOTO_SIZE = 2 * 1024 * 1024;

const STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
  "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
  "Ekiti", "Enugu", "FCT - Abuja", "Gombe", "Imo", "Jigawa",
  "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

export default function MemberProfileClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    marital_status: "",
    address: "",
    city: "",
    state: "",
    department: "",
    baptism_status: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const session = localStorage.getItem("tfam_member_session");
      if (!session) return;

      const sessionData = JSON.parse(session);
      const supabase = createClient();

      const { data } = await supabase
        .from("tfam_members")
        .select("*")
        .eq("id", sessionData.id)
        .single();

      if (data) {
        setMember(data);
        setFormData({
          full_name: data.full_name || "",
          phone: data.phone || "",
          gender: data.gender || "",
          date_of_birth: data.date_of_birth || "",
          marital_status: data.marital_status || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          department: data.department || "",
          baptism_status: data.baptism_status || "",
          emergency_contact_name: data.emergency_contact_name || "",
          emergency_contact_phone: data.emergency_contact_phone || "",
        });
      }
      setLoading(false);
    } catch (err) {
      console.error("Load error:", err);
      setLoading(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !member) return;

    if (file.size > MAX_PHOTO_SIZE) {
      toast.error("Photo too large! Max 2 MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setUploadingPhoto(true);

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `member-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("tfam-members")
        .upload(`photos/${fileName}`, file);

      if (uploadError) {
        toast.error("Photo upload failed");
        setUploadingPhoto(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("tfam-members")
        .getPublicUrl(`photos/${fileName}`);

      const { error: updateError } = await supabase
        .from("tfam_members")
        .update({ photo_url: publicUrl })
        .eq("id", member.id);

      if (updateError) {
        toast.error("Failed to update photo");
        setUploadingPhoto(false);
        return;
      }

      setMember({ ...member, photo_url: publicUrl });

      const session = localStorage.getItem("tfam_member_session");
      if (session) {
        const sessionData = JSON.parse(session);
        sessionData.photo_url = publicUrl;
        localStorage.setItem("tfam_member_session", JSON.stringify(sessionData));
      }

      toast.success("✅ Photo updated!");
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!member) return;

    if (!formData.full_name.trim()) {
      toast.error("Full name is required");
      return;
    }

    setIsSaving(true);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("tfam_members")
        .update({
          full_name: formData.full_name.trim(),
          phone: formData.phone.trim(),
          gender: formData.gender || null,
          date_of_birth: formData.date_of_birth || null,
          marital_status: formData.marital_status || null,
          address: formData.address.trim() || null,
          city: formData.city.trim() || null,
          state: formData.state || null,
          department: formData.department.trim() || null,
          baptism_status: formData.baptism_status || null,
          emergency_contact_name: formData.emergency_contact_name.trim() || null,
          emergency_contact_phone: formData.emergency_contact_phone.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", member.id);

      if (error) {
        toast.error(`Error: ${error.message}`);
        setIsSaving(false);
        return;
      }

      const session = localStorage.getItem("tfam_member_session");
      if (session) {
        const sessionData = JSON.parse(session);
        sessionData.full_name = formData.full_name.trim();
        sessionData.department = formData.department.trim();
        localStorage.setItem("tfam_member_session", JSON.stringify(sessionData));
      }

      toast.success("✅ Profile updated!");
      loadProfile();
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading profile..." />;
  if (!member) return null;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Hero With Photo ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">

          {/* Photo */}
          <div className="relative flex-shrink-0">
            {member.photo_url ? (
              <img
                src={member.photo_url}
                alt={member.full_name}
                className="w-28 h-28 rounded-2xl object-cover border-4 border-brand-gold-400/40 shadow-xl"
              />
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-brand-purple-950/80 border-4 border-brand-gold-400/40 flex items-center justify-center text-white font-bold text-4xl shadow-xl">
                {member.full_name.charAt(0)}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              id="member-photo-change"
              disabled={uploadingPhoto}
            />

            <label
              htmlFor="member-photo-change"
              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 flex items-center justify-center cursor-pointer shadow-gold transition-all active:scale-95"
            >
              {uploadingPhoto ? (
                <svg className="w-5 h-5 text-brand-purple-900 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-brand-purple-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                </svg>
              )}
            </label>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-1">
              {member.full_name}
            </h1>
            <p className="text-white/70 font-semibold text-sm mb-3 break-all">
              {member.email}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 text-white/80 font-semibold text-xs">
                🎴 {member.member_id}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 border border-green-500/40 text-green-300 font-semibold text-xs capitalize">
                ✅ {member.status}
              </span>
              {member.department && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/30 text-white/80 font-semibold text-xs">
                  ⛪ {member.department}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit Form ── */}
      <form onSubmit={handleSave} className="space-y-4">

        {/* PERSONAL INFO — keep white for form readability */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="p-4 border-b border-brand-gold-400/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👤</span>
              <div>
                <h2 className="font-heading text-base font-bold text-white">Personal Information</h2>
                <p className="text-brand-purple-200 text-xs">Your basic details</p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">Marital Status</label>
              <select
                value={formData.marital_status}
                onChange={(e) => setFormData({ ...formData, marital_status: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold"
              >
                <option value="">Select status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="widowed">Widowed</option>
                <option value="divorced">Divorced</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">Baptism Status</label>
              <select
                value={formData.baptism_status}
                onChange={(e) => setFormData({ ...formData, baptism_status: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold"
              >
                <option value="not_baptized">Not yet baptized</option>
                <option value="baptized">Baptized (Water)</option>
                <option value="baptized_holy_spirit">Baptized (Water + Holy Spirit)</option>
              </select>
            </div>
          </div>
        </div>

        {/* LOCATION */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="p-4 border-b border-brand-gold-400/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📍</span>
              <div>
                <h2 className="font-heading text-base font-bold text-white">Location</h2>
                <p className="text-brand-purple-200 text-xs">Where you live</p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">State</label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold"
              >
                <option value="">Select state</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* CHURCH INFO */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="p-4 border-b border-brand-gold-400/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⛪</span>
              <div>
                <h2 className="font-heading text-base font-bold text-white">Church Information</h2>
                <p className="text-brand-purple-200 text-xs">Your ministry involvement</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <label className="block text-xs font-bold text-white/80 mb-1">Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="e.g. Choir, Ushering"
              className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold"
            />
          </div>
        </div>

        {/* EMERGENCY CONTACT */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="p-4 border-b border-brand-gold-400/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🆘</span>
              <div>
                <h2 className="font-heading text-base font-bold text-white">Emergency Contact</h2>
                <p className="text-brand-purple-200 text-xs">Who to reach in case of emergency</p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">Contact Name</label>
              <input
                type="text"
                value={formData.emergency_contact_name}
                onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/80 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={formData.emergency_contact_phone}
                onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold"
              />
            </div>
          </div>
        </div>

        {/* ── Save Button — full width mobile ── */}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-base shadow-gold active:scale-95 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          ) : (
            "💾 Save Changes"
          )}
        </button>
      </form>

      {/* ── Account Info ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="p-4 border-b border-brand-gold-400/30">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <h2 className="font-heading text-base font-bold text-white">Account Information</h2>
              <p className="text-brand-purple-200 text-xs">These details cannot be changed by you</p>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30">
            <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-1">Member ID</p>
            <p className="font-black text-white text-lg">{member.member_id}</p>
          </div>
          <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30">
            <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-1">Email</p>
            <p className="font-black text-white break-all">{member.email}</p>
          </div>
          <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30">
            <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-1">Status</p>
            <p className="font-black text-green-300 capitalize text-lg">✅ {member.status}</p>
          </div>
          <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30">
            <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-1">Date Joined</p>
            <p className="font-black text-white">
              {member.date_joined
                ? new Date(member.date_joined).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric",
                  })
                : "—"}
            </p>
          </div>
          <p className="text-white/50 text-xs text-center pt-2">
            To change your email or Member ID, contact the church administrator.
          </p>
        </div>
      </div>

    </div>
  );
}