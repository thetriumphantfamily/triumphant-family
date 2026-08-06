// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LEADERSHIP SECTION — Deep purple cards
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient } from "@/lib/supabase/server";
import { getInitials }  from "@/lib/utils";

export default async function LeadershipSection() {
  const supabase = await createClient();

  const { data: leaders } = await supabase
    .from("leadership")
    .select("id, full_name, title, role, bio, photo_url, facebook_url, instagram_url")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (!leaders || leaders.length === 0) return null;

  return (
    <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">

      <div className="relative z-10 container-custom">

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-purple-900/60 border border-brand-gold-400/40 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              Leadership Team
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
            Servants of God{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
              Behind The Vision
            </span>
          </h2>
          <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed">
            The faithful men and women God has gathered to serve His people and
            advance His Kingdom through The Triumphant Family.
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
          </div>
        </div>

        {/* Leaders grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {leaders.map((leader) => (
            <div key={leader.id} className="group bg-brand-purple-900/60 rounded-3xl overflow-hidden border-2 border-brand-gold-400/30 hover:border-brand-gold-400/70 transition-all duration-300 hover:-translate-y-1 relative">

              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500 z-10" />

              <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-brand-purple-700 to-brand-violet-900 overflow-hidden">
                {leader.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={leader.photo_url} alt={leader.full_name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-brand-purple-900 text-3xl font-heading font-bold">
                      {getInitials(leader.full_name)}
                    </div>
                  </div>
                )}

                <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-brand-purple-900/80 to-transparent" />

                {leader.title && (
                  <div className="absolute top-5 left-4 bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-gold z-10">
                    {leader.title}
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="font-heading text-xl font-bold text-white mb-1">{leader.full_name}</h3>
                <p className="text-brand-gold-400 font-semibold text-sm mb-4">{leader.role}</p>

                {leader.bio && (
                  <p className="text-brand-purple-100 text-sm leading-relaxed line-clamp-4 mb-4 text-justify">{leader.bio}</p>
                )}

                {(leader.facebook_url || leader.instagram_url) && (
                  <div className="flex items-center gap-2 pt-4 border-t border-brand-gold-400/30">
                    {leader.facebook_url && (
                      <a href={leader.facebook_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-brand-purple-900/60 hover:bg-brand-gold-400 text-white hover:text-brand-purple-900 flex items-center justify-center transition-all duration-300 border border-brand-gold-400/40 hover:border-brand-gold-400" aria-label="Facebook">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 011-1h3v-4h-3a5 5 0 00-5 5v2.01h-2l-.396 3.98h2.396v8.01z" />
                        </svg>
                      </a>
                    )}
                    {leader.instagram_url && (
                      <a href={leader.instagram_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-brand-purple-900/60 hover:bg-brand-gold-400 text-white hover:text-brand-purple-900 flex items-center justify-center transition-all duration-300 border border-brand-gold-400/40 hover:border-brand-gold-400" aria-label="Instagram">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}