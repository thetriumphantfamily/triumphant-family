// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRAYER FORM — Submit prayer request (clean, no blobs)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import Input    from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select   from "@/components/ui/Select";
import Button   from "@/components/ui/Button";

const CATEGORIES = [
  { value: "healing",      label: "🙌 Healing" },
  { value: "breakthrough", label: "⚡ Breakthrough" },
  { value: "salvation",    label: "✝ Salvation" },
  { value: "marriage",     label: "💍 Marriage" },
  { value: "family",       label: "👨‍👩‍👧‍👦 Family" },
  { value: "finance",      label: "💰 Finance" },
  { value: "career",       label: "💼 Career / Business" },
  { value: "deliverance",  label: "🕊️ Deliverance" },
  { value: "thanksgiving", label: "🎉 Thanksgiving" },
  { value: "other",        label: "📖 Other" },
];

const COUNTRIES = [
  { value: "Nigeria",        label: "🇳🇬 Nigeria" },
  { value: "United States",  label: "🇺🇸 United States" },
  { value: "United Kingdom", label: "🇬🇧 United Kingdom" },
  { value: "Canada",         label: "🇨🇦 Canada" },
  { value: "South Africa",   label: "🇿🇦 South Africa" },
  { value: "Ghana",          label: "🇬🇭 Ghana" },
  { value: "Kenya",          label: "🇰🇪 Kenya" },
  { value: "Australia",      label: "🇦🇺 Australia" },
  { value: "Germany",        label: "🇩🇪 Germany" },
  { value: "France",         label: "🇫🇷 France" },
  { value: "Netherlands",    label: "🇳🇱 Netherlands" },
  { value: "Italy",          label: "🇮🇹 Italy" },
  { value: "Spain",          label: "🇪🇸 Spain" },
  { value: "UAE",            label: "🇦🇪 UAE" },
  { value: "Other",          label: "🌍 Other Country" },
];

export default function PrayerForm() {
  const [formData, setFormData] = useState({
    fullName:    "",
    email:       "",
    phone:       "",
    country:     "",
    category:    "",
    prayerPoint: "",
    isAnonymous: false,
    showOnWall:  true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors]             = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.isAnonymous && !formData.fullName.trim()) {
      newErrors.fullName = "Please enter your name (or check anonymous)";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    if (!formData.prayerPoint.trim()) {
      newErrors.prayerPoint = "Please write your prayer request";
    } else if (formData.prayerPoint.trim().length < 10) {
      newErrors.prayerPoint = "Prayer request must be at least 10 characters";
    } else if (formData.prayerPoint.trim().length > 1000) {
      newErrors.prayerPoint = "Prayer request must be under 1000 characters";
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
      const { error } = await supabase.from("prayer_requests").insert([{
        full_name:    formData.isAnonymous ? "Anonymous" : formData.fullName,
        email:        formData.email || null,
        phone:        formData.phone || null,
        country:      formData.country || null,
        category:     formData.category,
        prayer_point: formData.prayerPoint,
        is_anonymous: formData.isAnonymous,
        show_on_wall: formData.showOnWall,
      }]);

      if (error) {
        toast.error(`Error: ${error.message}`);
        return;
      }

      toast.success("Prayer request submitted! We are praying with you.", {
        style: {
          background: "#6B1F8A",
          color:      "#fff",
          border:     "1px solid #FFC72C",
        },
        iconTheme: { primary: "#FFC72C", secondary: "#6B1F8A" },
      });

      setFormData({
        fullName: "", email: "", phone: "", country: "",
        category: "", prayerPoint: "", isAnonymous: false, showOnWall: true,
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
      id="form"
      className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden"
    >
      <div className="relative z-10 container-custom">
        <div className="max-w-3xl mx-auto">

          {/* Badge */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
              <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
                Prayer Request
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
              Submit Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
                Prayer Request
              </span>
            </h2>
            <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed">
              Share what&apos;s on your heart. We&apos;ll pray with you and
              stand with you in faith.
            </p>
            <div className="flex items-center justify-center mt-4">
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
            </div>
          </div>

          {/* Form glass card */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-10 border-2 border-white/20 relative overflow-hidden">

            {/* Gold top bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Anonymous Toggle */}
              <div className="p-4 rounded-2xl bg-brand-purple-900/40 border border-white/20">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAnonymous}
                    onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                    className="w-5 h-5 rounded border-2 border-brand-gold-400 text-brand-gold-500 focus:ring-brand-gold-400 bg-white/20"
                  />
                  <div>
                    <p className="font-bold text-white text-sm">Submit Anonymously</p>
                    <p className="text-brand-purple-200 text-xs mt-0.5">
                      Your name won&apos;t be shown, but we&apos;ll still pray for you.
                    </p>
                  </div>
                </label>
              </div>

              {/* Full name */}
              {!formData.isAnonymous && (
                <Input
                  label="Full Name"
                  required
                  placeholder="Your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  error={errors.fullName}
                />
              )}

              {/* Email + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Email (Optional)"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                />
                <Input
                  label="Phone (Optional)"
                  type="tel"
                  placeholder="+234 XXX XXX XXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              {/* Country + Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Select
                  label="Country"
                  placeholder="Select your country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  options={COUNTRIES}
                />
                <Select
                  label="Prayer Category"
                  required
                  placeholder="What's this prayer about?"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  options={CATEGORIES}
                  error={errors.category}
                />
              </div>

              {/* Prayer point */}
              <Textarea
                label="Your Prayer Request"
                required
                placeholder="Share what's on your heart. Be as detailed as you'd like — we want to pray with understanding."
                rows={6}
                maxLength={1000}
                value={formData.prayerPoint}
                onChange={(e) => setFormData({ ...formData, prayerPoint: e.target.value })}
                error={errors.prayerPoint}
              />

              {/* Show on Wall Toggle */}
              <div className="p-4 rounded-2xl bg-brand-purple-900/40 border border-brand-gold-400/30">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showOnWall}
                    onChange={(e) => setFormData({ ...formData, showOnWall: e.target.checked })}
                    className="w-5 h-5 rounded border-2 border-brand-gold-400 text-brand-gold-500 focus:ring-brand-gold-400 bg-white/20"
                  />
                  <div>
                    <p className="font-bold text-white text-sm">Show on Prayer Wall</p>
                    <p className="text-brand-purple-200 text-xs mt-0.5">
                      Allow others to see and pray for your request (after admin approval).
                    </p>
                  </div>
                </label>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                rightIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                }
              >
                {isSubmitting ? "Submitting..." : "Submit Prayer Request"}
              </Button>

              <p className="text-center text-brand-purple-300 text-xs">
                Your prayer request is confidential and will be handled with care.
                Requests shown on the wall are moderated by our team.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}