"use client";

import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // If we are not on the home page, ensure the loader classes are set effectively
    // to show content immediately, as SpaceLoader is only on the home page.
    if (pathname !== "/") {
      document.body.classList.add("loader-complete");
      document.body.classList.remove("loader-ready");
      document.body.style.overflow = "";
    }
  }, [pathname]);

  return (
    <SessionProvider>
      <Toaster />
      {children}
    </SessionProvider>
  );
}
