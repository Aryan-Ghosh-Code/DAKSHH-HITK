"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import HandDrawnCard from "./HandDrawnCard";

export default function MobileQrButton() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrPayload, setQrPayload] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (qrModalOpen) {
      document.body.style.overflow = "hidden";
      if (!qrPayload && !loading) {
        setLoading(true);
        fetch("/api/user/profile")
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
            throw new Error("Failed to fetch profile");
          })
          .then((data) => {
            if (data.qrPayload) {
               setQrPayload(data.qrPayload);
            }
          })
          .catch(() => {})
          .finally(() => setLoading(false));
      }
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [qrModalOpen, qrPayload, loading]);

  // Provide the authenticated user with the button, but not on the profile page
  // as the profile page already has this button on the avatar.
  if (status !== "authenticated" || pathname === "/profile") return null;

  return (
    <>
      <button
        onClick={() => setQrModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 md:hidden w-14 h-14 rounded-full bg-white text-black border-2 border-black shadow-[0_0_0_2px_rgba(0,0,0,0.35)] hover:bg-yellow transition-colors flex items-center justify-center cursor-pointer"
        aria-label="Show profile QR"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7"
          aria-hidden="true"
          fill="currentColor"
        >
          <path d="M3 3h7v7H3V3Zm2 2v3h3V5H5Zm9-2h7v7h-7V3Zm2 2v3h3V5h-3ZM3 14h7v7H3v-7Zm2 2v3h3v-3H5Zm9-2h2v2h-2v-2Zm3 0h4v2h-4v-2Zm-3 3h2v4h-2v-4Zm3 3h4v1h-4v-1Zm2-3h2v2h-2v-2Z" />
        </svg>
      </button>

      {qrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <HandDrawnCard className="w-full max-w-sm p-6 text-center">
            <h3 className="hand-drawn-title text-white text-2xl mb-2">
              Profile QR
            </h3>
            <p className="text-white/70 text-sm mb-4">
              This QR works for all events. Volunteers validate it against the
              selected event registration list.
            </p>
            {loading ? (
              <p className="text-white/50 text-sm">Loading QR...</p>
            ) : qrPayload ? (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(qrPayload)}`}
                  alt="Profile QR"
                  className="w-52 h-52 rounded border border-white/20 bg-white p-2"
                />
                <p className="text-white/40 text-[10px] break-all">
                  {qrPayload}
                </p>
              </div>
            ) : (
              <p className="text-white/50 text-sm">QR is being prepared.</p>
            )}
            <button
              type="button"
              onClick={() => setQrModalOpen(false)}
              className="hand-drawn-button mt-4 px-5 py-2 text-sm"
            >
              Close
            </button>
          </HandDrawnCard>
        </div>
      )}
    </>
  );
}
