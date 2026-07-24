// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADMIN IMAGE MANAGER PAGE — Manage hero photos
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/admin/Sidebar";
import ImageManager from "@/components/admin/ImageManager";

export default async function AdminImagesPage() {
  // ━━━ AUTH PROTECTION ━━━
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // ━━━ Fetch all hero photos ━━━
  const { data: photos, error } = await supabase
    .from("hero_photos")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching hero photos:", error);
  }

  const allPhotos = photos || [];
  const activeCount = allPhotos.filter((p) => p.is_active).length;
  const inactiveCount = allPhotos.filter((p) => !p.is_active).length;

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
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="text-brand-purple-600 font-semibold">
                Image Manager
              </span>
            </div>

            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-100 mb-3">
                  <span className="w-2 h-2 rounded-full bg-brand-purple-600 animate-pulse" />
                  <span className="text-brand-purple-600 font-semibold text-sm uppercase tracking-widest">
                    Hero Photos
                  </span>
                </div>
                <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-brand-purple-900 mb-2">
                  Image{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
                    Manager 🖼️
                  </span>
                </h1>
                <p className="text-gray-500">
                  Upload and manage hero photos shown across the website
                </p>
              </div>

              {/* Stats badges */}
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-full bg-white border-2 border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
                    Total
                  </p>
                  <p className="text-2xl font-heading font-bold text-brand-purple-900">
                    {allPhotos.length}
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

          {/* Info Card */}
          <div className="mb-6 bg-brand-gold-50 border-2 border-brand-gold-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-brand-purple-900"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                  />
                </svg>
              </div>
              <div>
                <p className="font-bold text-brand-purple-900 mb-1">
                  💡 How Hero Photos Work
                </p>
                <ul className="text-brand-purple-700 text-sm space-y-1 list-disc pl-4">
                  <li>Photos rotate on the hero sections of every page</li>
                  <li>Upload as many photos as you like (max 5 MB each)</li>
                  <li>
                    Only <strong>active</strong> photos are shown to visitors
                  </li>
                  <li>Toggle photos on/off without deleting them</li>
                  <li>Photos display in the order shown below</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Image Manager */}
          <ImageManager initialPhotos={allPhotos} />
        </div>
      </div>
    </div>
  );
}