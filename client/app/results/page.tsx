"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DotOrbit } from "@paper-design/shaders-react";
import Navbar from "@/app/components/Navbar";
import HandDrawnCard from "@/app/components/HandDrawnCard";
import toast from "react-hot-toast";

interface MinigamePlayer {
  username?: string;
  fullName?: string;
  amongUsScore: number;
  avatar?: number;
}

interface ResultParticipant {
  name: string;
  userId?: string;
}

interface ResultEntry {
  _id: string;
  position: "winner" | "runner_up" | "second_runner_up" | "honorable_mention";
  positionLabel?: string;
  rank: number;
  teamName?: string;
  participants: ResultParticipant[];
  note?: string;
}

interface EventResult {
  eventId: string;
  eventName: string;
  eventBanner?: string | null;
  eventCategory?: string | null;
  entries: ResultEntry[];
  publishedAt?: string | null;
}

const POSITION_ORDER = [
  "winner",
  "runner_up",
  "second_runner_up",
  "honorable_mention",
] as const;

const POSITION_CONFIG = {
  winner: {
    label: "Winner",
    emoji: "🏆",
    color: "from-yellow-500/20 to-yellow-400/5",
    border: "border-yellow-400",
    badge: "bg-yellow-400 text-black",
    text: "text-yellow-400",
    glow: "shadow-yellow-500/20",
  },
  runner_up: {
    label: "Runner Up",
    emoji: "🥈",
    color: "from-slate-400/20 to-slate-300/5",
    border: "border-slate-300",
    badge: "bg-slate-300 text-black",
    text: "text-slate-300",
    glow: "shadow-slate-300/20",
  },
  second_runner_up: {
    label: "2nd Runner Up",
    emoji: "🥉",
    color: "from-amber-700/20 to-amber-600/5",
    border: "border-amber-600",
    badge: "bg-amber-600 text-white",
    text: "text-amber-500",
    glow: "shadow-amber-600/20",
  },
  honorable_mention: {
    label: "Honorable Mention",
    emoji: "⭐",
    color: "from-cyan-500/10 to-cyan-400/5",
    border: "border-cyan-500/60",
    badge: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40",
    text: "text-cyan-400",
    glow: "shadow-cyan-500/10",
  },
};

function TeamEntry({ entry }: { entry: ResultEntry }) {
  const [expanded, setExpanded] = useState(false);
  const isSolo = entry.participants.length === 1;
  const displayName =
    entry.teamName ||
    (isSolo ? entry.participants[0]?.name : null) ||
    "Unknown";

  if (isSolo) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-bold text-white text-lg">{entry.participants[0]?.name}</span>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 group"
      >
        <span className="font-bold text-white text-lg group-hover:text-cyan-300 transition-colors underline decoration-dotted underline-offset-4">
          {displayName}
        </span>
        <span className="text-white/50 text-sm">
          ({entry.participants.length} members)
        </span>
        <span className="text-white/40 text-xs transition-transform duration-200" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
          ▼
        </span>
      </button>
      {expanded && (
        <div className="mt-2 pl-3 border-l-2 border-white/20 space-y-1">
          {entry.participants.map((p, i) => (
            <div key={i} className="text-sm text-white/70">
              {p.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EventResultCard({ result }: { result: EventResult }) {
  const [expanded, setExpanded] = useState(false);

  const groupedEntries: Record<string, ResultEntry[]> = {};
  for (const pos of POSITION_ORDER) {
    const filtered = result.entries
      .filter((e) => e.position === pos)
      .sort((a, b) => a.rank - b.rank);
    if (filtered.length > 0) groupedEntries[pos] = filtered;
  }

  const hasEntries = Object.keys(groupedEntries).length > 0;
  const winner = groupedEntries["winner"]?.[0];

  return (
    <HandDrawnCard className="overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 sm:p-6 group"
      >
        <div className="flex items-start gap-4">
          {result.eventBanner && (
            <div
              className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/40 shrink-0 bg-black/40"
              style={{ filter: "url(#wobbly-border)" }}
            >
              <img
                src={result.eventBanner}
                alt={result.eventName}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide group-hover:text-yellow-400 transition-colors">
                {result.eventName}
              </h2>
              {result.eventCategory && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60 border border-white/20">
                  {result.eventCategory}
                </span>
              )}
            </div>
            {winner && (
              <div className="mt-1 flex items-center gap-2">
                <span className="text-yellow-400 font-semibold">🏆</span>
                <span className="text-yellow-300 text-sm font-medium">
                  {winner.teamName ||
                    winner.participants[0]?.name ||
                    "Unknown"}
                  {winner.participants.length > 1 &&
                    ` & ${winner.participants.length - 1} more`}
                </span>
              </div>
            )}
          </div>
          <span
            className="text-white/40 text-lg shrink-0 transition-transform duration-300 mt-1"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ▼
          </span>
        </div>
      </button>

      {expanded && (
        <div className="px-5 sm:px-6 pb-6 space-y-5 border-t border-white/10 pt-5">
          {!hasEntries && (
            <p className="text-white/40 text-sm text-center py-4">
              No results available yet.
            </p>
          )}

          {(Object.entries(groupedEntries) as [string, ResultEntry[]][]).map(
            ([pos, entries]) => {
              const posKey = pos as keyof typeof POSITION_CONFIG;
              const config = POSITION_CONFIG[posKey];

              return (
                <div key={pos}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{config.emoji}</span>
                    <h3
                      className={`font-bold text-lg uppercase tracking-wider ${config.text}`}
                    >
                      {config.label}
                    </h3>
                    {entries.length > 1 && (
                      <span className="text-white/40 text-xs">
                        ({entries.length} entries)
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {entries.map((entry) => (
                      <div
                        key={entry._id}
                        className={`rounded-xl border bg-gradient-to-br ${config.color} ${config.border} p-4 shadow-lg ${config.glow}`}
                      >
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <TeamEntry entry={entry} />
                            {entry.note && (
                              <p className="text-white/50 text-xs mt-2 italic">
                                {entry.note}
                              </p>
                            )}
                          </div>
                          {entry.positionLabel && (
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-semibold shrink-0 ${config.badge}`}
                            >
                              {entry.positionLabel}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </HandDrawnCard>
  );
}

export default function ResultsPage() {
  const [results, setResults] = useState<EventResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [minigameTop3, setMinigameTop3] = useState<MinigamePlayer[]>([]);
  const [minigameLoading, setMinigameLoading] = useState(true);

  useEffect(() => {
    const fetchMinigame = async () => {
      try {
        const res = await fetch("/api/arcade/leaderboard");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setMinigameTop3((data.leaderboard ?? []).slice(0, 3));
      } catch {
        // silently fail — section just won't show scores
      } finally {
        setMinigameLoading(false);
      }
    };
    fetchMinigame();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("/api/results");
        if (!res.ok) throw new Error("Failed to fetch results");
        const data = await res.json();
        if (data.hidden) {
          setHidden(true);
          setLoading(false);
          return;
        }
        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <Navbar />

      <div className="fixed inset-0 z-0 opacity-50 pointer-events-none">
        <DotOrbit
          width="100%"
          height="100%"
          colors={["#ffffff", "#006aff", "#fff675"]}
          colorBack="#000000"
          stepsPerColor={4}
          size={0.2}
          sizeRange={0.5}
          spreading={1}
          speed={0.5}
          scale={0.35}
        />
      </div>

      <main className="relative z-10 pt-24 pb-16 px-4 max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl">🏆</span>
            <h1 className="hand-drawn-title text-5xl sm:text-7xl text-white">
              Results
            </h1>
            <span className="text-5xl">🏆</span>
          </div>
          <p className="text-white/60 text-lg mt-2 max-w-md mx-auto">
            Champions revealed. The crew has spoken. Check out the winners from
            each mission.
          </p>

          {/* Decorative podium */}
          <div className="flex items-end justify-center gap-2 mt-8 mb-2">
            <div className="w-16 h-10 rounded-t-lg bg-slate-400/30 border-2 border-slate-400/50 flex items-center justify-center">
              <span className="text-slate-300 font-bold text-sm">2</span>
            </div>
            <div className="w-20 h-14 rounded-t-lg bg-yellow-400/30 border-2 border-yellow-400/50 flex items-center justify-center">
              <span className="text-yellow-300 font-bold text-base">1</span>
            </div>
            <div className="w-16 h-7 rounded-t-lg bg-amber-700/30 border-2 border-amber-600/50 flex items-center justify-center">
              <span className="text-amber-500 font-bold text-sm">3</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <img
              src="/kill.gif"
              alt="Loading"
              className="w-24 h-24 object-contain"
            />
            <p className="text-white/50 text-sm">Loading results...</p>
          </div>
        ) : hidden ? (
          <HandDrawnCard className="p-10 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Results Unavailable
            </h2>
            <p className="text-white/50 text-sm">
              Results are not available right now. Check back later, crewmate!
            </p>
          </HandDrawnCard>
        ) : results.length === 0 ? (
          <HandDrawnCard className="p-10 text-center">
            <div className="text-6xl mb-4">📡</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              No Results Yet
            </h2>
            <p className="text-white/50 text-sm">
              Results will appear here after each event concludes. Stay tuned,
              crewmate!
            </p>
          </HandDrawnCard>
        ) : (
          <div className="space-y-4">
            <p className="text-white/40 text-sm text-center mb-6">
              {results.length} event{results.length !== 1 ? "s" : ""} with
              published results — click to expand
            </p>
            {results.map((result) => (
              <EventResultCard key={result.eventId} result={result} />
            ))}
          </div>
        )}

        {/* Among Us Minigame Section */}
        <div className="mt-16">
          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-white/10" />
            <img src="/kill.gif" alt="" className="w-8 h-8 object-contain opacity-70" />
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <HandDrawnCard className="overflow-hidden">
            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-2">
                  Among Us Minigame
                </p>
                <h2 className="hand-drawn-title text-3xl sm:text-4xl text-white mb-3">
                  The Arcade GOATs 🐐
                </h2>
                <p className="text-white/60 text-sm sm:text-base italic max-w-sm mx-auto">
                  &quot;Y&apos;all didn&apos;t win anything but you still the GOATs&quot;
                </p>
              </div>

              {/* Podium */}
              {minigameLoading ? (
                <div className="flex justify-center py-10">
                  <img src="/kill.gif" alt="Loading" className="w-12 h-12 object-contain opacity-60" />
                </div>
              ) : minigameTop3.length === 0 ? (
                <p className="text-center text-white/30 text-sm py-8">
                  No scores yet — be the first crewmate on the board!
                </p>
              ) : (
                <div className="flex items-end justify-center gap-3 sm:gap-6">
                  {/* 2nd Place */}
                  {minigameTop3[1] ? (
                    <div className="flex flex-col items-center gap-2 flex-1 max-w-[140px]">
                      <div className="relative">
                        {minigameTop3[1].avatar != null ? (
                          <Image
                            src={`/${minigameTop3[1].avatar}.png`}
                            alt={minigameTop3[1].username ?? ""}
                            width={52}
                            height={52}
                            className="rounded-full border-2 border-slate-300/60 object-cover"
                          />
                        ) : (
                          <div className="w-13 h-13 rounded-full bg-slate-600 border-2 border-slate-300/60 flex items-center justify-center text-xl">
                            👤
                          </div>
                        )}
                        <span className="absolute -top-2 -right-2 text-base">🥈</span>
                      </div>
                      <span className="text-slate-300 font-bold text-sm text-center truncate w-full text-center">
                        {minigameTop3[1].username ?? minigameTop3[1].fullName ?? "???"}
                      </span>
                      <span className="text-[#fff675] font-bold text-sm">
                        {minigameTop3[1].amongUsScore.toLocaleString()}
                      </span>
                      <div className="w-full bg-slate-400/20 border-2 border-slate-300/50 rounded-t-lg h-20 flex items-center justify-center">
                        <span className="text-slate-300 font-bold text-2xl">2</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 max-w-[140px]" />
                  )}

                  {/* 1st Place */}
                  {minigameTop3[0] && (
                    <div className="flex flex-col items-center gap-2 flex-1 max-w-[160px]">
                      <div className="relative">
                        {minigameTop3[0].avatar != null ? (
                          <Image
                            src={`/${minigameTop3[0].avatar}.png`}
                            alt={minigameTop3[0].username ?? ""}
                            width={64}
                            height={64}
                            className="rounded-full border-2 border-yellow-400/80 object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-yellow-700 border-2 border-yellow-400/80 flex items-center justify-center text-2xl">
                            👤
                          </div>
                        )}
                        <span className="absolute -top-3 -right-2 text-xl">🏆</span>
                      </div>
                      <span className="text-yellow-300 font-bold text-base text-center truncate w-full text-center">
                        {minigameTop3[0].username ?? minigameTop3[0].fullName ?? "???"}
                      </span>
                      <span className="text-[#fff675] font-bold">
                        {minigameTop3[0].amongUsScore.toLocaleString()}
                      </span>
                      <div className="w-full bg-yellow-400/20 border-2 border-yellow-400/50 rounded-t-lg h-28 flex items-center justify-center">
                        <span className="text-yellow-300 font-bold text-3xl">1</span>
                      </div>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {minigameTop3[2] ? (
                    <div className="flex flex-col items-center gap-2 flex-1 max-w-[140px]">
                      <div className="relative">
                        {minigameTop3[2].avatar != null ? (
                          <Image
                            src={`/${minigameTop3[2].avatar}.png`}
                            alt={minigameTop3[2].username ?? ""}
                            width={52}
                            height={52}
                            className="rounded-full border-2 border-amber-600/60 object-cover"
                          />
                        ) : (
                          <div className="w-13 h-13 rounded-full bg-amber-800 border-2 border-amber-600/60 flex items-center justify-center text-xl">
                            👤
                          </div>
                        )}
                        <span className="absolute -top-2 -right-2 text-base">🥉</span>
                      </div>
                      <span className="text-amber-500 font-bold text-sm text-center truncate w-full text-center">
                        {minigameTop3[2].username ?? minigameTop3[2].fullName ?? "???"}
                      </span>
                      <span className="text-[#fff675] font-bold text-sm">
                        {minigameTop3[2].amongUsScore.toLocaleString()}
                      </span>
                      <div className="w-full bg-amber-700/20 border-2 border-amber-600/50 rounded-t-lg h-14 flex items-center justify-center">
                        <span className="text-amber-500 font-bold text-2xl">3</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 max-w-[140px]" />
                  )}
                </div>
              )}
            </div>
          </HandDrawnCard>
        </div>
      </main>
    </div>
  );
}
