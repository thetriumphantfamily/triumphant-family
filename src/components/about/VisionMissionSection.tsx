// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VISION & MISSION SECTION — Two side-by-side feature cards
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function VisionMissionSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">

          {/* ═════════════════ VISION CARD ═════════════════ */}
          <div className="group relative bg-gradient-to-br from-brand-purple-700 to-brand-violet-900 rounded-3xl p-10 text-white overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">

            {/* Decorative blob */}
            <div className="absolute top-[-30%] right-[-30%] w-64 h-64 rounded-full bg-brand-gold-400/15 blur-3xl group-hover:scale-110 transition-transform duration-500" />

            <div className="relative z-10">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 flex items-center justify-center mb-6 shadow-gold">
                <svg className="w-8 h-8 text-brand-purple-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>

              {/* Label */}
              <p className="text-brand-gold-400 font-bold text-sm uppercase tracking-widest mb-2">
                Our Vision
              </p>

              {/* Title */}
              <h3 className="font-heading text-3xl md:text-4xl font-bold mb-5 leading-tight">
                Raising a Triumphant Generation
              </h3>

              {/* Description */}
              <p className="text-brand-purple-100 leading-relaxed text-base md:text-lg">
                To raise a global generation of believers who walk in the supernatural
                power of God — demonstrating salvation, healing, deliverance, and
                unstoppable victory in every sphere of life.
              </p>
            </div>
          </div>

          {/* ═════════════════ MISSION CARD ═════════════════ */}
          <div className="group relative bg-white rounded-3xl p-10 overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-brand-purple-100">

            {/* Decorative blob */}
            <div className="absolute top-[-30%] right-[-30%] w-64 h-64 rounded-full bg-brand-purple-100 blur-3xl group-hover:scale-110 transition-transform duration-500" />

            <div className="relative z-10">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-purple-600 to-brand-purple-800 flex items-center justify-center mb-6 shadow-brand">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                </svg>
              </div>

              {/* Label */}
              <p className="text-brand-purple-700 font-bold text-sm uppercase tracking-widest mb-2">
                Our Mission
              </p>

              {/* Title */}
              <h3 className="font-heading text-3xl md:text-4xl font-bold text-brand-purple-900 mb-5 leading-tight">
                Prayer, Worship, Word &amp; Power
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
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