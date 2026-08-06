// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBERSHIP PAGE — White gradient + white 3D icons + tight spacing
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MembershipHero from "@/components/membership/MembershipHero";

export const metadata: Metadata = {
  title: "Membership | The Triumphant Family",
  description:
    "Join The Triumphant Family Ministry or login to your member portal. Access giving, prayer requests, devotionals, sermons, events, fellowship, and more.",
};

const ICON_3D_STYLE = {
  color: "#ffffff",
  filter: "drop-shadow(0 2px 0 #e0e0e0) drop-shadow(0 3px 0 #cccccc) drop-shadow(0 4px 6px rgba(0,0,0,0.4)) drop-shadow(0 6px 15px rgba(255,255,255,0.15))",
};

const MEMBER_BENEFITS = [
  {
    emoji: "🙏",
    title: "Prayer & Spiritual Support",
    description:
      "Submit prayer requests, receive care, and stay spiritually connected to the ministry family.",
  },
  {
    emoji: "💰",
    title: "Giving & Stewardship",
    description:
      "Give securely, track your giving history, and stay accountable in your kingdom stewardship.",
  },
  {
    emoji: "📖",
    title: "Daily Growth Tools",
    description:
      "Access devotionals, sermons, Bible reading, announcements, and tools that help you grow in Christ.",
  },
  {
    emoji: "👥",
    title: "Community & Fellowship",
    description:
      "Join small groups, celebrations, church chat, and departments where you can belong and serve.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Register as a Member",
    description:
      "Fill the membership registration form with your details and submit it for review.",
  },
  {
    step: "02",
    title: "Receive Approval",
    description:
      "The church admin reviews your registration and grants you access to the member portal.",
  },
  {
    step: "03",
    title: "Login & Grow",
    description:
      "Login to your member dashboard and begin engaging fully with the life of the ministry.",
  },
];

const MEMBER_FEATURES = [
  "Personal member dashboard",
  "Prayer requests and care access",
  "Giving and giving history",
  "Church announcements and events",
  "Daily devotional and Bible tools",
  "Small groups and church chat",
  "Departments and service opportunities",
  "Digital member ID card",
];

export default function MembershipPage() {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero */}
        <MembershipHero />

        {/* About Membership */}
        <section className="pt-8 pb-10 lg:pt-10 lg:pb-12 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 px-4">
          <div className="container-custom max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
                <span className="text-white font-black text-sm uppercase tracking-widest">
                  Why Membership Matters
                </span>
              </div>

              <h2 className="font-heading text-2xl md:text-4xl font-bold text-white mb-3">
                Membership Is More Than a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
                  Form
                </span>
              </h2>

              <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed">
                It is belonging, accountability, fellowship, spiritual covering,
                and active participation in the life and mission of The Triumphant Family.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
              {MEMBER_BENEFITS.map((item) => (
                <div
                  key={item.title}
                  className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 lg:p-6 shadow-xl"
                >
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                  <div className="relative z-10">
                    <div className="text-4xl mb-3">
                      {item.emoji}
                    </div>
                    <h3 className="font-heading text-lg lg:text-xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Member Features */}
        <section className="pt-8 pb-10 lg:pt-10 lg:pb-12 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 px-4">
          <div className="container-custom max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
                <span className="text-white font-black text-sm uppercase tracking-widest">
                  Portal Features
                </span>
              </div>

              <h2 className="font-heading text-2xl md:text-4xl font-bold text-white mb-3">
                What Members{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
                  Can Access
                </span>
              </h2>

              <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed">
                Every approved member receives access to a complete spiritual and community portal.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              {MEMBER_FEATURES.map((feature) => (
                <div
                  key={feature}
                  className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/30 p-4 shadow-xl"
                >
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                  <div className="flex items-start gap-3">
                    <span className="text-white text-lg mt-0.5">✓</span>
                    <p className="text-white text-sm font-semibold leading-relaxed">
                      {feature}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="pt-8 pb-10 lg:pt-10 lg:pb-12 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 px-4">
          <div className="container-custom max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
                <span className="text-white font-black text-sm uppercase tracking-widest">
                  How It Works
                </span>
              </div>

              <h2 className="font-heading text-2xl md:text-4xl font-bold text-white mb-3">
                Start in{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
                  3 Simple Steps
                </span>
              </h2>

              <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed">
                Getting started as a member is simple and guided.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
              {HOW_IT_WORKS.map((item) => (
                <div
                  key={item.step}
                  className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 lg:p-6 shadow-xl text-center"
                >
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                  <div className="relative z-10">
                    {/* Number circle — WHITE */}
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white text-brand-purple-900 font-black text-lg shadow-lg mb-3">
                      {item.step}
                    </div>
                    <h3 className="font-heading text-lg lg:text-xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="pt-8 pb-10 lg:pt-10 lg:pb-12 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 px-4">
          <div className="container-custom max-w-5xl">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 md:p-10 shadow-2xl text-center">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

              <div className="relative z-10 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
                  <span className="text-white font-black text-sm uppercase tracking-widest">
                    Join the Family
                  </span>
                </div>

                <h2 className="font-heading text-2xl md:text-4xl font-bold text-white mb-3 leading-tight">
                  Ready to{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
                    Belong and Grow?
                  </span>
                </h2>

                <p className="text-brand-purple-100 text-sm md:text-base leading-relaxed mb-6">
                  Register today or login to your portal and continue walking with
                  the family in prayer, fellowship, and triumph.
                </p>

                {/* CTAs — WHITE gradient */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/join-church"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-white to-gray-100 text-brand-purple-900 font-black shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  >
                    Register Now
                  </Link>
                  <Link
                    href="/member/login"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-brand-purple-950/60 border-2 border-brand-gold-400/40 text-white font-black hover:border-brand-gold-400 transition-all"
                  >
                    Member Login
                  </Link>
                </div>

                <div className="mt-6 pt-5 border-t border-brand-gold-400/30">
                  <p className="text-brand-purple-200 text-sm">
                    Need help? Contact us at{" "}
                    <a
                      href="mailto:thetriumphantgrace@gmail.com"
                      className="text-white font-black hover:underline"
                    >
                      thetriumphantgrace@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}