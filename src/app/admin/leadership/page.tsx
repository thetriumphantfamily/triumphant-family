// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADMIN LEADERSHIP PAGE — Manage ministry leadership team
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/admin/Sidebar";
import LeadershipList from "@/components/admin/LeadershipList";

export default async function AdminLeadershipPage() {
  // ━━━ AUTH PROTECTION ━━━
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // ━━━ Fetch all leadership (by display order) ━━━
  const { data: leaders, error } = await supabase
    .from("leadership")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching leadership:", error);
  }

  const allLeaders = leaders || [];
  const activeCount = allLeaders.filter((l) => l.is_active).length;
  const inactiveCount = allLeaders.filter((l) => !l.is_active).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8 pt-20 lg:pt-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Link href="/admin" className="hover:text-brand-purple-600">
                Dashboard
              </Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-brand-purple-600 font-semibold">Leadership</span>
            </div>

            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-100 mb-3">
                  <span className="w-2 h-2 rounded-full bg-brand-purple-600 animate-pulse" />
                  <span className="text-brand-purple-600 font-semibold text-sm uppercase tracking-widest">
                    Leadership Team
                  </span>
                </div>
                <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-brand-purple-900 mb-2">
                  Ministry{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
                    Leaders 👥
                  </span>
                </h1>
                <p className="text-gray-500">
                  Manage the leadership team displayed on the About page
                </p>
              </div>

              {/* Stats badges */}
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-full bg-white border-2 border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
                    Total
                  </p>
                  <p className="text-2xl font-heading font-bold text-brand-purple-900">
                    {allLeaders.length}
                  </p>
                </div>
                {activeCount > 0 && (
                  <div className="px-4 py-2 rounded-full bg-green-50 border-2 border-green-200 shadow-sm">
                    <p className="text-xs text-green-600 uppercase tracking-widest font-semibold">
                      Active
                    </p>
                    <p className="text-2xl font-heading font-bold text-green-600">
                      {activeCount}
                    </p>
                  </div>
                )}
                {inactiveCount > 0 && (
                  <div className="px-4 py-2 rounded-full bg-gray-50 border-2 border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
                      Hidden
                    </p>
                    <p className="text-2xl font-heading font-bold text-gray-600">
                      {inactiveCount}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Leadership List (client component) */}
          <LeadershipList initialLeaders={allLeaders} />
        </div>
      </div>
    </div>
  );
}