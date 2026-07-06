// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// OUR STORY SECTION — Ministry history & journey (fully themed)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function OurStorySection() {
  return (
    <section className="relative pt-10 pb-14 lg:pt-12 lg:pb-16 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">

      {/* Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-gold-400/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-brand-magenta-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 container-custom">

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              Our Story
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10 max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
            A Family Born from{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-200">
              Divine Encounter
            </span>
          </h2>
          <p className="text-brand-purple-100 text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            The Triumphant Family is not just a church. It is a family — a movement
            of believers raised to demonstrate the supernatural power of God.
          </p>
          {/* Gold divider */}
          <div className="flex items-center justify-center mt-4">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
          </div>
        </div>

        {/* Story content — glass card */}
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-8 lg:p-12 border border-white/20 relative overflow-hidden">

          {/* Gold top bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

          <div className="space-y-5 text-brand-purple-100 leading-relaxed text-sm md:text-base lg:text-lg text-justify">

            <p>
              The Triumphant Family — The Gleam of Salvation Apostolic Ministry — was
              birthed out of a divine mandate placed upon{" "}
              <strong className="text-white">Prophet Olayiwole Ogunsola</strong>{" "}
              to gather God&rsquo;s people into a family of prayer, prophetic worship,
              and unshakeable faith.
            </p>

            <p>
              What began as small intercessory gatherings has grown into a thriving
              ministry impacting lives across Nigeria and beyond. Today, our prayer
              services, conferences, and online broadcasts reach thousands of believers
              hungry for an authentic encounter with God.
            </p>

            <p>
              We believe that{" "}
              <strong className="text-brand-gold-400">prayer changes things</strong>,
              that the{" "}
              <strong className="text-brand-gold-400">Word of God transforms lives</strong>,
              and that the{" "}
              <strong className="text-brand-gold-400">Holy Spirit still moves with power</strong>{" "}
              today — just as in the days of the apostles. Our services are charged
              with faith, anointing, and the manifest presence of God.
            </p>

            <p>
              Whether you join us in person at our auditorium in Akute, Ogun State,
              or stream our services online from any part of the world, you are
              welcome here. You are not just a guest — you are family.
            </p>
          </div>

          {/* Quote block */}
          <div className="relative mt-10 py-7 px-6 md:px-10 border-l-4 border-brand-gold-400 bg-white/10 rounded-r-2xl">
            <svg className="absolute top-4 left-4 w-8 h-8 text-brand-gold-400/40" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-lg md:text-xl lg:text-2xl font-heading italic text-white leading-relaxed pl-6">
              You were not created to be defeated. You were created to triumph!
            </p>
            <p className="text-brand-gold-400 font-bold text-sm mt-3 pl-6">
              — Prophet Olayiwole Ogunsola
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}