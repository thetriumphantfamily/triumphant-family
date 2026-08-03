// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHURCH ADMIN DISCIPLESHIP – Overview of member progress
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "./LoadingScreen";

interface MemberProgress {
  member_id: string;
  member_name: string;
  completed_count: number;
  stage: number;
  latest_step: string;
  latest_date: string;
}

const STAGE_NAMES = [
  "Not Started",
  "New Convert",
  "Growing Believer",
  "Committed Disciple",
  "Ready for TDA",
];

const TOTAL_STEPS = 10;

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function ChurchAdminDiscipleshipClient() {
  const [progress, setProgress] = useState<MemberProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadProgress(); }, []);

  const loadProgress = async () => {
    try {
      const supabase = createClient();

      const { data: records } = await supabase
        .from("tfam_discipleship_progress")
        .select("*, member:tfam_members(id, full_name)")
        .order("completed_at", { ascending: false });

      const grouped: Record<string, MemberProgress> = {};

      (records || []).forEach((r: {
        member_id: string;
        step_name: string;
        stage: number;
        completed_at: string;
        member?: { full_name: string } | null;
      }) => {
        const memberId = r.member_id;
        const memberName = r.member?.full_name || "Unknown";

        if (!grouped[memberId]) {
          grouped[memberId] = {
            member_id: memberId,
            member_name: memberName,
            completed_count: 0,
            stage: 0,
            latest_step: r.step_name,
            latest_date: r.completed_at,
          };
        }

        grouped[memberId].completed_count += 1;
        grouped[memberId].stage = Math.max(grouped[memberId].stage, r.stage);
      });

      const list = Object.values(grouped).sort(
        (a, b) => b.completed_count - a.completed_count
      );
      setProgress(list);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const stageStats = [1, 2, 3, 4].map((s) => ({
    stage: s,
    count: progress.filter((p) => p.stage === s).length,
    name: STAGE_NAMES[s],
  }));

  const totalCompleted = progress.filter(
    (p) => p.completed_count === TOTAL_STEPS
  ).length;

  // ✅ LOADING SCREEN
  if (loading) return <LoadingScreen message="Loading discipleship data..." />;

  return (
    <div className="space-y-4 pb-6">

      {/* ── Brand Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">Discipleship</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-2 leading-tight">
            Discipleship Overview
          </h1>
          <p className="text-brand-purple-100 text-sm">
            Track member spiritual growth through discipleship stages.
          </p>
          <div className="flex gap-4 flex-wrap pt-4 mt-4 border-t border-brand-gold-400/30">
            <div className="text-center">
              <p className="text-white font-black text-2xl">{progress.length}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Active</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-2xl">{totalCompleted}</p>
              <p className="text-brand-purple-200 text-xs font-semibold uppercase tracking-widest">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stage Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stageStats.map((s) => (
          <div
            key={s.stage}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4 shadow-xl"
          >
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <p className="text-brand-purple-200 text-xs uppercase tracking-widest font-semibold mb-1">
              Stage {s.stage}
            </p>
            <p className="text-white font-black text-3xl mb-1">{s.count}</p>
            <p className="text-white font-bold text-xs">{s.name}</p>
          </div>
        ))}
      </div>

      {/* ── Members List ── */}
      {progress.length === 0 ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-8 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">No progress yet</h3>
          <p className="text-brand-purple-200 text-sm">
            Members haven&apos;t started their discipleship journey yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-white font-heading font-bold text-base">
            👥 Members on the Journey
          </h2>
          {progress.map((p) => {
            const percentage = Math.round((p.completed_count / TOTAL_STEPS) * 100);
            return (
              <div
                key={p.member_id}
                className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl"
              >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-white text-base truncate">
                      👤 {p.member_name}
                    </p>
                    <p className="text-white font-bold text-xs uppercase tracking-widest mt-0.5">
                      Stage {p.stage} — {STAGE_NAMES[p.stage]}
                    </p>
                    <p className="text-brand-purple-200 text-xs mt-1">
                      Latest: {p.latest_step} — {formatDate(p.latest_date)}
                    </p>
                  </div>
                  <div className="text-center flex-shrink-0">
                    <p className="text-white font-black text-2xl">{percentage}%</p>
                    <p className="text-brand-purple-200 text-xs">
                      {p.completed_count}/{TOTAL_STEPS}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-brand-purple-950/60 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}