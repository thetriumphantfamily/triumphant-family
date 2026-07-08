// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TESTIMONY FORM — Clean purple + gold theme
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";

const CATEGORIES = [
  { value: "healing",      label: "🙏 Healing" },
  { value: "breakthrough", label: "⚡ Breakthrough" },
  { value: "salvation",    label: "✝️ Salvation" },
  { value: "marriage",     label: "💍 Marriage" },
  { value: "family",       label: "👨‍👩‍👧‍👦 Family" },
  { value: "finance",      label: "💰 Finance" },
  { value: "career",       label: "💼 Career / Business" },
  { value: "deliverance",  label: "🕊️ Deliverance" },
  { value: "thanksgiving", label: "🎉 Thanksgiving" },
  { value: "other",        label: "📖 Other" },
];

export default function TestimonyForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    location: "",
    category: "",
    testimonyText: "",
    photoUrl: "",
    videoUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Please enter your name";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.testimonyText.trim()) {
      newErrors.testimonyText = "Please share your testimony";
    } else if (formData.testimonyText.trim().length < 30) {
      newErrors.testimonyText = "Testimony must be at least 30 characters";
    } else if (formData.testimonyText.trim().length > 2000) {
      newErrors.testimonyText = "Testimony must be under 2000 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors below");
      return;
    }
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("testimonies").insert([{
        full_name: formData.fullName,
        email: formData.email || null,
        location: formData.location || null,
        category: formData.category,
        testimony_text: formData.testimonyText,
        photo_url: formData.photoUrl || null,
        video_url: formData.videoUrl || null,
      }]);

      if (error) {
        toast.error(`Error: ${error.message}`);
        return;
      }

      toast.success("Testimony submitted! Thank you for sharing.", {
        style: { background: "#6B1F8A", color: "#fff", border: "1px solid #FFC72C" },
        iconTheme: { primary: "#FFC72C", secondary: "#6B1F8A" },
        duration: 5000,
      });

      setFormData({
        fullName: "", email: "", location: "", category: "",
        testimonyText: "", photoUrl: "", videoUrl: "",
      });
      setErrors({});
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="share-testimony"
      className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden"
    >
      <div className="relative z-10 container-custom">
        <div className="max-w-3xl mx-auto">

          {/* Badge */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
              <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
                Share Your Story
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
              Share Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
                Testimony
              </span>
            </h2>
            <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed">
              What has God done for you? Share your testimony to encourage
              others and glorify God.
            </p>
            <div className="flex items-center justify-center mt-4">
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
            </div>
          </div>

          {/* Form card */}
          <div className="bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl p-6 md:p-10 border-2 border-brand-gold-400/40 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Full Name"
                  required
                  placeholder="Your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  error={errors.fullName}
                />
                <Input
                  label="Email (Optional)"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                />
              </div>

              {/* Location + Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Location (Optional)"
                  placeholder="Lagos, Nigeria"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
                <Select
                  label="Category"
                  required
                  placeholder="What's this testimony about?"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  options={CATEGORIES}
                  error={errors.category}
                />
              </div>

              {/* Testimony */}
              <Textarea
                label="Your Testimony"
                required
                placeholder="Share what God has done for you. Be as detailed as you'd like — every testimony blesses someone!"
                rows={8}
                maxLength={2000}
                value={formData.testimonyText}
                onChange={(e) => setFormData({ ...formData, testimonyText: e.target.value })}
                error={errors.testimonyText}
              />

              {/* Photo URL */}
              <div>
                <Input
                  label="Photo URL (Optional)"
                  type="url"
                  placeholder="https://... (link to your photo)"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                />
                <p className="text-xs text-brand-purple-200 mt-1">
                  📸 Upload your photo to Google Drive, Imgur, etc., then paste the link here
                </p>
              </div>

              {/* Video URL */}
              <div>
                <Input
                  label="Video URL (Optional)"
                  type="url"
                  placeholder="https://youtube.com/embed/..."
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                />
                <p className="text-xs text-brand-purple-200 mt-1">
                  🎬 If you have a YouTube video, use the embed URL format: https://youtube.com/embed/VIDEO_ID
                </p>
              </div>

              {/* Submit button — GOLD GRADIENT */}
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
                    Submitting...
                  </>
                ) : (
                  <>
                    🎉 Share My Testimony
                  </>
                )}
              </button>

              <p className="text-center text-brand-purple-300 text-xs">
                Your testimony will be reviewed by our team before appearing
                on the public wall. We handle all submissions with care and
                respect.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}