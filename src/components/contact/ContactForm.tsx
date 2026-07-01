"use client";

import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

const SUBJECTS = [
  { value: "general", label: "General Inquiry" },
  { value: "prayer", label: "Prayer Request" },
  { value: "partnership", label: "Partnership / Giving" },
  { value: "counselling", label: "Counselling" },
  { value: "ministry", label: "Ministry Invitation" },
  { value: "testimony", label: "Share a Testimony" },
  { value: "other", label: "Other" },
];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your name";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.subject) {
      newErrors.subject = "Please select a subject";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please write your message";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
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
      const { error } = await supabase.from("contact_messages").insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message,
        },
      ]);

      if (error) {
        console.error("Supabase error:", error);
        toast.error(`Error: ${error.message}`);
        return;
      }

      toast.success("Message sent! We'll reply within 24 hours.", {
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
        subject: "",
        message: "",
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
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-purple-100 text-brand-purple-600 text-sm font-bold tracking-widest uppercase mb-4">
              Send A Message
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
              Drop Us A{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
                Message
              </span>
            </h2>
            <p className="text-gray-500 text-lg">
              Fill the form below and we&apos;ll get back to you within 24
              hours.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100"
          >
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
                label="Email Address"
                type="email"
                required
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                error={errors.email}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <Input
                label="Phone Number (Optional)"
                type="tel"
                placeholder="+234 XXX XXX XXXX"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <Select
                label="Subject"
                required
                placeholder="Select a topic"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                options={SUBJECTS}
                error={errors.subject}
              />
            </div>

            <div className="mb-6">
              <Textarea
                label="Your Message"
                required
                placeholder="Tell us what's on your heart..."
                rows={6}
                maxLength={1000}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                error={errors.message}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              rightIcon={<Send className="w-5 h-5" />}
            >
              {isSubmitting ? "Sending Message..." : "Send Message"}
            </Button>

            <p className="text-center text-gray-400 text-xs mt-5">
              By submitting this form, you agree to be contacted by The
              Triumphant Family Ministry regarding your inquiry.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}