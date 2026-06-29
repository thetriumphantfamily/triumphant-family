// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CORE PROMISES SECTION — 6 ministry promise cards
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import SectionHeading from "@/components/ui/SectionHeading";

const PROMISES = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"/>
      </svg>
    ),
    title:       "Explosive Prayer Storms",
    description: "Join us for fire-filled, heaven-shaking prayer sessions that break every chain and open supernatural doors.",
    color:       "from-brand-purple-500 to-brand-purple-700",
    glow:        "group-hover:shadow-[0_0_30px_rgba(107,31,138,0.4)]",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"/>
      </svg>
    ),
    title:       "Glorious Worship",
    description: "Experience the manifest presence of God through anointed worship that transforms the atmosphere and your life.",
    color:       "from-brand-magenta-500 to-brand-purple-600",
    glow:        "group-hover:shadow-[0_0_30px_rgba(217,70,239,0.4)]",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/>
      </svg>
    ),
    title:       "Prophetic Declarations",
    description: "Receive timely, accurate prophetic words that bring clarity, direction, and divine alignment to every area of your life.",
    color:       "from-brand-gold-500 to-brand-gold-400",
    glow:        "group-hover:shadow-[0_0_30px_rgba(255,199,44,0.5)]",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/>
      </svg>
    ),
    title:       "Holy Spirit Encounters",
    description: "Step into life-defining encounters with the Holy Spirit that heal the brokenhearted and release captives into freedom.",
    color:       "from-blue-500 to-brand-purple-600",
    glow:        "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
      </svg>
    ),
    title:       "Healing &amp; Deliverance",
    description: "The God who healed yesterday still heals today. Come with your sickness, pain, and bondage — leave with your miracle.",
    color:       "from-green-500 to-brand-purple-600",
    glow:        "group-hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"/>
      </svg>
    ),
    title:       "Unstoppable Victories",
    description: "We serve a God who makes us more than conquerors. Leave every service with fresh faith, strength, and triumph.",
    color:       "from-brand-purple-600 to-brand-gold-500",
    glow:        "group-hover:shadow-[0_0_30px_rgba(107,31,138,0.4)]",
  },
];

export default function CorePromisesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">

        {/* Heading */}
        <div className="mb-14">
          <SectionHeading
            badge="What We Offer"
            title={
              <>
                God&rsquo;s Best{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
                  For You
                </span>
              </>
            }
            subtitle="Every time you join The Triumphant Family — in person or online — you step into an atmosphere charged with faith, power, and the undeniable presence of God."
            withDivider
          />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {PROMISES.map((promise, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-3xl p-8 shadow-md hover:-translate-y-2 transition-all duration-500 overflow-hidden ${promise.glow}`}
            >
              {/* Gradient top bar */}
              <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${promise.color} rounded-t-3xl`} />

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${promise.color} text-white flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                {promise.icon}
              </div>

              {/* Text */}
              <h3 className="font-heading text-xl font-bold text-brand-purple-900 mb-3">
                {promise.title}
              </h3>
              <p
                className="text-gray-600 leading-relaxed text-sm md:text-base"
                dangerouslySetInnerHTML={{ __html: promise.description }}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}