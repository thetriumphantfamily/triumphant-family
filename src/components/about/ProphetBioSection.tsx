// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PROPHET BIO SECTION — Founder box below photo + no CTAs
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function ProphetBioSection() {
  return (
    <section className="relative pt-8 pb-10 lg:pt-10 lg:pb-12 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 overflow-hidden">
      <div className="relative z-10 container-custom">
        {/* Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border border-brand-gold-400/40 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest">
              Meet the Man of God
            </span>
          </div>
        </div>

        {/* MOBILE LAYOUT */}
        <div className="lg:hidden">
          <div className="text-center mb-6">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
              Prophet{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
                Olayiwole Ogunsola
              </span>
            </h2>
            <p className="text-white font-semibold text-base">
              Founder &amp; General Overseer
            </p>
            <div className="flex items-center justify-center mt-3">
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-gold-400 to-transparent" />
            </div>
          </div>

          {/* Photo */}
          <div className="flex justify-center mb-4">
            <div className="relative w-[260px] h-[340px] rounded-3xl overflow-hidden shadow-2xl border-2 border-brand-gold-400/40">
              <img
                src="/images/prophet/prophet.png"
                alt="Prophet Olayiwole Ogunsola"
                loading="eager"
                className="w-full h-full object-cover"
                style={{ objectPosition: "40% top" }}
              />
              <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-brand-purple-900/90 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-4 text-center">
                <p className="font-heading italic font-bold text-white text-lg leading-none">
                  Prophet
                </p>
                <p className="font-bold text-white text-xs tracking-wider uppercase mt-1">
                  Olayiwole Ogunsola
                </p>
              </div>
            </div>
          </div>

          {/* Founder Badge — BELOW PHOTO */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 shadow-lg rounded-2xl px-4 py-3 flex items-center gap-3 border border-brand-gold-400/40">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
                <svg
                  className="w-5 h-5 text-brand-purple-900"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-brand-purple-200 font-medium">
                  Founder &amp; G.O.
                </p>
                <p className="text-sm text-white font-bold">
                  The Triumphant Family
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { value: "10+", label: "Years in Ministry" },
              { value: "1000s", label: "Lives Touched" },
              { value: "Global", label: "Online Reach" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-2xl p-4 text-center border border-brand-gold-400/30"
              >
                <p className="font-heading text-xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-brand-purple-200 text-xs mt-1 leading-tight">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Bio text */}
          <div className="bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl p-5 border border-brand-gold-400/30 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <div className="space-y-3 text-brand-purple-100 text-sm leading-relaxed">
              <p>
                Prophet Olayiwole Ogunsola is a man chosen by God, raised to
                bring deliverance, healing, prophetic direction, and
                supernatural breakthrough to God&rsquo;s people in this
                generation.
              </p>
              <p>
                Anointed with a unique gift of prayer and prophecy, his ministry
                is marked by signs and wonders, accurate prophetic declarations,
                and the manifest presence of the Holy Spirit.
              </p>
              <p>
                As the Founder and General Overseer of{" "}
                <strong className="text-white">
                  The Triumphant Family — The Gleam of Salvation Apostolic
                  Ministry
                </strong>
                , Prophet Olayiwole oversees a growing global ministry through
                in-person gatherings and live online broadcasts that reach
                believers in every continent.
              </p>
              <p>
                His passion is simple: to see every child of God walk in the
                fullness of their inheritance in Christ — healed, delivered,
                prosperous, and triumphant.
              </p>
            </div>
          </div>
        </div>

        {/* DESKTOP LAYOUT */}
        <div className="hidden lg:grid lg:grid-cols-[auto_1fr] gap-10 items-start max-w-6xl mx-auto">
          <div className="relative flex flex-col items-start">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[420px] h-[420px] rounded-full border-2 border-brand-gold-400/20 animate-pulse" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[360px] h-[360px] rounded-full border border-brand-gold-400/15" />
              </div>

              <div className="relative w-[340px] h-[440px] rounded-3xl overflow-hidden shadow-2xl border-2 border-brand-gold-400/30">
                <img
                  src="/images/prophet/prophet.png"
                  alt="Prophet Olayiwole Ogunsola"
                  loading="eager"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-brand-purple-900/90 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5 text-center">
                  <p className="font-heading italic font-bold text-white text-xl leading-none">
                    Prophet
                  </p>
                  <p className="font-bold text-white text-sm tracking-wider uppercase mt-1">
                    Olayiwole Ogunsola
                  </p>
                </div>
              </div>
            </div>

            {/* Founder Badge — BELOW PHOTO */}
            <div className="mt-4 bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 shadow-lg rounded-2xl px-4 py-3 flex items-center gap-3 border border-brand-gold-400/40 w-fit mx-auto">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
                <svg
                  className="w-5 h-5 text-brand-purple-900"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-brand-purple-200 font-medium">
                  Founder &amp; G.O.
                </p>
                <p className="text-sm text-white font-bold">
                  The Triumphant Family
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-heading text-3xl lg:text-5xl font-bold text-white leading-tight mb-2">
              Prophet{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
                Olayiwole Ogunsola
              </span>
            </h2>
            <p className="text-white font-semibold text-lg mb-5">
              Founder &amp; General Overseer
            </p>

            <div className="space-y-3 text-brand-purple-100 leading-relaxed text-base lg:text-lg mb-6">
              <p>
                Prophet Olayiwole Ogunsola is a man chosen by God, raised to
                bring deliverance, healing, prophetic direction, and
                supernatural breakthrough to God&rsquo;s people in this
                generation.
              </p>
              <p>
                Anointed with a unique gift of prayer and prophecy, his ministry
                is marked by signs and wonders, accurate prophetic declarations,
                and the manifest presence of the Holy Spirit.
              </p>
              <p>
                As the Founder and General Overseer of{" "}
                <strong className="text-white">
                  The Triumphant Family — The Gleam of Salvation Apostolic
                  Ministry
                </strong>
                , Prophet Olayiwole oversees a growing global ministry through
                in-person gatherings in Akute, Ogun State, and live online
                broadcasts that reach believers in every continent.
              </p>
              <p>
                His passion is simple: to see every child of God walk in the
                fullness of their inheritance in Christ — healed, delivered,
                prosperous, and triumphant.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-brand-gold-400/30">
              {[
                { value: "10+", label: "Years in Ministry" },
                { value: "1000s", label: "Lives Touched" },
                { value: "Global", label: "Online Reach" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="font-heading text-2xl lg:text-3xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="text-brand-purple-200 text-xs uppercase tracking-wider mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}