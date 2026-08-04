// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SITE ANALYTICS CLIENT — Visual analytics dashboard
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

interface Props {
  dailyData: { date: string; count: number }[];
  topPages: [string, number][];
  deviceCounts: Record<string, number>;
  topCountries: [string, number][];
  totalVisits: number;
}

const PAGE_LABELS: Record<string, string> = {
  "/": "🏠 Homepage",
  "/about": "👥 About",
  "/sermons": "🎬 Sermons",
  "/events": "📅 Events",
  "/prayer": "🙏 Prayer",
  "/testimonies": "✨ Testimonies",
  "/give": "💰 Give",
  "/live": "📺 Live",
  "/contact": "✉️ Contact",
  "/gallery": "📸 Gallery",
  "/membership": "🤝 Membership",
  "/join-church": "⛪ Join Church",
  "/bible-school": "📚 Bible School",
};

const DEVICE_EMOJI: Record<string, string> = {
  mobile: "📱",
  tablet: "📟",
  desktop: "🖥️",
  unknown: "❓",
};

export default function SiteAnalyticsClient({
  dailyData,
  topPages,
  deviceCounts,
  topCountries,
  totalVisits,
}: Props) {
  // ━━━ Chart max value ━━━
  const maxDaily = Math.max(...dailyData.map((d) => d.count), 1);

  // ━━━ Device total ━━━
  const deviceTotal = Object.values(deviceCounts).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-6">

      {/* ━━━ DAILY CHART ━━━ */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <h2 className="text-white font-heading font-black text-xl mb-6">
            📈 Daily Visitors — Last 14 Days
          </h2>
          <div className="flex items-end gap-1 md:gap-2 h-40">
            {dailyData.map((day) => {
              const height = maxDaily > 0 ? (day.count / maxDaily) * 100 : 0;
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="relative w-full flex items-end justify-center" style={{ height: "120px" }}>
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-10">
                      <div className="bg-brand-purple-950 border border-brand-gold-400/40 rounded-lg px-2 py-1 text-xs text-white font-black whitespace-nowrap">
                        {day.count} visits
                      </div>
                    </div>
                    {/* Bar */}
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-brand-gold-500 to-brand-gold-300 transition-all duration-500 min-h-[2px]"
                      style={{ height: `${Math.max(height, 2)}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-brand-purple-300 font-semibold text-center leading-tight">
                    {day.date}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ━━━ TOP PAGES + DEVICES ROW ━━━ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Top Pages */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="relative z-10">
            <h2 className="text-white font-heading font-black text-xl mb-5">
              📄 Top Pages
            </h2>
            {topPages.length === 0 ? (
              <p className="text-brand-purple-200 font-semibold text-center py-6">No data yet</p>
            ) : (
              <div className="space-y-3">
                {topPages.map(([page, count], index) => {
                  const pct = totalVisits > 0 ? Math.round((count / totalVisits) * 100) : 0;
                  const label = PAGE_LABELS[page] || `📄 ${page}`;
                  return (
                    <div key={page}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-brand-purple-300 font-black w-5">#{index + 1}</span>
                          <span className="text-white font-semibold text-sm truncate max-w-[160px]">{label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-brand-purple-200 text-xs font-semibold">{pct}%</span>
                          <span className="text-white font-black text-sm">{count.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="w-full bg-brand-purple-950/60 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 h-1.5 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Devices */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 shadow-xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="relative z-10">
            <h2 className="text-white font-heading font-black text-xl mb-5">
              📱 Device Breakdown
            </h2>
            {Object.keys(deviceCounts).length === 0 ? (
              <p className="text-brand-purple-200 font-semibold text-center py-6">No data yet</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(deviceCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([device, count]) => {
                    const pct = Math.round((count / deviceTotal) * 100);
                    const emoji = DEVICE_EMOJI[device] || "❓";
                    return (
                      <div key={device}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-semibold text-sm capitalize">
                            {emoji} {device}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-brand-purple-200 text-xs font-semibold">{pct}%</span>
                            <span className="text-white font-black">{count.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="w-full bg-brand-purple-950/60 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 h-2 rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Visual donut-style summary */}
            <div className="mt-6 pt-6 border-t border-brand-gold-400/30 grid grid-cols-3 gap-3">
              {Object.entries(deviceCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([device, count]) => {
                  const pct = Math.round((count / deviceTotal) * 100);
                  const emoji = DEVICE_EMOJI[device] || "❓";
                  return (
                    <div key={device} className="bg-brand-purple-950/60 rounded-2xl p-3 border border-brand-gold-400/40 text-center">
                      <div className="text-2xl mb-1">{emoji}</div>
                      <p className="text-white font-black text-lg">{pct}%</p>
                      <p className="text-brand-purple-200 text-xs font-semibold capitalize">{device}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* ━━━ TOP COUNTRIES ━━━ */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <h2 className="text-white font-heading font-black text-xl mb-5">
            🌍 Top Countries
          </h2>
          {topCountries.length === 0 ? (
            <p className="text-brand-purple-200 font-semibold text-center py-6">No data yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {topCountries.map(([country, count], index) => {
                const pct = totalVisits > 0 ? Math.round((count / totalVisits) * 100) : 0;
                return (
                  <div key={country} className="flex items-center gap-3">
                    <span className="text-brand-purple-300 font-black text-xs w-5">#{index + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-semibold text-sm capitalize">
                          🌍 {country === "unknown" ? "Unknown" : country}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-brand-purple-200 text-xs font-semibold">{pct}%</span>
                          <span className="text-white font-black text-sm">{count.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="w-full bg-brand-purple-950/60 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 h-1.5 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ━━━ INFO NOTE ━━━ */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-6 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-brand-purple-900" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
          </div>
          <div>
            <p className="font-black text-white mb-2">💡 How Tracking Works</p>
            <ul className="text-brand-purple-200 font-semibold text-sm space-y-1 list-disc pl-4">
              <li>Every page visit is automatically recorded</li>
              <li>Device type detected from browser (mobile/desktop/tablet)</li>
              <li>Country detected from browser language settings</li>
              <li>Live Now = visitors active in last 5 minutes</li>
              <li>Data updates every time a visitor loads a page</li>
              <li>No cookies or invasive tracking — fully privacy-friendly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}