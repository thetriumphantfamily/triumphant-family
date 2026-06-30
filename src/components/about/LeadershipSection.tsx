// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LEADERSHIP SECTION — Team members from Supabase
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createClient }   from "@/lib/supabase/server";
import SectionHeading     from "@/components/ui/SectionHeading";
import { getInitials }    from "@/lib/utils";

export default async function LeadershipSection() {
  const supabase = await createClient();

  const { data: leaders } = await supabase
    .from("leadership")
    .select("id, full_name, title, role, bio, photo_url, facebook_url, instagram_url")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (!leaders || leaders.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">

        {/* Heading */}
        <div className="mb-14">
          <SectionHeading
            badge="Leadership Team"
            title={
              <>
                Servants of God{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
                  Behind The Vision
                </span>
              </>
            }
            subtitle="The faithful men and women God has gathered to serve His people and advance His Kingdom through The Triumphant Family."
            withDivider
          />
        </div>

        {/* Leaders grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {leaders.map((leader) => (
            <div
              key={leader.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border border-gray-100"
            >
              {/* Photo */}
              <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-brand-purple-100 to-brand-purple-200 overflow-hidden">
                {leader.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={leader.photo_url}
                    alt={leader.full_name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-purple-600 to-brand-purple-800 flex items-center justify-center text-white text-4xl font-heading font-bold shadow-brand">
                      {getInitials(leader.full_name)}
                    </div>
                  </div>
                )}

                {/* Title badge over photo */}
                {leader.title && (
                  <div className="absolute top-4 left-4 bg-brand-gold-400 text-brand-purple-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                    {leader.title}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-1">
                  {leader.full_name}
                </h3>
                <p className="text-brand-gold-600 font-semibold text-sm mb-4">
                  {leader.role}
                </p>

                {leader.bio && (
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 mb-4">
                    {leader.bio}
                  </p>
                )}

                {/* Social links */}
                {(leader.facebook_url || leader.instagram_url) && (
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    {leader.facebook_url && (
                      <a
                        href={leader.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-brand-purple-50 hover:bg-brand-purple-600 text-brand-purple-700 hover:text-white flex items-center justify-center transition-all duration-300"
                        aria-label="Facebook"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 011-1h3v-4h-3a5 5 0 00-5 5v2.01h-2l-.396 3.98h2.396v8.01z"/>
                        </svg>
                      </a>
                    )}
                    {leader.instagram_url && (
                      <a
                        href={leader.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-brand-purple-50 hover:bg-brand-magenta-500 text-brand-purple-700 hover:text-white flex items-center justify-center transition-all duration-300"
                        aria-label="Instagram"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
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