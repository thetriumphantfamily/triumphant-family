import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Heart } from "lucide-react";
import { SITE, CONTACT, SOCIALS, SERVICES } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-brand-purple-900 to-brand-purple-950 text-white">

      {/* Gold tagline banner */}
      <div className="bg-gradient-gold py-5">
        <div className="container-custom text-center">
          <p className="text-brand-purple-900 font-body text-lg md:text-2xl font-extrabold tracking-widest uppercase">
            Pray With Us &bull; Triumph With Us
          </p>
        </div>
      </div>

      <div className="container-custom py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">

          {/* COLUMN 1: Connect With Us */}
          <div>
            <h3 className="font-heading font-bold text-brand-gold-400 text-lg mb-5">
              Connect With Us
            </h3>

            {/* Social icons with ORIGINAL BRAND COLORS */}
            <div className="flex items-center gap-3">

              {/* Facebook */}
              <a
                href={SOCIALS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href={SOCIALS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={SOCIALS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:from-purple-500 hover:via-pink-400 hover:to-orange-300 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>

              {/* TikTok — NEW */}
              <a
                href={SOCIALS.tiktok || "https://www.tiktok.com/@pastorolayiwoletriumphant"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-0.1z" />
                </svg>
              </a>
            </div>
          </div>

          {/* COLUMN 2: Visit Us */}
          <div>
            <h3 className="font-heading font-bold text-brand-gold-400 text-lg mb-5">
              Visit Us
            </h3>

            <div className="flex items-start gap-3 mb-4">
              <Clock className="w-5 h-5 text-brand-gold-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold text-sm mb-1">Service Times</p>
                {SERVICES.map((service) => (
                  <p key={service.day} className="text-brand-purple-200 text-sm">
                    <span className="text-brand-gold-300 font-semibold">{service.day}:</span>{" "}
                    {service.time}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-3 mb-3">
              <MapPin className="w-5 h-5 text-brand-gold-400 flex-shrink-0 mt-0.5" />
              <p className="text-brand-purple-200 text-sm">{CONTACT.address.full}</p>
            </div>

            <a
              href={`tel:${CONTACT.phoneRaw}`}
              className="flex items-center gap-3 mb-3 text-brand-purple-200 hover:text-brand-gold-300 transition-colors"
            >
              <Phone className="w-5 h-5 text-brand-gold-400 flex-shrink-0" />
              <span className="text-sm">{CONTACT.phone}</span>
            </a>

            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT.email}&su=Hello%20from%20your%20website`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-brand-purple-200 hover:text-brand-gold-300 transition-colors break-all"
            >
              <Mail className="w-5 h-5 text-brand-gold-400 flex-shrink-0" />
              <span className="text-sm">{CONTACT.email}</span>
            </a>
          </div>

          {/* COLUMN 3: Partner With Us */}
          <div>
            <h3 className="font-heading font-bold text-brand-gold-400 text-lg mb-5">
              Partner With Us
            </h3>
            <p className="text-brand-purple-200 text-sm mb-5 leading-relaxed">
              Your seeds keep the gospel going forth and souls coming into the kingdom.
            </p>
            <Link
              href="/give"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-gold text-brand-purple-900 font-bold text-sm shadow-gold hover:scale-105 transition-all duration-300"
            >
              <Heart className="w-4 h-4 fill-current" />
              Give Now
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5">
        <div className="container-custom flex flex-col items-center gap-2 text-center">
          <p className="text-brand-purple-200 text-sm">
            © {currentYear}{" "}
            <span className="text-white font-semibold">{SITE.fullName}</span>.
            All rights reserved.
          </p>
          <a
            href="https://wa.me/2348036208366?text=Hello%20Christmade%20GlobalTech!%20I%20saw%20your%20amazing%20work%20on%20The%20Triumphant%20Family%20website%20and%20I%27m%20truly%20impressed.%20I%27d%20love%20to%20discuss%20a%20project%20with%20you."
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-purple-300 text-xs hover:text-brand-gold-300 transition-colors group inline-flex items-center gap-1"
          >
            Powered by{" "}
            <span className="font-semibold text-brand-gold-400 group-hover:text-brand-gold-300 transition-colors">
              Christmade GlobalTech
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}