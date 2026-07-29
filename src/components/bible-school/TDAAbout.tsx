// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TDA ABOUT — About the Bible School section
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function TDAAbout() {
  return (
    <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-20 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">
      <div className="relative z-10 container-custom">

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              About TDA
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10 lg:mb-14 max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
            Equipping Believers for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
              Kingdom Impact
            </span>
          </h2>
          <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed">
            The Triumphant Disciples Academy is a comprehensive Bible school
            program designed to build strong disciples, effective ministers,
            and Kingdom-focused believers.
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
          </div>
        </div>

        {/* 3 Cards: Vision, What You Learn, Goal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 max-w-6xl mx-auto">

          {/* Card 1: Vision */}
          <div className="group relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-2xl p-6 lg:p-8 border-2 border-brand-gold-400/40 hover:border-brand-gold-400 hover:shadow-[0_0_25px_rgba(255,199,44,0.25)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-brand-purple-900 mb-5">
              <svg className="w-7 h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            <h3 className="font-heading text-xl lg:text-2xl font-bold text-white mb-3">
              Our Vision
            </h3>

            <p className="text-brand-purple-100 text-sm lg:text-base leading-relaxed">
              To raise a generation of well-grounded, Spirit-filled disciples
              who understand God&rsquo;s Word and are equipped to advance His
              Kingdom in their homes, communities, and nations.
            </p>
          </div>

          {/* Card 2: What You Learn */}
          <div className="group relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-2xl p-6 lg:p-8 border-2 border-brand-gold-400/40 hover:border-brand-gold-400 hover:shadow-[0_0_25px_rgba(255,199,44,0.25)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-brand-purple-900 mb-5">
              <svg className="w-7 h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>

            <h3 className="font-heading text-xl lg:text-2xl font-bold text-white mb-3">
              What You&rsquo;ll Learn
            </h3>

            <p className="text-brand-purple-100 text-sm lg:text-base leading-relaxed">
              Foundational Christian living, church membership, church
              administration, spiritual leadership, ministerial ethics,
              and practical ministry skills across 4 progressive levels.
            </p>
          </div>

          {/* Card 3: Our Goal */}
          <div className="group relative bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-2xl p-6 lg:p-8 border-2 border-brand-gold-400/40 hover:border-brand-gold-400 hover:shadow-[0_0_25px_rgba(255,199,44,0.25)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center text-brand-purple-900 mb-5">
              <svg className="w-7 h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003.001 2.48z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
              </svg>
            </div>

            <h3 className="font-heading text-xl lg:text-2xl font-bold text-white mb-3">
              Our Goal
            </h3>

            <p className="text-brand-purple-100 text-sm lg:text-base leading-relaxed">
              To produce mature believers who can rightly divide the Word of
              truth, plant churches, lead ministries, and finish strong in
              their divine assignments.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}