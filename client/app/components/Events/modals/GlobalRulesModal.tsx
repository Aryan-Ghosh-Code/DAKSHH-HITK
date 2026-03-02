"use client";

import HandDrawnCard from "@/app/components/HandDrawnCard";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

type GlobalRulesModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const GLOBAL_RULES: string[] = [
  "Valid college ID cards required.",
  "Reporting time must be strictly followed.",
  "Teams must adhere to their registered format.",
  "Any malpractice leads to immediate disqualification.",
  "The decision of organizers will be final and binding.",
  "Participants must maintain discipline and decorum.",
  "Event-specific rules override general rules.",
];

export default function GlobalRulesModal({
  isOpen,
  onClose,
}: GlobalRulesModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-lg z-10 animate-scaleIn">
        <HandDrawnCard className="p-0 overflow-hidden bg-zinc-900/90 border-2 border-white/80 transition-all duration-300 hover:border-[#FF4655]/60 hover:shadow-[0_0_20px_rgba(255,70,85,0.5)]">
          {/* Header */}
          <div
            className="p-3 sm:p-4 border-b-2 border-white/50 flex items-center justify-center rounded-t-2xl transition-all duration-500 hover:brightness-110 hover:shadow-[0_0_25px_rgba(255,70,85,0.7)]"
            style={{
              background: "rgba(255, 70, 85, 0.7)",
              boxShadow: "0 0 15px rgba(255, 70, 85, 0.4)",
            }}
          >
            <h2
              className="text-sm sm:text-xl font-bold text-white uppercase hand-drawn-title !text-center"
              style={{ letterSpacing: "0.06em" }}
            >
              General Rules & Regulations
            </h2>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[40vh] overflow-y-auto custom-scrollbar">
            <ul className="space-y-4">
              {GLOBAL_RULES.map((rule, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-200">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <span className="font-medium break-words">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="p-4 border-t-2 border-white/20 flex justify-center bg-black/40">
            <button
              onClick={onClose}
              className="hand-drawn-button px-8 py-3 text-sm font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 border-red-400 w-full sm:w-auto transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]"
            >
              I Understood
            </button>
          </div>
        </HandDrawnCard>
      </div>
    </div>
  );
}
