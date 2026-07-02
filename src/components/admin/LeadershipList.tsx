// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LEADERSHIP LIST — Interactive leadership team management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LeadershipForm from "./LeadershipForm";

interface Leader {
  id: string;
  full_name: string;
  title: string | null;
  role: string | null;
  bio: string | null;
  photo_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export default function LeadershipList({
  initialLeaders,
}: {
  initialLeaders: Leader[];
}) {
  const router = useRouter();
  const [leaders, setLeaders] = useState<Leader[]>(initialLeaders);
  const [showForm, setShowForm] = useState(false);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // ━━━ Toggle active status ━━━
  const toggleActive = async (id: string, currentIsActive: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("leadership")
        .update({ is_active: !currentIsActive })
        .eq("id", id);

      if (error) throw error;

      setLeaders((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, is_active: !currentIsActive } : l
        )
      );
      toast.success(currentIsActive ? "Hidden from public" : "✅ Now visible");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update");
    } finally {
      setBusyId(null);
    }
  };

  // ━━━ Delete leader ━━━
  const deleteLeader = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;

    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("leadership")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setLeaders((prev) => prev.filter((l) => l.id !== id));
      toast.success("Leader deleted");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not delete");
    } finally {
      setBusyId(null);
    }
  };

  // ━━━ Handle form success ━━━
  const handleFormSuccess = (savedLeader: Leader, isEdit: boolean) => {
    if (isEdit) {
      setLeaders((prev) =>
        prev.map((l) => (l.id === savedLeader.id ? savedLeader : l))
      );
    } else {
      setLeaders((prev) => [...prev, savedLeader].sort((a, b) => a.display_order - b.display_order));
    }
    setShowForm(false);
    setEditingLeader(null);
    router.refresh();
  };

  // ━━━ Show form (add mode) ━━━
  const handleAddNew = () => {
    setEditingLeader(null);
    setShowForm(true);
  };

  // ━━━ Show form (edit mode) ━━━
  const handleEdit = (leader: Leader) => {
    setEditingLeader(leader);
    setShowForm(true);
  };

  return (
    <div>
      {/* Add new button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 hover:from-brand-gold-500 hover:to-brand-gold-600 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add New Leader
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <LeadershipForm
          leader={editingLeader}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingLeader(null);
          }}
        />
      )}

      {/* Empty state */}
      {leaders.length === 0 && !showForm && (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-purple-100 mb-4">
            <svg className="w-10 h-10 text-brand-purple-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-2">
            No leaders added yet
          </h3>
          <p className="text-gray-500 mb-4">
            Add your first team member to display on the About page
          </p>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-purple-600 hover:bg-brand-purple-700 text-white font-bold transition-all"
          >
            + Add First Leader
          </button>
        </div>
      )}

      {/* Leaders grid */}
      {leaders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaders.map((leader) => {
            const isBusy = busyId === leader.id;

            return (
              <div
                key={leader.id}
                className={`relative bg-white rounded-3xl overflow-hidden border-2 transition-all shadow-md hover:shadow-xl ${
                  leader.is_active
                    ? "border-gray-100 hover:border-brand-gold-400"
                    : "border-gray-200 opacity-60 grayscale"
                }`}
              >
                {/* Order badge */}
                <div className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-brand-purple-900 text-white text-xs font-bold flex items-center justify-center shadow-md">
                  #{leader.display_order}
                </div>

                {/* Status badge */}
                <div className="absolute top-3 right-3 z-10">
                  {leader.is_active ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-500 text-white text-[10px] font-bold uppercase tracking-wider">
                      Hidden
                    </span>
                  )}
                </div>

                {/* Photo */}
                <div className="relative aspect-[4/5] bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">
                  {leader.photo_url ? (
                    <Image
                      src={leader.photo_url}
                      alt={leader.full_name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-4xl font-heading font-bold text-brand-purple-900">
                        {leader.full_name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}

                  {/* Title overlay */}
                  {leader.title && (
                    <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold text-brand-purple-900 text-xs font-bold">
                      {leader.title}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-1">
                    {leader.full_name}
                  </h3>
                  {leader.role && (
                    <p className="text-brand-purple-600 text-sm font-semibold mb-3">
                      {leader.role}
                    </p>
                  )}
                  {leader.bio && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {leader.bio}
                    </p>
                  )}

                  {/* Social icons */}
                  {(leader.facebook_url || leader.instagram_url) && (
                    <div className="flex gap-2 mb-4">
                      {leader.facebook_url && (
                        <a
                          href={leader.facebook_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </a>
                      )}
                      {leader.instagram_url && (
                        <a
                          href={leader.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:opacity-90 text-white flex items-center justify-center transition-all"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(leader)}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-brand-purple-100 hover:bg-brand-purple-200 text-brand-purple-700 text-xs font-bold transition-all"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => toggleActive(leader.id, leader.is_active)}
                      disabled={isBusy}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 text-xs font-bold transition-all disabled:opacity-50"
                    >
                      {leader.is_active ? "🙈 Hide" : "👁️ Show"}
                    </button>
                    <button
                      onClick={() => deleteLeader(leader.id, leader.full_name)}
                      disabled={isBusy}
                      className="inline-flex items-center justify-center px-3 py-2 rounded-full bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-700 text-xs font-bold transition-all disabled:opacity-50"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}