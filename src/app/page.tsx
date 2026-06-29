import { SITE } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HOMEPAGE — TEMPORARY CONNECTION TEST
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// This temporary page proves that Supabase is connected by fetching:
//   • Leadership (Prophet Olayiwole — seeded in step 4.6)
//   • Site settings (15 settings — seeded in step 4.6)
// Will be replaced with the real homepage in Step 7.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch leadership data
  const { data: leaders, error: leadersError } = await supabase
    .from("leadership")
    .select("*")
    .order("display_order", { ascending: true });

  // Fetch site settings
  const { data: settings, error: settingsError } = await supabase
    .from("site_settings")
    .select("*")
    .order("key", { ascending: true });

  const connectionWorking = !leadersError && !settingsError;

  return (
    <main className="min-h-screen bg-gradient-hero p-4 md:p-8">
      <div className="max-w-5xl mx-auto py-12 animate-fade-in">

        {/* ━━━ HEADER ━━━ */}
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 rounded-full bg-brand-gold-400/20 backdrop-blur-sm border border-brand-gold-400/40 mb-6">
            <span className="text-brand-gold-300 font-semibold tracking-wider text-sm uppercase">
              🔌 Supabase Connection Test
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4">
            {SITE.name}
          </h1>

          <p className="text-2xl md:text-3xl font-script text-brand-gold-400 mb-4">
            {SITE.tagline}
          </p>
        </div>

        {/* ━━━ CONNECTION STATUS ━━━ */}
        <div className={`mb-8 p-6 rounded-2xl border-2 ${
          connectionWorking
            ? "bg-green-500/20 border-green-400 text-white"
            : "bg-red-500/20 border-red-400 text-white"
        }`}>
          <h2 className="text-2xl font-bold mb-2">
            {connectionWorking ? "✅ CONNECTION SUCCESSFUL!" : "❌ CONNECTION FAILED"}
          </h2>
          <p className="text-sm opacity-90">
            {connectionWorking
              ? "Your Next.js app is successfully connected to Supabase."
              : "There's an issue with your Supabase connection. Check the errors below."}
          </p>

          {leadersError && (
            <div className="mt-4 p-3 bg-red-900/40 rounded-lg">
              <p className="font-semibold">Leadership Error:</p>
              <p className="text-xs">{leadersError.message}</p>
            </div>
          )}

          {settingsError && (
            <div className="mt-4 p-3 bg-red-900/40 rounded-lg">
              <p className="font-semibold">Settings Error:</p>
              <p className="text-xs">{settingsError.message}</p>
            </div>
          )}
        </div>

        {/* ━━━ LEADERSHIP DATA ━━━ */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-heading font-bold text-brand-gold-400 mb-4">
            👤 Leadership Table ({leaders?.length || 0} record{leaders?.length === 1 ? "" : "s"})
          </h2>

          {leaders && leaders.length > 0 ? (
            <div className="space-y-4">
              {leaders.map((leader) => (
                <div
                  key={leader.id}
                  className="p-4 bg-white/10 rounded-xl border border-white/10"
                >
                  <p className="text-brand-gold-300 text-sm font-semibold uppercase tracking-wider">
                    {leader.title}
                  </p>
                  <p className="text-white text-xl font-bold mb-1">
                    {leader.full_name}
                  </p>
                  <p className="text-brand-purple-100 text-sm mb-2">
                    {leader.role}
                  </p>
                  {leader.bio && (
                    <p className="text-brand-purple-200 text-sm leading-relaxed">
                      {leader.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-brand-purple-200 italic">
              No leadership records found.
            </p>
          )}
        </div>

        {/* ━━━ SITE SETTINGS DATA ━━━ */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-heading font-bold text-brand-gold-400 mb-4">
            ⚙️ Site Settings Table ({settings?.length || 0} record{settings?.length === 1 ? "" : "s"})
          </h2>

          {settings && settings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {settings.map((setting) => (
                <div
                  key={setting.id}
                  className="p-3 bg-white/10 rounded-lg border border-white/10"
                >
                  <p className="text-brand-gold-300 text-xs font-mono uppercase mb-1">
                    {setting.key}
                  </p>
                  <p className="text-white text-sm break-words">
                    {setting.value}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-brand-purple-200 italic">
              No settings found.
            </p>
          )}
        </div>

        {/* ━━━ NEXT STEPS ━━━ */}
        <div className="text-center mt-12 p-6 bg-brand-gold-400/10 backdrop-blur-md rounded-2xl border border-brand-gold-400/30">
          <p className="text-brand-gold-300 font-semibold mb-2">
            🚀 Next: Building the real homepage with Navbar, Hero, Sermons, Events, Prayer CTA...
          </p>
          <p className="text-brand-purple-100 text-sm">
            This test page will be replaced with the actual ministry homepage soon.
          </p>
        </div>

      </div>
    </main>
  );
}