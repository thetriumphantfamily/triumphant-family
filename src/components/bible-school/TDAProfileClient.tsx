// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA PROFILE CLIENT – Student profile management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/church/LoadingScreen";

interface Student {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string | null;
  date_of_birth: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  photo_url: string | null;
  level: string;
  department: string | null;
  years_in_ministry: number;
  next_of_kin_name: string | null;
  next_of_kin_phone: string | null;
  batch: string;
  status: string;
  created_at: string;
}

const MAX_PHOTO_SIZE = 2 * 1024 * 1024;

const LEVEL_NAMES: Record<string, string> = {
  "100": "School of Triumphant Christian Living",
  "200": "School of Nurturing",
  "300": "School of Church Administration",
  "400": "School of Spiritual Leadership & Ministry",
};

const STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
  "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
  "Ekiti", "Enugu", "FCT - Abuja", "Gombe", "Imo", "Jigawa",
  "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

export default function TDAProfileClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "", phone: "", gender: "", date_of_birth: "",
    address: "", city: "", state: "", department: "",
    years_in_ministry: "", next_of_kin_name: "", next_of_kin_phone: "",
  });

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const session = localStorage.getItem("tda_student_session");
      if (!session) return;
      const sessionData = JSON.parse(session);
      const supabase = createClient();
      const { data } = await supabase
        .from("tda_students").select("*").eq("id", sessionData.id).single();
      if (data) {
        setStudent(data);
        setFormData({
          full_name: data.full_name || "",
          phone: data.phone || "",
          gender: data.gender || "",
          date_of_birth: data.date_of_birth || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          department: data.department || "",
          years_in_ministry: data.years_in_ministry?.toString() || "",
          next_of_kin_name: data.next_of_kin_name || "",
          next_of_kin_phone: data.next_of_kin_phone || "",
        });
      }
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !student) return;
    if (file.size > MAX_PHOTO_SIZE) { toast.error("Photo too large! Max 2 MB"); return; }
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }

    setUploadingPhoto(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `student-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("tda-files").upload(`students/${fileName}`, file);
      if (uploadError) { toast.error("Photo upload failed"); setUploadingPhoto(false); return; }
      const { data: { publicUrl } } = supabase.storage.from("tda-files").getPublicUrl(`students/${fileName}`);
      const { error: updateError } = await supabase.from("tda_students").update({ photo_url: publicUrl }).eq("id", student.id);
      if (updateError) { toast.error("Failed to update photo"); setUploadingPhoto(false); return; }
      setStudent({ ...student, photo_url: publicUrl });
      const session = localStorage.getItem("tda_student_session");
      if (session) {
        const sessionData = JSON.parse(session);
        sessionData.photo_url = publicUrl;
        localStorage.setItem("tda_student_session", JSON.stringify(sessionData));
      }
      toast.success("✅ Photo updated!");
    } catch (err) { console.error(err); toast.error("Something went wrong"); }
    finally { setUploadingPhoto(false); }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!student) return;
    if (!formData.full_name.trim()) { toast.error("Full name is required"); return; }
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("tda_students").update({
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        gender: formData.gender || null,
        date_of_birth: formData.date_of_birth || null,
        address: formData.address.trim() || null,
        city: formData.city.trim() || null,
        state: formData.state || null,
        department: formData.department.trim() || null,
        years_in_ministry: formData.years_in_ministry ? parseInt(formData.years_in_ministry) : 0,
        next_of_kin_name: formData.next_of_kin_name.trim() || null,
        next_of_kin_phone: formData.next_of_kin_phone.trim() || null,
        updated_at: new Date().toISOString(),
      }).eq("id", student.id);

      if (error) { toast.error(`Error: ${error.message}`); setIsSaving(false); return; }

      const session = localStorage.getItem("tda_student_session");
      if (session) {
        const sessionData = JSON.parse(session);
        sessionData.full_name = formData.full_name.trim();
        localStorage.setItem("tda_student_session", JSON.stringify(sessionData));
      }
      toast.success("✅ Profile updated successfully!");
      loadProfile();
    } catch (err) { console.error(err); toast.error("Failed to save"); }
    finally { setIsSaving(false); }
  };

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading your profile..." />;
  if (!student) return null;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Hero With Photo ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">

          {/* Photo */}
          <div className="relative flex-shrink-0">
            {student.photo_url ? (
              <img
                src={student.photo_url}
                alt={student.full_name}
                className="w-28 h-28 rounded-2xl object-cover border-2 border-brand-gold-400/40 shadow-xl"
              />
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-brand-purple-950/80 border-2 border-brand-gold-400/40 flex items-center justify-center text-white font-black text-4xl shadow-xl">
                {student.full_name.charAt(0)}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-change"
              disabled={uploadingPhoto}
            />
            <label
              htmlFor="photo-change"
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              )}
            </label>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-1">
              {student.full_name}
            </h1>
            <p className="text-white/70 font-semibold text-sm mb-3 break-all">
              {student.email}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 text-white font-semibold text-xs">
                🎓 {student.student_id}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/30 text-white font-semibold text-xs">
                📚 Level {student.level}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 border border-green-500/40 text-green-300 font-semibold text-xs capitalize">
                ✅ {student.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit Profile Form — sections on dark bg ── */}
      <form onSubmit={handleSave} className="space-y-4">

        {/* Personal Info */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <h3 className="font-black text-white text-base mb-4 flex items-center gap-2">
            <span>👤</span> Personal Information
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-black text-white/80 mb-2">Full Name <span className="text-red-400">*</span></label>
              <input type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" required />
            </div>
            <div>
              <label className="block text-xs font-black text-white/80 mb-2">Phone Number</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
            </div>
            <div>
              <label className="block text-xs font-black text-white/80 mb-2">Gender</label>
              <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold">
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-white/80 mb-2">Date of Birth</label>
              <input type="date" value={formData.date_of_birth} onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold" />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <h3 className="font-black text-white text-base mb-4 flex items-center gap-2">
            <span>📍</span> Location
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-black text-white/80 mb-2">Address</label>
              <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
            </div>
            <div>
              <label className="block text-xs font-black text-white/80 mb-2">City</label>
              <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
            </div>
            <div>
              <label className="block text-xs font-black text-white/80 mb-2">State</label>
              <select value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold">
                <option value="">Select state</option>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Ministry */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <h3 className="font-black text-white text-base mb-4 flex items-center gap-2">
            <span>⛪</span> Ministry
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-black text-white/80 mb-2">Department</label>
              <input type="text" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Ushering, Choir"
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
            </div>
            <div>
              <label className="block text-xs font-black text-white/80 mb-2">Years in Ministry</label>
              <input type="number" min="0" value={formData.years_in_ministry} onChange={(e) => setFormData({ ...formData, years_in_ministry: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold" />
            </div>
          </div>
        </div>

        {/* Next of Kin */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <h3 className="font-black text-white text-base mb-4 flex items-center gap-2">
            <span>👥</span> Next of Kin
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-black text-white/80 mb-2">Name</label>
              <input type="text" value={formData.next_of_kin_name} onChange={(e) => setFormData({ ...formData, next_of_kin_name: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
            </div>
            <div>
              <label className="block text-xs font-black text-white/80 mb-2">Phone</label>
              <input type="tel" value={formData.next_of_kin_phone} onChange={(e) => setFormData({ ...formData, next_of_kin_phone: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none font-semibold" />
            </div>
          </div>
        </div>

        {/* Save Button — full width mobile */}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          ) : "💾 Save Changes"}
        </button>
      </form>

      {/* ── Account Info (Read Only) ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <h3 className="font-black text-white text-base mb-4">
          🔒 Account Information (Cannot be changed)
        </h3>
        <div className="space-y-3">
          <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30">
            <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-1">Student ID</p>
            <p className="font-black text-white">{student.student_id}</p>
          </div>
          <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30">
            <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-1">Email</p>
            <p className="font-black text-white break-all">{student.email}</p>
          </div>
          <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30">
            <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-1">Course Level</p>
            <p className="font-black text-white">Level {student.level} — {LEVEL_NAMES[student.level]}</p>
          </div>
          <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30">
            <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-1">Batch</p>
            <p className="font-black text-white">{student.batch}</p>
          </div>
          <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30">
            <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-1">Status</p>
            <p className="font-black text-green-300 capitalize">✅ {student.status}</p>
          </div>
          <div className="bg-brand-purple-950/60 rounded-xl p-4 border border-brand-gold-400/30">
            <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-1">Date Joined</p>
            <p className="font-black text-white">
              {new Date(student.created_at).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>
        </div>
        <p className="text-brand-purple-200 text-xs mt-4 font-semibold">
          To change any of these fields, contact the school administrator.
        </p>
      </div>
    </div>
  );
}