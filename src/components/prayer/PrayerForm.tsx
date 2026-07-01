"use client";

import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { HandHeart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

const CATEGORIES = [
  { value: "healing", label: "🙏 Healing" },
  { value: "breakthrough", label: "⚡ Breakthrough" },
  { value: "salvation", label: "✝️ Salvation" },
  { value: "marriage", label: "💍 Marriage" },
  { value: "family", label: "👨‍👩‍👧‍👦 Family" },
  { value: "finance", label: "💰 Finance" },
  { value: "career", label: "💼 Career / Business" },
  { value: "deliverance", label: "🕊️ Deliverance" },
  { value: "thanksgiving", label: "🎉 Thanksgiving" },
  { value: "other", label: "📖 Other" },
];

const COUNTRIES = [
  { value: "Nigeria", label: "🇳🇬 Nigeria" },
  { value: "United States", label: "🇺🇸 United States" },
  { value: "United Kingdom", label: "🇬🇧 United Kingdom" },
  { value: "Canada", label: "🇨🇦 Canada" },
  { value: "South Africa", label: "🇿🇦 South Africa" },
  { value: "Ghana", label: "🇬🇭 Ghana" },
  { value: "Kenya", label: "🇰🇪 Kenya" },
  { value: "Australia", label: "🇦🇺 Australia" },
  { value: "Germany", label: "🇩🇪 Germany" },
  { value: "France", label: "🇫🇷 France" },
  { value: "Netherlands", label: "🇳🇱 Netherlands" },
  { value: "Italy", label: "🇮🇹 Italy" },
  { value: "Spain", label: "🇪🇸 Spain" },
  { value: "UAE", label: "🇦🇪 UAE" },
  { value: "Other", label: "🌍 Other Country" },
];

export default function PrayerForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    category: "",
    prayerPoint: "",
    isAnonymous: false,
    showOnWall: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      const { error } = await supabase.from("prayer_requests").insert([
        {
          full_name: formData.isAnonymous ? "Anonymous" : formData.fullName,
          email: formData.email || null,
          phone: formData.phone || null,
          country: formData.country || null,
          category: formData.category,
          prayer_point: formData.prayerPoint,
          is_anonymous: formData.isAnonymous,
          show_on_wall: formData.showOnWall,
        },
      ]);

      if (error) {
        console.error("Supabase error:", error);
        toast.error(`Error: ${error.message}`);
        return;
      }

      toast.success("Prayer request submitted! We are praying with you.", {
        style: {
          background: "#6B1F8A",
          color: "#fff",
          border: "1px solid #FFC72C",
        },
        iconTheme: {
          primary: "#FFC72C",
          secondary: "#6B1F8A",
        },
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        country: "",
        category: "",
        prayerPoint: "",
        isAnonymous: false,
        showOnWall: true,
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
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-purple-100 mb-4">
              <HandHeart className="w-8 h-8 text-brand-purple-600" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
              Submit Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
                Prayer Request
              </span>
            </h2>
            <p className="text-gray-500 text-lg">
              Share what&apos;s on your heart. We&apos;ll pray with you and
              stand with you in faith.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100"
          >
            {/* Anonymous Toggle */}
            <div className="mb-6 p-4 rounded-xl bg-brand-purple-50 border border-brand-purple-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isAnonymous: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-2 border-brand-purple-400 text-brand-purple-600 focus:ring-brand-purple-500"
                />
                <div>
                  <p className="font-bold text-gray-900">
                    Submit Anonymously
                  </p>
                  <p className="text-gray-500 text-xs">
                    Your name won&apos;t be shown, but we&apos;ll still pray
                    for you.
                  </p>
                </div>
              </label>
            </div>

            {!formData.isAnonymous && (
              <div className="mb-5">
                <Input
                  label="Full Name"
                  required
                  placeholder="Your full name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  error={errors.fullName}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <Input
                label="Email (Optional)"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                error={errors.email}
              />
              <Input
                label="Phone (Optional)"
                type="tel"
                placeholder="+234 XXX XXX XXXX"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <Select
                label="Country"
                placeholder="Select your country"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                options={COUNTRIES}
              />
              <Select
                label="Prayer Category"
                required
                placeholder="What's this prayer about?"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                options={CATEGORIES}
                error={errors.category}
              />
            </div>

            <div className="mb-6">
              <Textarea
                label="Your Prayer Request"
                required
                placeholder="Share what's on your heart. Be as detailed as you'd like — we want to pray with understanding."
                rows={6}
                maxLength={1000}
                value={formData.prayerPoint}
                onChange={(e) =>
                  setFormData({ ...formData, prayerPoint: e.target.value })
                }
                error={errors.prayerPoint}
              />
            </div>

            {/* Show on Wall Toggle */}
            <div className="mb-6 p-4 rounded-xl bg-brand-gold-50 border border-brand-gold-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showOnWall}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      showOnWall: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-2 border-brand-gold-400 text-brand-gold-600 focus:ring-brand-gold-500"
                />
                <div>
                  <p className="font-bold text-gray-900">
                    Show on Prayer Wall
                  </p>
                  <p className="text-gray-500 text-xs">
                    Allow others to see and pray for your request (after admin
                    approval).
                  </p>
                </div>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              rightIcon={<HandHeart className="w-5 h-5" />}
            >
              {isSubmitting ? "Submitting..." : "Submit Prayer Request"}
            </Button>

            <p className="text-center text-gray-400 text-xs mt-5">
              Your prayer request is confidential and will be handled with
              care. Requests shown on the wall are moderated by our team.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}