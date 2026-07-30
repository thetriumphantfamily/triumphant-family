// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER REGISTER FORM — Church membership registration with photo upload
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState, useRef, FormEvent } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

const MAX_PHOTO_SIZE = 2 * 1024 * 1024;

const MARITAL_STATUS = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "widowed", label: "Widowed" },
  { value: "divorced", label: "Divorced" },
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
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const BAPTISM_OPTIONS = [
  { value: "not_baptized", label: "Not yet baptized" },
  { value: "baptized", label: "Baptized (Water)" },
  { value: "baptized_holy_spirit", label: "Baptized (Water + Holy Spirit)" },
];

export default function MemberRegisterForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<{
    memberId: string;
    name: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    marital_status: "",
    address: "",
    city: "",
    state: "",
    department: "",
    baptism_status: "not_baptized",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    password: "",
    confirm_password: "",
    agree_terms: false,
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_PHOTO_SIZE) {
      toast.error("Photo too large! Max 2 MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const generateMemberId = async (): Promise<string> => {
    const supabase = createClient();
    const year = new Date().getFullYear();

    const { count } = await supabase
      .from("tfam_members")
      .select("*", { count: "exact", head: true });

    const nextNumber = (count || 0) + 1;
    return `TFAM${year}-${String(nextNumber).padStart(4, "0")}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.full_name.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!formData.gender) {
      toast.error("Please select your gender");
      return;
    }
    if (!selectedFile) {
      toast.error("Please upload your passport photograph");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    if (!formData.agree_terms) {
      toast.error("Please agree to the terms to continue");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Check if email exists
      const { data: existing } = await supabase
        .from("tfam_members")
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
      const fileName = `member-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("tfam-members")
        .upload(`photos/${fileName}`, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        toast.error(`Photo upload failed: ${uploadError.message}`);
        setIsSubmitting(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("tfam-members")
        .getPublicUrl(`photos/${fileName}`);

      const memberId = await generateMemberId();

      const payload = {
        member_id: memberId,
        full_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        gender: formData.gender,
        date_of_birth: formData.date_of_birth || null,
        marital_status: formData.marital_status || null,
        address: formData.address.trim() || null,
        city: formData.city.trim() || null,
        state: formData.state || null,
        country: "Nigeria",
        photo_url: publicUrl,
        department: formData.department.trim() || null,
        baptism_status: formData.baptism_status,
        date_joined: new Date().toISOString().split("T")[0],
        emergency_contact_name: formData.emergency_contact_name.trim() || null,
        emergency_contact_phone: formData.emergency_contact_phone.trim() || null,
        status: "pending",
      };

      const { error: dbError } = await supabase
        .from("tfam_members")
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
        memberId,
        name: formData.full_name.trim(),
      });
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  // ━━━ SUCCESS SCREEN ━━━
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
            🎉 Welcome to The Family!
          </h2>

          <p className="text-brand-purple-100 mb-6">
            {registrationSuccess.name}, your membership registration has been submitted!
          </p>

          <div className="bg-brand-purple-950/60 border-2 border-brand-gold-400/40 rounded-2xl p-6 mb-6">
            <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-2">
              Your Member ID
            </p>
            <p className="font-heading text-3xl md:text-4xl font-bold text-brand-gold-400">
              {registrationSuccess.memberId}
            </p>
            <p className="text-brand-purple-100 text-sm mt-2">
              Save this ID for future reference
            </p>
          </div>

          <div className="bg-brand-gold-400/10 border border-brand-gold-400/30 rounded-2xl p-5 mb-6 text-left">
            <p className="font-bold text-brand-gold-400 mb-2">📋 What&rsquo;s Next?</p>
            <ul className="text-brand-purple-100 text-sm space-y-2 list-disc pl-4">
              <li>Your registration is pending admin approval</li>
              <li>You will be notified once approved</li>
              <li>Once approved, login to access your member portal</li>
              <li>Access giving, attendance, devotionals, and more</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/member/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all"
            >
              Go to Login
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-purple-950/60 border-2 border-brand-gold-400/40 text-white font-bold hover:border-brand-gold-400 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ━━━ REGISTRATION FORM ━━━
  return (
    <div className="max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl p-6 md:p-10 border-2 border-brand-gold-400/40 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

        {/* ━━━ PHOTO UPLOAD ━━━ */}
        <div className="mb-8 pb-6 border-b border-brand-gold-400/30">
          <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📸</span>
            Passport Photograph <span className="text-red-400">*</span>
          </h3>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="member-photo" />

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Preview" className="w-32 h-32 rounded-2xl object-cover border-2 border-brand-gold-400 shadow-gold" />
            ) : (
              <div className="w-32 h-32 rounded-2xl bg-brand-purple-950/60 border-2 border-dashed border-brand-gold-400/40 flex items-center justify-center">
                <svg className="w-12 h-12 text-brand-gold-400/40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                </svg>
              </div>
            )}

            <div>
              <label htmlFor="member-photo" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-purple-950/60 border-2 border-brand-gold-400/40 text-white font-bold cursor-pointer hover:border-brand-gold-400 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                {selectedFile ? "Change Photo" : "Upload Photo"}
              </label>
              <p className="text-brand-purple-200 text-xs mt-2">📎 JPG, PNG • Max 2 MB</p>
            </div>
          </div>
        </div>

        {/* ━━━ PERSONAL INFORMATION ━━━ */}
        <div className="mb-8 pb-6 border-b border-brand-gold-400/30">
          <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">👤</span>
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-white mb-2">Full Name <span className="text-brand-gold-400">*</span></label>
              <input type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} placeholder="Your full name" className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 focus:border-brand-gold-400 focus:outline-none text-gray-900 bg-white" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">Email <span className="text-brand-gold-400">*</span></label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 focus:border-brand-gold-400 focus:outline-none text-gray-900 bg-white" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">Phone <span className="text-brand-gold-400">*</span></label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+234 XXX XXX XXXX" className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 focus:border-brand-gold-400 focus:outline-none text-gray-900 bg-white" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">Gender <span className="text-brand-gold-400">*</span></label>
              <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 focus:border-brand-gold-400 focus:outline-none text-gray-900 bg-white" required>
                <option value="">Select gender</option>
                {GENDERS.map((g) => (<option key={g.value} value={g.value}>{g.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">Date of Birth</label>
              <input type="date" value={formData.date_of_birth} onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })} className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 focus:border-brand-gold-400 focus:outline-none text-gray-900 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">Marital Status</label>
              <select value={formData.marital_status} onChange={(e) => setFormData({ ...formData, marital_status: e.target.value })} className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 focus:border-brand-gold-400 focus:outline-none text-gray-900 bg-white">
                <option value="">Select status</option>
                {MARITAL_STATUS.map((m) => (<option key={m.value} value={m.value}>{m.label}</option>))}
              </select>
            </div>
          </div>
        </div>

        {/* ━━━ LOCATION ━━━ */}
        <div className="mb-8 pb-6 border-b border-brand-gold-400/30">
          <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📍</span>
            Location
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-white mb-2">Home Address</label>
              <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Street address" className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 focus:border-brand-gold-400 focus:outline-none text-gray-900 bg-white" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-white mb-2">City</label>
                <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="e.g. Akute" className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 focus:border-brand-gold-400 focus:outline-none text-gray-900 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-white mb-2">State</label>
                <select value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 focus:border-brand-gold-400 focus:outline-none text-gray-900 bg-white">
                  <option value="">Select state</option>
                  {STATES.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ━━━ CHURCH INFO ━━━ */}
        <div className="mb-8 pb-6 border-b border-brand-gold-400/30">
          <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">⛪</span>
            Church Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-white mb-2">Department (if any)</label>
              <input type="text" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="e.g. Choir, Ushering" className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 focus:border-brand-gold-400 focus:outline-none text-gray-900 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">Baptism Status</label>
              <select value={formData.baptism_status} onChange={(e) => setFormData({ ...formData, baptism_status: e.target.value })} className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 focus:border-brand-gold-400 focus:outline-none text-gray-900 bg-white">
                {BAPTISM_OPTIONS.map((b) => (<option key={b.value} value={b.value}>{b.label}</option>))}
              </select>
            </div>
          </div>
        </div>

        {/* ━━━ EMERGENCY CONTACT ━━━ */}
        <div className="mb-8 pb-6 border-b border-brand-gold-400/30">
          <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🆘</span>
            Emergency Contact
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-white mb-2">Contact Name</label>
              <input type="text" value={formData.emergency_contact_name} onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })} placeholder="Emergency contact name" className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 focus:border-brand-gold-400 focus:outline-none text-gray-900 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">Contact Phone</label>
              <input type="tel" value={formData.emergency_contact_phone} onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })} placeholder="+234 XXX XXX XXXX" className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 focus:border-brand-gold-400 focus:outline-none text-gray-900 bg-white" />
            </div>
          </div>
        </div>

        {/* ━━━ ACCOUNT SETUP ━━━ */}
        <div className="mb-8 pb-6 border-b border-brand-gold-400/30">
          <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🔐</span>
            Account Setup
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-white mb-2">Password <span className="text-brand-gold-400">*</span></label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Min 6 characters" className="w-full p-3 pr-12 rounded-xl border-2 border-brand-gold-400/40 focus:border-brand-gold-400 focus:outline-none text-gray-900 bg-white" required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">{showPassword ? "🙈" : "👁️"}</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">Confirm Password <span className="text-brand-gold-400">*</span></label>
              <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} value={formData.confirm_password} onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })} placeholder="Re-enter password" className="w-full p-3 pr-12 rounded-xl border-2 border-brand-gold-400/40 focus:border-brand-gold-400 focus:outline-none text-gray-900 bg-white" required minLength={6} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">{showConfirmPassword ? "🙈" : "👁️"}</button>
              </div>
            </div>
          </div>
        </div>

        {/* ━━━ TERMS ━━━ */}
        <div className="mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={formData.agree_terms} onChange={(e) => setFormData({ ...formData, agree_terms: e.target.checked })} className="w-5 h-5 mt-0.5 rounded border-2 border-brand-gold-400 accent-brand-gold-400" required />
            <span className="text-brand-purple-100 text-sm leading-relaxed">
              I agree to be a committed member of <strong className="text-brand-gold-400">The Triumphant Family Ministry</strong>, to attend services regularly, support the vision, and respect the leadership and community.
            </span>
          </label>
        </div>

        {/* ━━━ SUBMIT ━━━ */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-bold text-base lg:text-lg shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
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
              ⛪ Join The Family
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </>
          )}
        </button>

        <p className="text-center text-brand-purple-200 text-xs mt-4">
          Your registration will be reviewed and approved by the church admin.
        </p>
      </form>
    </div>
  );
}