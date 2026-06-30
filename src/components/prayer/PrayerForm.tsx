// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRAYER FORM — Interactive form that submits prayers to Supabase
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

import Button         from "@/components/ui/Button";
import Input          from "@/components/ui/Input";
import Textarea       from "@/components/ui/Textarea";
import Select         from "@/components/ui/Select";
import SectionHeading from "@/components/ui/SectionHeading";

// ── Prayer category options ──
const PRAYER_CATEGORIES = [
  { value: "healing",      label: "🙌 Healing" },
  { value: "breakthrough", label: "⚡ Breakthrough" },
  { value: "salvation",    label: "✝️ Salvation" },
  { value: "marriage",     label: "💍 Marriage & Relationships" },
  { value: "family",       label: "👨‍👩‍👧 Family" },
  { value: "finance",      label: "💰 Finance & Provision" },
  { value: "career",       label: "📈 Career & Business" },
  { value: "deliverance",  label: "🔓 Deliverance" },
  { value: "thanksgiving", label: "🙏 Thanksgiving" },
  { value: "other",        label: "✨ Other" },
];

// ── Country options (most common) ──
const COUNTRIES = [
  "Nigeria", "United States", "United Kingdom", "Canada", "Ghana",
  "South Africa", "Kenya", "Australia", "Germany", "France",
  "Netherlands", "United Arab Emirates", "India", "Brazil", "Other",
];

export default function PrayerForm() {
  // ── Form state ──
  const [formData, setFormData] = useState({
    full_name:     "",
    email:         "",
    phone:         "",
    country:       "",
    prayer_point:  "",
    category:      "",
    is_anonymous:  false,
    show_on_wall:  true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors,       setErrors]       = useState<Record<string, string>>({});

  // ── Validate form ──
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim() && !formData.is_anonymous) {
      newErrors.full_name = "Please enter your name (or check Anonymous)";
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.prayer_point.trim()) {
      newErrors.prayer_point = "Please share your prayer request";
    } else if (formData.prayer_point.trim().length < 10) {
      newErrors.prayer_point = "Prayer request must be at least 10 characters";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit handler ──
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors and try again");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("prayer_requests")
        .insert([{
          full_name:    formData.is_anonymous ? "Anonymous" : formData.full_name.trim(),
          email:        formData.email.trim() || null,
          phone:        formData.phone.trim() || null,
          country:      formData.country || null,
          prayer_point: formData.prayer_point.trim(),
          category:     formData.category,
          is_anonymous: formData.is_anonymous,
          show_on_wall: formData.show_on_wall,
          is_approved:  false,   // admin must approve
          is_answered:  false,
        }]);

      if (error) throw error;

      // Success!
      toast.success("🙏 Prayer request received! We are praying for you.", {
        duration: 5000,
        style: {
          background: "#6B1F8A",
          color:      "#fff",
          padding:    "16px",
          fontWeight: "bold",
        },
      });

      // Reset form
      setFormData({
        full_name:    "",
        email:        "",
        phone:        "",
        country:      "",
        prayer_point: "",
        category:     "",
        is_anonymous: false,
        show_on_wall: true,
      });
      setErrors({});

    } catch (err) {
      console.error("Prayer submission error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-white" id="form">
      <div className="container-custom">

        {/* Heading */}
        <div className="mb-12">
          <SectionHeading
            badge="Submit Your Prayer"
            title={
              <>
                Share What&rsquo;s On{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
                  Your Heart
                </span>
              </>
            }
            subtitle="Your prayer is safe with us. Fill out the form below and our prayer team will lift you up before the throne of grace."
            withDivider
          />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-gradient-to-br from-brand-purple-50 to-white border border-brand-purple-100 rounded-3xl p-6 md:p-10 shadow-lg space-y-6"
        >

          {/* Anonymous toggle */}
          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border-2 border-brand-purple-100">
            <input
              type="checkbox"
              id="is_anonymous"
              checked={formData.is_anonymous}
              onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
              className="w-5 h-5 rounded text-brand-purple-600 focus:ring-2 focus:ring-brand-purple-300 cursor-pointer"
            />
            <label htmlFor="is_anonymous" className="text-sm text-gray-700 cursor-pointer font-medium">
              Submit anonymously (hide my name)
            </label>
          </div>

          {/* Name + Email row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              required={!formData.is_anonymous}
              placeholder="John Doe"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              error={errors.full_name}
              disabled={formData.is_anonymous}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              helperText="Optional — for follow-up"
            />
          </div>

          {/* Phone + Country row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+234 800 000 0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              helperText="Optional"
            />
            <Select
              label="Country"
              placeholder="Select your country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              options={COUNTRIES.map((c) => ({ value: c, label: c }))}
            />
          </div>

          {/* Category */}
          <Select
            label="Prayer Category"
            required
            placeholder="What is this prayer about?"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={PRAYER_CATEGORIES}
            error={errors.category}
          />

          {/* Prayer point */}
          <Textarea
            label="Your Prayer Request"
            required
            placeholder="Share what you need prayer for. Be as specific as you'd like — your request is in safe hands..."
            rows={6}
            value={formData.prayer_point}
            onChange={(e) => setFormData({ ...formData, prayer_point: e.target.value })}
            error={errors.prayer_point}
            showCount
            maxLength={1000}
            currentValue={formData.prayer_point}
          />

          {/* Show on wall toggle */}
          <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border-2 border-brand-purple-100">
            <input
              type="checkbox"
              id="show_on_wall"
              checked={formData.show_on_wall}
              onChange={(e) => setFormData({ ...formData, show_on_wall: e.target.checked })}
              className="w-5 h-5 rounded text-brand-purple-600 focus:ring-2 focus:ring-brand-purple-300 cursor-pointer mt-0.5 flex-shrink-0"
            />
            <label htmlFor="show_on_wall" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
              <span className="font-semibold">Display on Prayer Wall</span>
              <span className="block text-xs text-gray-500 mt-1">
                Let others see your prayer (after admin approval) so they can pray with you.
                Personal details (email, phone) are always private.
              </span>
            </label>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            variant="gold"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            leftIcon={
              !isSubmitting && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )
            }
          >
            {isSubmitting ? "Sending your prayer..." : "Send Prayer Request"}
          </Button>

          {/* Privacy note */}
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            🔒 Your information is kept strictly confidential.
            We will never share your details with third parties.
          </p>
        </form>

      </div>
    </section>
  );
}