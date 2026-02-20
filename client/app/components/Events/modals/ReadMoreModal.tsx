"use client";

import HandDrawnCard from "@/app/components/HandDrawnCard";
import { useEffect } from "react";

type Props = {
  text: string;
  onClose: () => void;
  heading?: string;
};

export default function ReadMoreModal({
  text,
  onClose,
  heading = "Description",
}: Props) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-lg z-10 animate-scaleIn">
        <HandDrawnCard className="p-0 overflow-hidden bg-zinc-900/90 border-2 border-white/80">
          {/* Header */}
          <div className="bg-red-600/90 p-3 sm:p-4 border-b-2 border-white/50 flex items-center justify-between gap-4">
            <h2
              className="text-sm sm:text-xl font-bold text-white uppercase hand-drawn-title !text-left truncate"
              style={{ letterSpacing: "0.06em" }}
              title={heading}
            >
              {heading}
            </h2>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[40vh] overflow-y-auto custom-scrollbar">
            {text && String(text).trim().length > 0 ? (
              <p className="text-gray-200 leading-relaxed whitespace-pre-wrap break-words">
                {text}
              </p>
            ) : (
              <p className="text-gray-400 text-center italic">
                No description provided.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t-2 border-white/20 flex justify-end bg-black/40">
            <button
              onClick={onClose}
              className="hand-drawn-button px-6 py-2 text-sm bg-zinc-700 hover:bg-zinc-600 border-zinc-400 w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        </HandDrawnCard>
      </div>
    </div>
  );
}
