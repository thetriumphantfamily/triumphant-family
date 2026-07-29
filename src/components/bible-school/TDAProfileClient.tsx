// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA PROFILE CLIENT — Student profile management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

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

const MAX_PHOTO_SIZE = 2 * 1024 * 1024; // 2 MB

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
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

export default function TDAProfileClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    address: "",
    city: "",
    state: "",
    department: "",
    years_in_ministry: "",
    next_of_kin_name: "",
    next_of_kin_phone: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const session = localStorage.getItem("tda_student_session");
      if (!session) return;

      const sessionData = JSON.parse(session);
      const supabase = createClient();

      const { data } = await supabase
        .from("tda_students")
        .select("*")
        .eq("id", sessionData.id)
        .single();

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
    } catch (err) {
      console.error("Load error:", err);
      setLoading(false);
    }
  };

  // ━━━ Change photo ━━━
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !student) return;

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
      const fileName = `student-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("tda-files")
        .upload(`students/${fileName}`, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast.error("Photo upload failed");
        setUploadingPhoto(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("tda-files")
        .getPublicUrl(`students/${fileName}`);

      const { error: updateError } = await supabase
        .from("tda_students")
        .update({ photo_url: publicUrl })
        .eq("id", student.id);

      if (updateError) {
        toast.error("Failed to update photo");
        setUploadingPhoto(false);
        return;
      }

      setStudent({ ...student, photo_url: publicUrl });

      // Update session
      const session = localStorage.getItem("tda_student_session");
      if (session) {
        const sessionData = JSON.parse(session);
        sessionData.photo_url = publicUrl;
        localStorage.setItem(
          "tda_student_session",
          JSON.stringify(sessionData)
        );
      }

      toast.success("✅ Photo updated!");
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // ━━━ Save profile ━━━
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!student) return;

    if (!formData.full_name.trim()) {
      toast.error("Full name is required");
      return;
    }

    setIsSaving(true);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("tda_students")
        .update({
          full_name: formData.full_name.trim(),
          phone: formData.phone.trim(),
          gender: formData.gender || null,
          date_of_birth: formData.date_of_birth || null,
          address: formData.address.trim() || null,
          city: formData.city.trim() || null,
          state: formData.state || null,
          department: formData.department.trim() || null,
          years_in_ministry: formData.years_in_ministry
            ? parseInt(formData.years_in_ministry)
            : 0,
          next_of_kin_name: formData.next_of_kin_name.trim() || null,
          next_of_kin_phone: formData.next_of_kin_phone.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", student.id);

      if (error) {
        toast.error(`Error: ${error.message}`);
        setIsSaving(false);
        return;
      }

      // Update session
      const session = localStorage.getItem("tda_student_session");
      if (session) {
        const sessionData = JSON.parse(session);
        sessionData.full_name = formData.full_name.trim();
        localStorage.setItem(
          "tda_student_session",
          JSON.stringify(sessionData)
        );
      }

      toast.success("✅ Profile updated successfully!");
      loadProfile();
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ━━━ HERO WITH PHOTO ━━━ */}
      <div className="relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl p-6 lg:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Photo with camera icon */}
          <div className="relative">
            {student.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={student.photo_url}
                alt={student.full_name}
                className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-brand-gold-400 shadow-gold"
              />
            ) : (
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-brand-gold-400 flex items-center justify-center text-brand-purple-900 font-bold text-4xl border-4 border-brand-gold-400 shadow-gold">
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
              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-brand-gold-400 hover:bg-brand-gold-500 flex items-center justify-center cursor-pointer shadow-lg transition-all hover:scale-110"
            >
              {uploadingPhoto ? (
                <svg
                  className="w-5 h-5 text-brand-purple-900 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-brand-purple-900"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                  />
                </svg>
              )}
            </label>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
              {student.full_name}
            </h1>
            <p className="text-brand-gold-400 font-semibold mb-3">
              {student.email}
            </p>

            {/* Info pills */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-gold-400/20 border border-brand-gold-400/40 text-brand-gold-300 font-semibold text-xs">
                🎓 {student.student_id}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-purple-950/60 border border-brand-purple-500/40 text-brand-purple-100 font-semibold text-xs">
                📚 Level {student.level}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 border border-green-500/40 text-green-300 font-semibold text-xs">
                ✅ {student.status}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-purple-950/60 border border-brand-purple-500/40 text-brand-purple-100 font-semibold text-xs">
                📅 {student.batch}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━ EDIT PROFILE FORM ━━━ */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-3xl p-6 lg:p-8 border-2 border-gray-100 shadow-md"
      >
        <h2 className="font-heading text-xl font-bold text-brand-purple-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">✏️</span>
          Edit Your Information
        </h2>

        <div className="space-y-6">
          {/* Personal Info */}
          <div>
            <h3 className="font-bold text-brand-purple-900 mb-3 text-sm uppercase tracking-widest">
              Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) =>
                    setFormData({ ...formData, date_of_birth: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="font-bold text-brand-purple-900 mb-3 text-sm uppercase tracking-widest">
              Location
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    State
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
                  >
                    <option value="">Select state</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Ministry */}
          <div>
            <h3 className="font-bold text-brand-purple-900 mb-3 text-sm uppercase tracking-widest">
              Ministry
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  placeholder="e.g. Ushering, Choir"
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Years in Ministry
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.years_in_ministry}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      years_in_ministry: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Next of Kin */}
          <div>
            <h3 className="font-bold text-brand-purple-900 mb-3 text-sm uppercase tracking-widest">
              Next of Kin
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.next_of_kin_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      next_of_kin_name: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.next_of_kin_phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      next_of_kin_phone: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              <>💾 Save Changes</>
            )}
          </button>
        </div>
      </form>

      {/* ━━━ ACCOUNT INFO (READ ONLY) ━━━ */}
      <div className="bg-brand-purple-50 rounded-3xl p-6 lg:p-8 border-2 border-brand-purple-100">
        <h3 className="font-bold text-brand-purple-900 mb-4 text-sm uppercase tracking-widest">
          Account Information (Cannot be changed)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 mb-1">Student ID</p>
            <p className="font-bold text-brand-purple-900">
              {student.student_id}
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Email</p>
            <p className="font-bold text-brand-purple-900 break-all">
              {student.email}
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Course Level</p>
            <p className="font-bold text-brand-purple-900">
              Level {student.level} — {LEVEL_NAMES[student.level]}
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Batch</p>
            <p className="font-bold text-brand-purple-900">{student.batch}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Status</p>
            <p className="font-bold text-green-600 capitalize">
              ✅ {student.status}
            </p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Date Joined</p>
            <p className="font-bold text-brand-purple-900">
              {new Date(student.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          To change any of these fields, please contact the school administrator.
        </p>
      </div>
    </div>
  );
}