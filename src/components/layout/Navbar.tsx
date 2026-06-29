"use client";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NAVBAR COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Sticky top navigation with logo, menu links, mobile drawer
// and a highlighted "Give" call-to-action button.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Heart, Radio } from "lucide-react";
import { NAV_LINKS, LIVE_STREAM } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // ━━━ Detect scroll for navbar style change ━━━
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ━━━ Lock body scroll when mobile menu open ━━━
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

  // ━━━ Close menu on route change ━━━
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // ━━━ Filter "Give" out of main links (it'll be a special button) ━━━
  const mainLinks = NAV_LINKS.filter((link) => link.name !== "Give");

  return (
    <>
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* TOP BAR - LIVE INDICATOR */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {LIVE_STREAM.isLive && (
        <div className="bg-red-600 text-white py-2 px-4 text-center text-sm font-semibold animate-pulse">
          <Link href="/live" className="inline-flex items-center gap-2 hover:underline">
            <Radio className="w-4 h-4" />
            🔴 WE ARE LIVE NOW — Click to Watch
          </Link>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* MAIN NAVBAR */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <nav
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "bg-brand-purple-900/95 backdrop-blur-md shadow-brand-lg py-2"
            : "bg-brand-purple-900 py-3 md:py-4"
        )}
      >
        <div className="container-custom flex items-center justify-between gap-4">

          {/* ━━━ LOGO ━━━ */}
          <Logo size="sm" textColor="white" />

          {/* ━━━ DESKTOP MENU ━━━ */}
          <ul className="hidden lg:flex items-center gap-1">
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

          {/* ━━━ DESKTOP GIVE BUTTON ━━━ */}
          <Link
            href="/give"
            className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-gold text-brand-purple-900 font-bold text-sm shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
          >
            <Heart className="w-4 h-4 fill-current" />
            Give
          </Link>

          {/* ━━━ MOBILE HAMBURGER ━━━ */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </nav>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* MOBILE DRAWER */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
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