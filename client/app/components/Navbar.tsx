"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { resolveDashboardPath } from "@/lib/roles";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState<number | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;

    let cancelled = false;
    const fallbackAvatar = session?.user?.avatar ?? 1;

    const fetchProfileAvatar = async () => {
      try {
        const res = await fetch("/api/user/profile", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { avatar?: number | null };
        if (!cancelled) {
          setProfileAvatar(data.avatar ?? fallbackAvatar);
        }
      } catch {
        if (!cancelled) {
          setProfileAvatar(fallbackAvatar);
        }
      }
    };

    fetchProfileAvatar();

    return () => {
      cancelled = true;
    };
  }, [status, session?.user?.avatar]);

  const navLinks = [
    { name: "Home", href: "/#home" },
    { name: "Events", href: "/events" },
    { name: "Stats", href: "/#stats" },
    { name: "Sponsors", href: "/#sponsors" },
    { name: "Contact", href: "/#contact" },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const resolvedAvatar = profileAvatar ?? session?.user?.avatar ?? 1;
  const dashboardPath = resolveDashboardPath(session?.user?.roles);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-1400 mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-10 lg:gap-15">
            <Link
              href="/"
              className="text-lg sm:text-xl md:text-2xl font-bold text-white hover:text-cyan transition-colors"
            >
              <Image src="/Dakshh_Logo.png" alt="logo" width={70} height={70} />
            </Link>

            <Link
              href="/"
              className="text-lg sm:text-xl md:text-2xl font-bold text-white hover:text-cyan transition-colors"
            >
              <Image src="/IIC.png" alt="logo" width={55} height={55} />
            </Link>

            <Link
              href="/"
              className="text-lg sm:text-xl md:text-2xl font-bold text-white hover:text-cyan transition-colors"
            >
              <Image src="/Heritage.png" alt="logo" width={70} height={70} />
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hand-drawn-button text-xs xl:text-sm"
                style={{
                  background: "rgba(0, 0, 0, 0.7)",
                  padding: "0.4rem 0.8rem",
                  fontSize: "0.85rem",
                }}
              >
                {link.name}
              </Link>
            ))}
            {dashboardPath && (
              <Link
                href={dashboardPath}
                className="hand-drawn-button text-xs xl:text-sm"
                style={{
                  background: "rgba(0, 106, 255, 0.85)",
                  padding: "0.4rem 0.8rem",
                  fontSize: "0.85rem",
                }}
              >
                Dashboard
              </Link>
            )}
            {status === "loading" ? null : session ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-black/60 hover:border-cyan transition-colors flex items-center justify-center"
                  aria-label="Open profile"
                >
                  <Image
                    src={`/${resolvedAvatar}.png`}
                    alt="Profile avatar"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </Link>
                {/* <button
                  type="button"
                  onClick={() => signOut()}
                  className="hand-drawn-button text-xs xl:text-sm"
                  style={{
                    background: "rgba(255, 70, 85, 0.9)",
                    padding: "0.4rem 0.8rem",
                    fontSize: "0.85rem",
                  }}
                >
                  Sign Out
                </button> */}
              </div>
            ): null}
          </div>

          <button
            className="lg:hidden hand-drawn-button px-2 py-1.5 sm:px-3 sm:py-2"
            style={{
              background: "rgba(0, 0, 0, 0.7)",
              minWidth: "auto",
              padding: "0.5rem 0.75rem",
            }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="text-white text-lg sm:text-xl">
              {isMobileMenuOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 sm:mt-4 hand-drawn-card p-3 sm:p-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white hover:text-cyan transition-colors py-2 sm:py-3 px-3 sm:px-4 border-b-2 border-white/20 text-sm sm:text-base"
                  onClick={closeMobileMenu}
                >
                  {link.name}
                </Link>
              ))}
              {dashboardPath && (
                <Link
                  href={dashboardPath}
                  className="text-cyan py-2 px-3 text-sm font-semibold hover:text-yellow transition-colors"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
              )}
              {status === "loading" ? null : session ? (
                <>
                  <Link
                    href="/profile"
                    className="text-cyan py-2 px-3 text-sm font-semibold hover:text-yellow transition-colors flex items-center gap-2"
                    onClick={closeMobileMenu}
                  >
                    <span className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-black/60 flex items-center justify-center">
                      <Image
                        src={`/${resolvedAvatar}.png`}
                        alt="Profile avatar"
                        width={32}
                        height={32}
                        className="w-full h-full object-contain"
                      />
                    </span>
                    Profile
                  </Link>
                  {/* <button
                    type="button"
                    onClick={() => {
                      signOut();
                      closeMobileMenu();
                    }}
                    className="text-white hover:text-cyan transition-colors py-2 sm:py-3 px-3 sm:px-4 border-b-2 border-white/20 text-sm sm:text-base text-left"
                  >
                    Sign Out
                  </button> */}
                </>
              ) : (
                <Link
                  href="/auth"
                  className="text-white hover:text-cyan transition-colors py-2 sm:py-3 px-3 sm:px-4 border-b-2 border-white/20 text-sm sm:text-base"
                  onClick={closeMobileMenu}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
