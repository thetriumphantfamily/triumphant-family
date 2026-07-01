"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Video,
  Calendar,
  MessageSquare,
  HandHeart,
  Mail,
  Users,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Sermons", href: "/admin/sermons", icon: Video },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Testimonies", href: "/admin/testimonies", icon: MessageSquare },
  { name: "Prayer Requests", href: "/admin/prayers", icon: HandHeart },
  { name: "Messages", href: "/admin/messages", icon: Mail },
  { name: "Leadership", href: "/admin/leadership", icon: Users },
  { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Error signing out");
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-brand-purple-600 text-white shadow-lg"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-brand-purple-900 to-brand-purple-950 text-white z-40 transform transition-transform duration-300 flex flex-col ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo Header */}
        <div className="p-6 border-b border-white/10">
          <Link
            href="/admin"
            className="flex items-center gap-3"
            onClick={() => setMobileOpen(false)}
          >
            <Image
              src="/images/logo/logo.png"
              alt="Logo"
              width={40}
              height={40}
              unoptimized
              className="rounded-full"
            />
            <div>
              <p className="font-heading font-bold text-white text-sm">
                Admin Portal
              </p>
              <p className="text-xs text-brand-purple-200">
                Triumphant Family
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 no-scrollbar">
          <div className="px-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-brand-gold-400 text-brand-purple-900 font-bold shadow-lg"
                      : "text-brand-purple-100 hover:bg-white/10"
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-brand-purple-100 hover:bg-white/10 transition-colors text-sm"
          >
            <Home className="w-5 h-5" />
            View Website
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-300 hover:bg-red-500/20 transition-colors text-sm disabled:opacity-50"
          >
            <LogOut className="w-5 h-5" />
            {isLoggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </aside>
    </>
  );
}