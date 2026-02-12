"use client";

import { useEffect } from "react";
import Image from "next/image";
import HandDrawnCard from "../components/HandDrawnCard";

interface AvatarModalProps {
  open: boolean;
  onClose: () => void;
  currentAvatar: number;
  onSelect: (avatar: number) => void;
}

const CREWMATE_COUNT = 10;

export default function AvatarModal({
  open,
  onClose,
  currentAvatar,
  onSelect,
}: AvatarModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <HandDrawnCard className="p-6 sm:p-8">
          <h2 className="hand-drawn-title text-white text-xl sm:text-2xl mb-2">
            Choose Your Crewmate
          </h2>
          <p className="text-cyan text-sm mb-6 text-center">
            Select your avatar
          </p>

          <div className="relative w-full h-48 sm:h-52 mx-auto mb-6 dial-container">
            {Array.from({ length: CREWMATE_COUNT }, (_, i) => i + 1).map(
              (n, idx) => {
                const angle =
                  (idx / (CREWMATE_COUNT - 1)) * Math.PI - Math.PI / 2;
                const x = 50 + 50 * Math.sin(angle);
                const y = 65 - 40 * Math.cos(angle);

                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      onSelect(n);
                      onClose();
                    }}
                    className={`absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full transition-all duration-200 hover:scale-110 ${
                      currentAvatar === n
                        ? "ring-4 ring-white ring-offset-2 ring-offset-black scale-110 shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                        : "hover:ring-2 hover:ring-white/50"
                    }`}
                    style={{
                      left: `calc(${x}% - 1.75rem)`,
                      top: `calc(${y}% - 1.75rem)`,
                    }}
                  >
                    <Image
                      src={`/${n}.png`}
                      alt={`Crewmate ${n}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-contain rounded-full"
                    />
                  </button>
                );
              }
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="hand-drawn-button w-full py-2"
            style={{ background: "rgba(0, 0, 0, 0.7)" }}
          >
            Cancel
          </button>
        </HandDrawnCard>
      </div>
    </div>
  );
}
