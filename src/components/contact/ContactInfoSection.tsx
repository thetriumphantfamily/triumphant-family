// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONTACT INFO SECTION — 4 contact methods
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONTACT_METHODS = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    title: "Call Us",
    detail: "+234 802 262 0704",
    action: "tel:+2348022620704",
    description: "Mon - Sat, 9 AM - 6 PM",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    ),
    title: "WhatsApp",
    detail: "+234 802 262 0704",
    action: "https://wa.me/2348022620704?text=Hello%20Prophet%20Olayiwole%2C%20I%20visited%20your%20website.",
    description: "Quick replies anytime",
    external: true,
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    title: "Email Us",
    detail: "thetriumphantgrace@gmail.com",
    action: "mailto:thetriumphantgrace@gmail.com",
    description: "We reply within 24 hours",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: "Visit Us",
    detail: "Akute, Ogun State",
    action: "#location",
    description: "1, Arifanla Bus Stop, Nigeria",
  },
];

export default function ContactInfoSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-custom">
        {/* Section heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-100 mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-purple-600" />
            <span className="text-brand-purple-600 font-semibold text-sm uppercase tracking-widest">
              Reach Out
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-brand-purple-900 mb-4">
            How Can We{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
              Help You?
            </span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto">
            Choose your preferred way to connect with us. We&rsquo;re here for
            you.
          </p>
        </div>

        {/* Contact method cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONTACT_METHODS.map((method) => (
            <a
              key={method.title}
              href={method.action}
              target={method.external ? "_blank" : undefined}
              rel={method.external ? "noopener noreferrer" : undefined}
              className="group bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-brand-gold-400 hover:shadow-gold transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold-400 to-brand-gold-500 shadow-gold text-brand-purple-900 mb-5 group-hover:scale-110 transition-transform duration-300">
                {method.icon}
              </div>

              {/* Title */}
              <h3 className="font-heading text-lg font-bold text-brand-purple-900 mb-2">
                {method.title}
              </h3>

              {/* Detail */}
              <p className="text-brand-purple-600 font-bold text-sm mb-2 break-all">
                {method.detail}
              </p>

              {/* Description */}
              <p className="text-gray-500 text-xs">{method.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}