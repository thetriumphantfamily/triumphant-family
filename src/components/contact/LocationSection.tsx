// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LOCATION SECTION — Map + address card
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function LocationSection() {
  return (
    <section id="location" className="py-16 lg:py-24 bg-white">
      <div className="container-custom">
        {/* Section heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-100 mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-purple-600" />
            <span className="text-brand-purple-600 font-semibold text-sm uppercase tracking-widest">
              Find Us
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-brand-purple-900 mb-4">
            Visit Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
              Ministry
            </span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto">
            Come worship with us in person. We&rsquo;d love to meet you and
            pray with you.
          </p>
        </div>

        {/* Map + Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Google Map */}
          <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.234567890123!2d3.4!3d6.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNDInMDAuMCJOIDPCsDI0JzAwLjAiRQ!5e0!3m2!1sen!2sng!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Church Location"
            />
          </div>

          {/* Address Card */}
          <div className="bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 rounded-3xl p-8 lg:p-10 text-white shadow-xl relative overflow-hidden">
            {/* Decorative blob */}
            <div className="absolute top-[-30%] right-[-20%] w-64 h-64 rounded-full bg-brand-magenta-500/20 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-brand-purple-900"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-heading text-2xl font-bold">Our Address</h3>
              </div>

              {/* Address */}
              <p className="text-brand-purple-100 text-lg leading-relaxed mb-6">
                1, Arifanla Bus Stop,
                <br />
                Akute, Ogun State,
                <br />
                Nigeria
              </p>

              {/* Divider */}
              <div className="border-t border-white/10 my-6" />

              {/* Service Times */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-brand-purple-900"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-heading text-lg font-bold">
                  Service Times
                </h4>
              </div>

              <div className="space-y-2 mb-8 pl-13">
                <p className="text-brand-purple-100">
                  <span className="text-brand-gold-400 font-bold">
                    Sundays:
                  </span>{" "}
                  8:00 AM
                </p>
                <p className="text-brand-purple-100">
                  <span className="text-brand-gold-400 font-bold">
                    Wednesdays:
                  </span>{" "}
                  9:00 AM
                </p>
              </div>

              {/* Get Directions Button */}
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Akute,Ogun+State,Nigeria"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 hover:from-brand-gold-500 hover:to-brand-gold-600 text-brand-purple-900 font-bold shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}