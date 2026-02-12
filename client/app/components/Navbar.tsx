"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/#home" },
    { name: "Events", href: "/#events" },
    { name: "Stats", href: "/#stats" },
    { name: "Sponsors", href: "/#sponsors" },
    { name: "Contact", href: "/#contact" },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-1400 mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-lg sm:text-xl md:text-2xl font-bold text-white hover:text-cyan transition-colors"
          >
            DAKSHH
          </Link>

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
            {status === "loading" ? null : session ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="text-cyan text-sm font-semibold max-w-[120px] truncate hover:text-yellow transition-colors"
                >
                  {session.user?.username ?? session.user?.name ?? session.user?.email}
                </Link>
                <button
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
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="hand-drawn-button text-xs xl:text-sm"
                style={{
                  background: "rgba(255, 70, 85, 0.9)",
                  padding: "0.4rem 0.8rem",
                  fontSize: "0.85rem",
                }}
              >
                Sign In
              </Link>
            )}
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
              {status === "loading" ? null : session ? (
                <>
                  <Link
                    href="/profile"
                    className="text-cyan py-2 px-3 text-sm font-semibold hover:text-yellow transition-colors"
                    onClick={closeMobileMenu}
                  >
                    {session.user?.username ?? session.user?.name ?? session.user?.email}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      closeMobileMenu();
                    }}
                    className="text-white hover:text-cyan transition-colors py-2 sm:py-3 px-3 sm:px-4 border-b-2 border-white/20 text-sm sm:text-base text-left"
                  >
                    Sign Out
                  </button>
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
