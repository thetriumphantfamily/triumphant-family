// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TESTIMONY FORM — Public submission form saves to Supabase
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your name";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

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
      const { error } = await supabase.from("testimonies").insert([
        {
          full_name: formData.fullName,
          email: formData.email || null,
          location: formData.location || null,
          category: formData.category,
          testimony_text: formData.testimonyText,
          photo_url: formData.photoUrl || null,
          video_url: formData.videoUrl || null,
        },
      ]);

      if (error) {
        console.error("Supabase error:", error);
        toast.error(`Error: ${error.message}`);
        return;
      }

      toast.success("Testimony submitted! Thank you for sharing.", {
        style: {
          background: "#6B1F8A",
          color: "#fff",
          border: "1px solid #FFC72C",
        },
        iconTheme: {
          primary: "#FFC72C",
          secondary: "#6B1F8A",
        },
        duration: 5000,
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        location: "",
        category: "",
        testimonyText: "",
        photoUrl: "",
        videoUrl: "",
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
    <section id="share-testimony" className="py-16 lg:py-24 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          {/* Section heading */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-100 mb-4">
              <span className="w-2 h-2 rounded-full bg-brand-purple-600" />
              <span className="text-brand-purple-600 font-semibold text-sm uppercase tracking-widest">
                Share Your Story
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-brand-purple-900 mb-4">
              Share Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
                Testimony
              </span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              What has God done for you? Share your testimony to encourage
              others and glorify God.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100"
          >
            {/* Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
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
            </div>

            {/* Location + Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <Input
                label="Location (Optional)"
                placeholder="Lagos, Nigeria"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
              <Select
                label="Category"
                required
                placeholder="What's this testimony about?"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                options={CATEGORIES}
                error={errors.category}
              />
            </div>

            {/* Testimony */}
            <div className="mb-5">
              <Textarea
                label="Your Testimony"
                required
                placeholder="Share what God has done for you. Be as detailed as you'd like — every testimony blesses someone!"
                rows={8}
                maxLength={2000}
                value={formData.testimonyText}
                onChange={(e) =>
                  setFormData({ ...formData, testimonyText: e.target.value })
                }
                error={errors.testimonyText}
              />
            </div>

            {/* Photo URL (Optional) */}
            <div className="mb-5">
              <Input
                label="Photo URL (Optional)"
                type="url"
                placeholder="https://... (link to your photo)"
                value={formData.photoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, photoUrl: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                📸 Upload your photo to Google Drive, Imgur, etc., then paste
                the link here
              </p>
            </div>

            {/* Video URL (Optional) */}
            <div className="mb-6">
              <Input
                label="Video URL (Optional)"
                type="url"
                placeholder="https://youtube.com/embed/..."
                value={formData.videoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, videoUrl: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                🎬 If you have a YouTube video, use the embed URL format:
                https://youtube.com/embed/VIDEO_ID
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "🎉 Share My Testimony"}
            </Button>

            <p className="text-center text-gray-400 text-xs mt-5">
              Your testimony will be reviewed by our team before appearing
              on the public wall. We handle all submissions with care and
              respect.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}