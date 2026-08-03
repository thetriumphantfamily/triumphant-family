// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER NEXT STEPS – Discipleship track from salvation to TDA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { notifyAdmin } from "@/lib/notifications";
import LoadingScreen from "./LoadingScreen";

interface Progress {
  id: string;
  step_id: string;
  step_name: string;
  stage: number;
  completed_at: string;
}

interface Step {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface Stage {
  number: number;
  title: string;
  subtitle: string;
  steps: Step[];
}

const STAGES: Stage[] = [
  {
    number: 1,
    title: "New Convert",
    subtitle: "Your foundation in Christ",
    steps: [
      { id: "salvation", name: "Assurance of Salvation", description: "Confess Jesus as Lord and Savior. Be born again.", icon: "✝️" },
      { id: "water_baptism", name: "Water Baptism", description: "Be baptized in water as commanded by Jesus.", icon: "💧" },
      { id: "holy_spirit", name: "Holy Spirit Baptism", description: "Receive the baptism of the Holy Spirit with evidence of speaking in tongues.", icon: "🔥" },
    ],
  },
  {
    number: 2,
    title: "Growing Believer",
    subtitle: "Building your spiritual foundation",
    steps: [
      { id: "foundation_class", name: "Foundation Classes", description: "Complete the new believers foundation classes.", icon: "📖" },
      { id: "join_department", name: "Join a Department", description: "Join a ministry department to serve.", icon: "⛪" },
      { id: "personal_bible", name: "Personal Bible Study", description: "Develop daily Bible study habit.", icon: "📕" },
    ],
  },
  {
    number: 3,
    title: "Committed Disciple",
    subtitle: "Becoming a fruitful believer",
    steps: [
      { id: "discipleship_class", name: "Discipleship Class", description: "Complete formal discipleship training.", icon: "🎯" },
      { id: "serve_ministry", name: "Serve in Ministry", description: "Actively serve in your department.", icon: "🙌" },
      { id: "consistent_giving", name: "Consistent Giving", description: "Faithfully tithe and give offerings.", icon: "💰" },
    ],
  },
  {
    number: 4,
    title: "Ready for Bible School",
    subtitle: "Full ministry training awaits",
    steps: [
      { id: "tda_enrollment", name: "Enroll in TDA", description: "Enroll in Triumphant Disciples Academy for full Bible School training.", icon: "🎓" },
    ],
  },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function MemberNextStepsClient() {
  const [loading, setLoading] = useState(true);
  const [memberId, setMemberId] = useState("");
  const [memberName, setMemberName] = useState("");
  const [progress, setProgress] = useState<Progress[]>([]);

  useEffect(() => {
    loadEverything();
  }, []);

  const loadEverything = async () => {
    let foundId = "";
    let foundName = "";

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.includes("member") || key.includes("tfam")) {
          try {
            const val = localStorage.getItem(key);
            if (val) {
              const parsed = JSON.parse(val);
              if (parsed.full_name) {
                foundName = parsed.full_name;
                if (parsed.id) foundId = parsed.id;
                break;
              }
            }
          } catch { /* ignore */ }
        }
      }
    } catch { /* ignore */ }

    setMemberId(foundId);
    setMemberName(foundName);

    if (foundId) {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("tfam_discipleship_progress")
          .select("*")
          .eq("member_id", foundId)
          .order("completed_at", { ascending: true });
        setProgress(data || []);
      } catch (err) { console.error(err); }
    }

    setLoading(false);
  };

  const isCompleted = (stepId: string) => {
    return progress.some((p) => p.step_id === stepId);
  };

  const toggleStep = async (step: Step, stage: number) => {
    if (!memberId) { toast.error("Please login"); return; }

    const alreadyCompleted = isCompleted(step.id);

    try {
      const supabase = createClient();

      if (alreadyCompleted) {
        await supabase
          .from("tfam_discipleship_progress")
          .delete()
          .eq("member_id", memberId)
          .eq("step_id", step.id);
        setProgress((prev) => prev.filter((p) => p.step_id !== step.id));
        toast.success("Step unmarked");
      } else {
        const { data, error } = await supabase
          .from("tfam_discipleship_progress")
          .insert({
            member_id: memberId,
            step_id: step.id,
            step_name: step.name,
            stage: stage,
          })
          .select()
          .single();

        if (error) { toast.error(error.message); return; }
        if (data) setProgress((prev) => [...prev, data]);

        if (["holy_spirit", "discipleship_class", "tda_enrollment"].includes(step.id)) {
          await notifyAdmin({
            title: "🎉 Discipleship Milestone",
            message: `${memberName || "A member"} just completed: ${step.name}`,
            type: "discipleship",
            link: "/admin/church/discipleship",
          });
        }

        toast.success(`✅ ${step.name} completed!`);
      }
    } catch { toast.error("Failed"); }
  };

  const totalSteps = STAGES.reduce((sum, s) => sum + s.steps.length, 0);
  const completedCount = progress.length;
  const percentage = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;
  const firstName = memberName.split(" ")[0] || "";

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading your journey..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Brand Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs md:text-sm uppercase tracking-widest">
              Next Steps
            </span>
          </div>
          <p className="text-white/80 font-semibold text-base mb-1">
            {getGreeting()}{firstName ? `, ${firstName}` : ""}!
          </p>
          <h1 className="font-heading text-xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
            Your Discipleship Journey
          </h1>
          <p className="text-brand-purple-100 text-sm mb-4">
            From new convert to fully trained minister of God.
          </p>

          {/* Progress Bar */}
          <div className="bg-brand-purple-950/60 rounded-full h-4 overflow-hidden border border-brand-gold-400/40 mb-2">
            <div
              className="h-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${percentage}%` }}
            >
              {percentage > 15 && (
                <span className="text-brand-purple-900 text-xs font-black">
                  {percentage}%
                </span>
              )}
            </div>
          </div>
          <p className="text-brand-purple-200 text-xs font-semibold">
            {completedCount} of {totalSteps} steps completed
          </p>
        </div>
      </div>

      {/* ── Stages ── */}
      {STAGES.map((stage) => {
        const stageCompleted = stage.steps.filter((s) => isCompleted(s.id)).length;
        const stageTotal = stage.steps.length;
        const stagePercentage = Math.round((stageCompleted / stageTotal) * 100);
        const isStageComplete = stageCompleted === stageTotal;

        return (
          <div
            key={stage.number}
            className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 ${
              isStageComplete ? "border-green-400/60" : "border-brand-gold-400/40"
            } p-5 shadow-xl`}
          >
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            {/* Stage Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-purple-950/80 border-2 border-brand-gold-400/40 flex items-center justify-center text-white font-black text-xl flex-shrink-0">
                {stage.number}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h2 className="font-heading text-base md:text-xl font-black text-white">
                    {stage.title}
                  </h2>
                  {isStageComplete && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-green-500/20 text-green-300 border border-green-400/40">
                      ✅ Complete
                    </span>
                  )}
                </div>
                <p className="text-brand-purple-200 text-xs font-semibold">
                  {stage.subtitle}
                </p>
                <p className="text-white/60 text-xs font-bold mt-0.5">
                  {stageCompleted}/{stageTotal} steps ({stagePercentage}%)
                </p>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2">
              {stage.steps.map((step) => {
                const completed = isCompleted(step.id);
                const isTdaStep = step.id === "tda_enrollment";

                return (
                  <div
                    key={step.id}
                    className={`rounded-xl p-4 border-2 transition-all ${
                      completed
                        ? "bg-green-500/10 border-green-400/60"
                        : "bg-brand-purple-950/60 border-brand-gold-400/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleStep(step, stage.number)}
                        className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "bg-transparent border-brand-gold-400/40"
                        }`}
                      >
                        {completed && (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        )}
                      </button>

                      {/* Step Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-lg">{step.icon}</span>
                          <p
                            className={`font-black text-sm ${
                              completed
                                ? "text-green-300 line-through"
                                : "text-white"
                            }`}
                          >
                            {step.name}
                          </p>
                        </div>
                        <p
                          className={`text-xs leading-relaxed ${
                            completed ? "text-white/50" : "text-white/70"
                          }`}
                        >
                          {step.description}
                        </p>

                        {/* TDA Enroll Button */}
                        {isTdaStep && !completed && (
                          <Link
                            href="/bible-school/register"
                            className="inline-flex items-center gap-2 mt-3 w-full justify-center py-3 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-sm shadow-gold active:scale-95 transition-all"
                          >
                            🎓 Enroll in TDA Now →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* ── Completion Card ── */}
      {percentage === 100 && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-green-400/60 p-8 shadow-2xl text-center">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-heading text-xl md:text-2xl font-bold text-white mb-3">
            Praise God! You&apos;ve Completed Your Journey!
          </h2>
          <p className="text-white/70 italic text-sm mb-2">
            &ldquo;Well done, thou good and faithful servant.&rdquo;
          </p>
          <p className="text-brand-purple-300 text-xs font-semibold">
            — Matthew 25:23
          </p>
        </div>
      )}
    </div>
  );
}