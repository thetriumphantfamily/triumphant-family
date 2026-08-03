// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA REGISTER FORM – Complete student registration with photo upload
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useState, useRef, FormEvent } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

const MAX_PHOTO_SIZE = 2 * 1024 * 1024;

const LEVELS = [
  { value: "100", label: "100 Level — School of Triumphant Christian Living" },
  { value: "200", label: "200 Level — School of Nurturing" },
  { value: "300", label: "300 Level — School of Church Administration" },
  { value: "400", label: "400 Level — School of Spiritual Leadership & Ministry" },
];

const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
  "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
  "Ekiti", "Enugu", "FCT - Abuja", "Gombe", "Imo", "Jigawa",
  "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

export default function TDARegisterForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<{
    studentId: string;
    name: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    address: "",
    city: "",
    state: "",
    level: "",
    department: "",
    years_in_ministry: "",
    next_of_kin_name: "",
    next_of_kin_phone: "",
    password: "",
    confirm_password: "",
    agree_terms: false,
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_PHOTO_SIZE) { toast.error("Photo too large! Max 2 MB"); return; }
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const generateStudentId = async (): Promise<string> => {
    const supabase = createClient();
    const year = new Date().getFullYear();
    const { count } = await supabase
      .from("tda_students")
      .select("*", { count: "exact", head: true });
    const nextNumber = (count || 0) + 1;
    return `TDA${year}-${String(nextNumber).padStart(4, "0")}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.full_name.trim()) { toast.error("Please enter your full name"); return; }
    if (!formData.email.trim()) { toast.error("Please enter your email"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { toast.error("Please enter a valid email"); return; }
    if (!formData.phone.trim()) { toast.error("Please enter your phone number"); return; }
    if (!formData.gender) { toast.error("Please select your gender"); return; }
    if (!formData.level) { toast.error("Please select your course level"); return; }
    if (!selectedFile) { toast.error("Please upload your passport photograph"); return; }
    if (formData.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (formData.password !== formData.confirm_password) { toast.error("Passwords do not match"); return; }
    if (!formData.agree_terms) { toast.error("Please agree to the terms to continue"); return; }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Check if email already exists
      const { data: existing } = await supabase
        .from("tda_students")
        .select("id")
        .eq("email", formData.email.trim().toLowerCase())
        .single();

      if (existing) {
        toast.error("This email is already registered");
        setIsSubmitting(false);
        return;
      }

      // Upload photo
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `student-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("tda-files")
        .upload(`students/${fileName}`, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        toast.error(`Photo upload failed: ${uploadError.message}`);
        setIsSubmitting(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("tda-files")
        .getPublicUrl(`students/${fileName}`);

      // Generate Student ID
      const studentId = await generateStudentId();

      // ✅ Insert into database — password now included
      const payload = {
        student_id: studentId,
        full_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        gender: formData.gender,
        date_of_birth: formData.date_of_birth || null,
        address: formData.address.trim() || null,
        city: formData.city.trim() || null,
        state: formData.state || null,
        country: "Nigeria",
        photo_url: publicUrl,
        level: formData.level,
        department: formData.department.trim() || null,
        years_in_ministry: formData.years_in_ministry
          ? parseInt(formData.years_in_ministry)
          : 0,
        next_of_kin_name: formData.next_of_kin_name.trim() || null,
        next_of_kin_phone: formData.next_of_kin_phone.trim() || null,
        batch: "Class of 2026",
        status: "pending",
        password: formData.password, // ✅ NOW SAVED
      };

      const { error: dbError } = await supabase
        .from("tda_students")
        .insert(payload);

      if (dbError) {
        toast.error(`Registration failed: ${dbError.message}`);
        setIsSubmitting(false);
        return;
      }

      toast.success("🎉 Registration successful!", {
        style: {
          background: "#6B1F8A",
          color: "#fff",
          border: "1px solid #FFC72C",
        },
        duration: 5000,
      });

      setRegistrationSuccess({
        studentId,
        name: formData.full_name.trim(),
      });

    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  // ─── SUCCESS SCREEN ───
  if (registrationSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl p-8 md:p-12 border-2 border-brand-gold-400/40 shadow-2xl text-center">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
            🎉 Registration Successful!
          </h2>

          <p className="text-brand-purple-100 mb-6">
            Welcome to the Triumphant Disciples Academy,{" "}
            <strong className="text-white">{registrationSuccess.name}</strong>!
          </p>

          <div className="bg-brand-purple-950/60 border-2 border-brand-gold-400/40 rounded-2xl p-6 mb-6">
            <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-2">
              Your Student ID
            </p>
            <p className="font-heading text-3xl md:text-4xl font-bold text-white">
              {registrationSuccess.studentId}
            </p>
            <p className="text-brand-purple-200 text-sm mt-2">
              Save this ID for future reference
            </p>
          </div>

          <div className="bg-brand-purple-950/60 border border-brand-gold-400/30 rounded-2xl p-5 mb-6 text-left">
            <p className="font-bold text-white mb-2">📋 What&apos;s Next?</p>
            <ul className="text-brand-purple-200 text-sm space-y-2 list-disc pl-4">
              <li>Your registration is now pending admin approval</li>
              <li>You will be notified once approved (usually 24-48 hours)</li>
              <li>Once approved, login with your email and password</li>
              <li>Access your student portal, materials, and assignments</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/bible-school/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all"
            >
              Go to Login
            </Link>
            <Link
              href="/bible-school"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-purple-950/60 border-2 border-brand-gold-400/40 text-white font-black hover:border-brand-gold-400 transition-all"
            >
              Back to Bible School
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── REGISTRATION FORM ───
  return (
    <div className="max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl p-6 md:p-10 border-2 border-brand-gold-400/40 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

        {/* ── SECTION 1: PHOTO UPLOAD ── */}
        <div className="mb-8 pb-6 border-b border-brand-gold-400/30">
          <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📸</span>
            Passport Photograph <span className="text-red-400">*</span>
          </h3>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="tda-photo-upload"
          />

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-32 h-32 rounded-2xl object-cover border-2 border-brand-gold-400/40 shadow-xl"
              />
            ) : (
              <div className="w-32 h-32 rounded-2xl bg-brand-purple-950/60 border-2 border-dashed border-brand-gold-400/40 flex items-center justify-center">
                <svg className="w-12 h-12 text-brand-gold-400/40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              </div>
            )}
            <div>
              <label
                htmlFor="tda-photo-upload"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-purple-950/60 border-2 border-brand-gold-400/40 text-white font-bold cursor-pointer hover:border-brand-gold-400 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                {selectedFile ? "Change Photo" : "Upload Photo"}
              </label>
              <p className="text-brand-purple-200 text-xs mt-2">
                JPG, PNG, WEBP • Max 2 MB
              </p>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: PERSONAL INFORMATION ── */}
        <div className="mb-8 pb-6 border-b border-brand-gold-400/30">
          <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">👤</span>
            Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Your full name"
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+234 XXX XXX XXXX"
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Gender <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
                required
              >
                <option value="">Select gender</option>
                {GENDERS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">Date of Birth</label>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">Years in Ministry</label>
              <input
                type="number"
                min="0"
                value={formData.years_in_ministry}
                onChange={(e) => setFormData({ ...formData, years_in_ministry: e.target.value })}
                placeholder="e.g. 5"
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>

        {/* ── SECTION 3: LOCATION ── */}
        <div className="mb-8 pb-6 border-b border-brand-gold-400/30">
          <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📍</span>
            Location
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-white mb-2">Home Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address"
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Akute"
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">State</label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
              >
                <option value="">Select state</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── SECTION 4: ACADEMIC INFO ── */}
        <div className="mb-8 pb-6 border-b border-brand-gold-400/30">
          <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            Academic Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Course Level <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
                required
              >
                <option value="">Select your level</option>
                {LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Department / Ministry (if any)
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Ushering, Choir, Prayer Team"
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>

        {/* ── SECTION 5: NEXT OF KIN ── */}
        <div className="mb-8 pb-6 border-b border-brand-gold-400/30">
          <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">👥</span>
            Next of Kin
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-white mb-2">Name</label>
              <input
                type="text"
                value={formData.next_of_kin_name}
                onChange={(e) => setFormData({ ...formData, next_of_kin_name: e.target.value })}
                placeholder="Next of kin name"
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">Phone</label>
              <input
                type="tel"
                value={formData.next_of_kin_phone}
                onChange={(e) => setFormData({ ...formData, next_of_kin_phone: e.target.value })}
                placeholder="+234 XXX XXX XXXX"
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>

        {/* ── SECTION 6: ACCOUNT SETUP ── */}
        <div className="mb-8 pb-6 border-b border-brand-gold-400/30">
          <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🔐</span>
            Account Setup
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full p-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirm_password}
                  onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                  placeholder="Re-enter password"
                  className="w-full p-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── TERMS AGREEMENT ── */}
        <div className="mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.agree_terms}
              onChange={(e) => setFormData({ ...formData, agree_terms: e.target.checked })}
              className="w-5 h-5 mt-0.5 rounded border-2 border-brand-gold-400 accent-brand-gold-400"
              required
            />
            <span className="text-brand-purple-100 text-sm leading-relaxed">
              I agree to abide by the rules and regulations of the{" "}
              <strong className="text-white">Triumphant Disciples Academy</strong>{" "}
              and commit to attending classes, submitting assignments, and respecting the community.
            </span>
          </label>
        </div>

        {/* ── SUBMIT BUTTON ── */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-base shadow-gold hover:scale-105 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting Registration...
            </>
          ) : (
            <>
              🎓 Submit Registration
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </>
          )}
        </button>

        <p className="text-center text-brand-purple-200 text-xs mt-4">
          Your registration will be reviewed and approved by the admin.
        </p>
      </form>
    </div>
  );
}