// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LEADERSHIP LIST — Interactive leadership team management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import LeadershipForm from "./LeadershipForm";
import LoadingScreen from "@/components/church/LoadingScreen";

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

export default function LeadershipList({ initialLeaders }: { initialLeaders: Leader[] }) {
  const router = useRouter();
  const [leaders, setLeaders] = useState<Leader[]>(initialLeaders);
  const [showForm, setShowForm] = useState(false);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading] = useState(false);

  if (loading) return <LoadingScreen message="Loading leaders..." />;

  const toggleActive = async (id: string, currentIsActive: boolean) => {
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("leadership").update({ is_active: !currentIsActive }).eq("id", id);
      if (error) throw error;
      setLeaders((prev) => prev.map((l) => l.id === id ? { ...l, is_active: !currentIsActive } : l));
      toast.success(currentIsActive ? "Hidden from public" : "✅ Now visible");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Could not update");
    } finally {
      setBusyId(null);
    }
  };

  const deleteLeader = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    setBusyId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("leadership").delete().eq("id", id);
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

  const handleFormSuccess = (savedLeader: Leader, isEdit: boolean) => {
    if (isEdit) {
      setLeaders((prev) => prev.map((l) => l.id === savedLeader.id ? savedLeader : l));
    } else {
      setLeaders((prev) => [...prev, savedLeader].sort((a, b) => a.display_order - b.display_order));
    }
    setShowForm(false);
    setEditingLeader(null);
    router.refresh();
  };

  return (
    <div>
      {/* Add button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => { setEditingLeader(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all"
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
          onCancel={() => { setShowForm(false); setEditingLeader(null); }}
        />
      )}

      {/* Empty state */}
      {leaders.length === 0 && !showForm && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-12 shadow-xl text-center">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="text-5xl mb-4">👥</div>
          <h3 className="font-heading text-xl font-bold text-white mb-2">No leaders added yet</h3>
          <p className="text-brand-purple-200 font-semibold mb-6">Add your first team member to display on the About page</p>
          <button
            onClick={() => { setEditingLeader(null); setShowForm(true); }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold hover:scale-105 transition-all"
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
                className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl ${!leader.is_active ? "opacity-60" : ""}`}
              >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

                {/* Order badge */}
                <div className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-brand-purple-950/80 text-white text-xs font-black flex items-center justify-center border border-brand-gold-400/40">
                  #{leader.display_order}
                </div>

                {/* Status badge */}
                <div className="absolute top-3 right-3 z-10">
                  {leader.is_active ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-black uppercase tracking-wider">Active</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-purple-950/80 text-white text-[10px] font-black uppercase tracking-wider border border-brand-gold-400/40">Hidden</span>
                  )}
                </div>

                {/* Photo */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  {leader.photo_url ? (
                    <img src={leader.photo_url} alt={leader.full_name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-purple-950/40">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-4xl font-heading font-black text-brand-purple-900">
                        {leader.full_name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}
                  {leader.title && (
                    <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 shadow-gold text-brand-purple-900 text-xs font-black">
                      {leader.title}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-heading text-xl font-black text-white mb-1">{leader.full_name}</h3>
                  {leader.role && (
                    <p className="text-brand-gold-400 text-sm font-semibold mb-3">{leader.role}</p>
                  )}
                  {leader.bio && (
                    <p className="text-brand-purple-200 font-semibold text-sm line-clamp-3 mb-4">{leader.bio}</p>
                  )}

                  {/* Social */}
                  {(leader.facebook_url || leader.instagram_url) && (
                    <div className="flex gap-2 mb-4">
                      {leader.facebook_url && (
                        <a href={leader.facebook_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </a>
                      )}
                      {leader.instagram_url && (
                        <a href={leader.instagram_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white flex items-center justify-center transition-all">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-brand-gold-400/30">
                    <button
                      onClick={() => { setEditingLeader(leader); setShowForm(true); }}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-white text-brand-purple-900 text-xs font-black transition-all"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => toggleActive(leader.id, leader.is_active)}
                      disabled={isBusy}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-brand-purple-950/60 text-white border border-brand-gold-400/40 text-xs font-black transition-all disabled:opacity-50"
                    >
                      {leader.is_active ? "🙈 Hide" : "👁️ Show"}
                    </button>
                    <button
                      onClick={() => deleteLeader(leader.id, leader.full_name)}
                      disabled={isBusy}
                      className="inline-flex items-center justify-center px-3 py-2 rounded-full bg-red-600 text-white text-xs font-black transition-all disabled:opacity-50"
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