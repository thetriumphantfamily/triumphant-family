import { MapPin, Clock, Navigation } from "lucide-react";

export default function LocationSection() {
  return (
    <section id="location" className="py-16 lg:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-brand-purple-100 text-brand-purple-600 text-sm font-bold tracking-widest uppercase mb-4">
            Find Us
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
            Visit Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-magenta-500">
              Ministry
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-500 text-lg">
            Come worship with us in person. We&apos;d love to meet you and pray
            with you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Map */}
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

          {/* Info Card */}
          <div className="bg-gradient-to-br from-violet-900 via-purple-800 to-purple-900 rounded-3xl p-8 lg:p-10 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold-400/20 border border-brand-gold-400/40 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-brand-gold-400" />
              </div>
              <h3 className="text-2xl font-heading font-bold">Our Address</h3>
            </div>

            <p className="text-purple-100 text-lg leading-relaxed mb-6">
              1, Arifanla Bus Stop,
              <br />
              Akute, Ogun State,
              <br />
              Nigeria
            </p>

            <div className="border-t border-white/10 my-6" />

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-gold-400/20 border border-brand-gold-400/40 flex items-center justify-center">
                <Clock className="w-5 h-5 text-brand-gold-400" />
              </div>
              <h4 className="text-lg font-heading font-bold">Service Times</h4>
            </div>

            <div className="space-y-2 mb-8 pl-13">
              <p className="text-purple-100">
                <span className="text-brand-gold-400 font-bold">Sundays:</span>{" "}
                8:00 AM
              </p>
              <p className="text-purple-100">
                <span className="text-brand-gold-400 font-bold">
                  Wednesdays:
                </span>{" "}
                9:00 AM
              </p>
            </div>

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Akute,Ogun+State,Nigeria"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-gold-400 hover:bg-brand-gold-500 text-brand-purple-900 font-bold transition-all duration-200 shadow-gold hover:scale-105"
            >
              <Navigation className="w-5 h-5" />
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}