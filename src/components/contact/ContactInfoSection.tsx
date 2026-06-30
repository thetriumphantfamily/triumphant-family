import { Phone, Mail, MapPin, MessageSquare } from "lucide-react";

const CONTACT_METHODS = [
  {
    icon: Phone,
    title: "Call Us",
    detail: "+234 802 262 0704",
    action: "tel:+2348022620704",
    description: "Mon - Sat, 9:00 AM - 6:00 PM",
    color: "from-blue-500 to-violet-600",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp",
    detail: "+234 802 262 0704",
    action: "https://wa.me/2348022620704?text=Hello%20Prophet%20Olayiwole%2C%20I%20visited%20your%20website.",
    description: "Quick replies anytime",
    color: "from-green-500 to-emerald-600",
    external: true,
  },
  {
    icon: Mail,
    title: "Email Us",
    detail: "thetriumphantgrace@gmail.com",
    action: "mailto:thetriumphantgrace@gmail.com",
    description: "We reply within 24 hours",
    color: "from-brand-magenta-500 to-purple-600",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    detail: "Akute, Ogun State",
    action: "#location",
    description: "1, Arifanla Bus Stop, Nigeria",
    color: "from-brand-gold-400 to-brand-gold-600",
  },
];

export default function ContactInfoSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-brand-purple-100 text-brand-purple-600 text-sm font-bold tracking-widest uppercase mb-4">
            Reach Out
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
            How Can We{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
              Help You?
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-500 text-lg">
            Choose your preferred way to connect with us. We&apos;re here for
            you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONTACT_METHODS.map((method) => (
            <a
              key={method.title}
              href={method.action}
              target={method.external ? "_blank" : undefined}
              rel={method.external ? "noopener noreferrer" : undefined}
              className="group bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-brand-purple-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${method.color} mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}
              >
                <method.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                {method.title}
              </h3>

              <p className="text-brand-purple-600 font-bold text-sm mb-2 break-all">
                {method.detail}
              </p>

              <p className="text-gray-500 text-xs">{method.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}