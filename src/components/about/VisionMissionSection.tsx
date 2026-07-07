// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VISION & MISSION SECTION — Deep purple twin cards
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function VisionMissionSection() {
  return (
    <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">

      <div className="relative z-10 container-custom">

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-purple-900/60 border border-brand-gold-400/40 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              Vision & Mission
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
            Where We Are{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
              Going & Why
            </span>
          </h2>
          <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg leading-relaxed">
            Guided by a clear heavenly mandate — to raise triumphant believers
            and advance the Kingdom of God in every nation.
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">

          {/* VISION CARD */}
          <div className="group bg-brand-purple-900/60 rounded-3xl p-8 lg:p-10 border-2 border-brand-gold-400/30 hover:border-brand-gold-400/70 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">

            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-brand-purple-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>

              <p className="text-brand-gold-400 font-bold text-xs uppercase tracking-widest mb-2">Our Vision</p>

              <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-5 leading-tight">
                Raising a Triumphant Generation
              </h3>

              <p className="text-brand-purple-100 leading-relaxed text-sm md:text-base lg:text-lg text-justify">
                To raise a global generation of believers who walk in the supernatural
                power of God — demonstrating salvation, healing, deliverance, and
                unstoppable victory in every sphere of life.
              </p>
            </div>
          </div>

          {/* MISSION CARD */}
          <div className="group bg-brand-purple-900/60 rounded-3xl p-8 lg:p-10 border-2 border-brand-gold-400/30 hover:border-brand-gold-400/70 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">

            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-brand-purple-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
              </div>

              <p className="text-brand-gold-400 font-bold text-xs uppercase tracking-widest mb-2">Our Mission</p>

              <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-5 leading-tight">
                Prayer, Worship, Word & Power
              </h3>

              <p className="text-brand-purple-100 leading-relaxed text-sm md:text-base lg:text-lg text-justify">
                To equip believers through anointed teaching of the Word, fervent prayer,
                glorious worship, and prophetic ministry — building a family that
                experiences and demonstrates God&rsquo;s power both locally and globally.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}