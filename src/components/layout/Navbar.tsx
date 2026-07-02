"use client";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NAVBAR COMPONENT — Two-row layout
// Row 1: Logo (left) + Social Icons + Give button (right)
// Row 2: Menu links centered
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Heart, Radio } from "lucide-react";
import { NAV_LINKS, LIVE_STREAM } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SOCIAL MEDIA LINKS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SOCIAL_LINKS = [
  {
    name:  "Facebook",
    url:   "https://m.facebook.com/wole.ola.376/",
    hover: "hover:bg-blue-600",
    svg: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 011-1h3v-4h-3a5 5 0 00-5 5v2.01h-2l-.396 3.98h2.396v8.01z"/>
      </svg>
    ),
  },
  {
    name:  "YouTube",
    url:   "https://www.youtube.com/PastorOlayiwoleTriumphant",
    hover: "hover:bg-red-600",
    svg: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name:  "Instagram",
    url:   "https://www.instagram.com/pastorolayiwoletriumphant",
    hover: "hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-500",
    svg: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    name:  "TikTok",
    url:   "https://www.tiktok.com/@pastorolayiwoletriumphant",
    hover: "hover:bg-black",
    svg: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.84-.1z"/>
      </svg>
    ),
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen]         = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // ── Detect scroll for navbar style change ──
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Lock body scroll when mobile menu open ──
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // ── Close menu on route change ──
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // ── Filter "Give" out of main links (it'll be a special button) ──
  const mainLinks = NAV_LINKS.filter((link) => link.name !== "Give");

  return (
    <>
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* TOP BAR - LIVE INDICATOR                                     */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {LIVE_STREAM.isLive && (
        <div className="bg-red-600 text-white py-2 px-4 text-center text-sm font-semibold animate-pulse">
          <Link href="/live" className="inline-flex items-center gap-2 hover:underline">
            <Radio className="w-4 h-4" />
            🔴 WE ARE LIVE NOW — Click to Watch
          </Link>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* MAIN NAVBAR — TWO ROWS ON DESKTOP                            */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <nav
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "bg-brand-purple-900/95 backdrop-blur-md shadow-brand-lg"
            : "bg-brand-purple-900"
        )}
      >
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* ROW 1: Logo (left) + Social + Give (right)                   */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className={cn(
          "container-custom flex items-center justify-between gap-4 transition-all duration-300",
          isScrolled ? "py-2" : "py-3 md:py-4"
        )}>

          {/* ── LOGO ── */}
          <Logo size="sm" textColor="white" />

          {/* ── RIGHT SIDE: SOCIAL + GIVE (DESKTOP) ── */}
          <div className="hidden lg:flex items-center gap-3">

            {/* Social Media Icons */}
            <div className="flex items-center gap-1.5 pr-3 border-r border-white/20">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow on ${social.name}`}
                  title={social.name}
                  className={cn(
                    "w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:text-white",
                    social.hover
                  )}
                >
                  {social.svg}
                </a>
              ))}
            </div>

            {/* Give Button */}
            <Link
              href="/give"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-gold text-brand-purple-900 font-bold text-sm shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
            >
              <Heart className="w-4 h-4 fill-current" />
              Give
            </Link>
          </div>

          {/* ── MOBILE HAMBURGER ── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* ROW 2: MENU LINKS (DESKTOP ONLY, CENTERED)                   */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className={cn(
          "hidden lg:block border-t border-white/10 transition-all duration-300",
          isScrolled ? "py-1.5" : "py-2"
        )}>
          <div className="container-custom">
            <ul className="flex items-center justify-center gap-1 flex-wrap">
              {mainLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                        isActive
                          ? "bg-brand-gold-400 text-brand-purple-900 shadow-gold"
                          : "text-white hover:bg-white/10 hover:text-brand-gold-300"
                      )}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* MOBILE DRAWER                                                */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-300",
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-brand-purple-950/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer Panel */}
        <div
          className={cn(
            "absolute top-0 right-0 h-full w-[85%] max-w-sm bg-gradient-purple shadow-brand-lg transition-transform duration-300 ease-out",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <Logo size="sm" textColor="white" />
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Links */}
          <nav className="p-5 overflow-y-auto h-[calc(100%-80px)]">
            <ul className="space-y-2">
              {mainLinks.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <li
                    key={link.href}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "block px-5 py-3 rounded-xl text-base font-semibold transition-all duration-200",
                        isActive
                          ? "bg-brand-gold-400 text-brand-purple-900 shadow-gold"
                          : "text-white hover:bg-white/10 hover:translate-x-1"
                      )}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Mobile Give Button */}
            <Link
              href="/give"
              className="mt-6 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-gold text-brand-purple-900 font-bold shadow-gold-lg hover:scale-[1.02] transition-all duration-300"
            >
              <Heart className="w-5 h-5 fill-current" />
              Give to the Ministry
            </Link>

            {/* ── SOCIAL ICONS (Mobile Drawer) ── */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-center text-brand-gold-300 text-xs font-bold uppercase tracking-widest mb-4">
                Connect With Us
              </p>
              <div className="flex items-center justify-center gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow on ${social.name}`}
                    className={cn(
                      "w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:text-white",
                      social.hover
                    )}
                  >
                    {social.svg}
                  </a>
                ))}
              </div>
            </div>

            {/* Tagline */}
            <p className="mt-8 text-center text-brand-gold-300 font-script text-2xl">
              Pray with us.
              <br />
              Triumph with us.
            </p>
          </nav>
        </div>
      </div>
    </>
  );
}