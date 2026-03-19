"use client";

import { useEffect, useState, useCallback } from "react";
import HandDrawnCard from "@/app/components/HandDrawnCard";
import { useAmongUsToast } from "@/app/components/ui/among-us-toast";

interface EventOption {
  id: string;
  eventName: string;
  banner: string | null;
  category: string | null;
  isTeamEvent: boolean;
}

interface ResultEntry {
  _id?: string;
  position: "winner" | "runner_up" | "second_runner_up" | "honorable_mention";
  positionLabel: string;
  rank: number;
  teamName: string;
  participants: { name: string; userId?: string }[];
  note: string;
  // source tracking
  sourceType: "registered_team" | "registered_solo" | "manual";
  sourceTeamId?: string;
  sourceRegistrationId?: string;
}

interface TeamOption {
  teamId: string;
  teamCode: string;
  teamName: string;
  participants: { userId: string; name: string; isLeader: boolean }[];
}

interface SoloOption {
  registrationId: string;
  participantId: string;
  name: string;
}

interface EventResult {
  _id?: string;
  eventId: string;
  eventName: string;
  entries: ResultEntry[];
  isPublished: boolean;
  publishedAt?: string | null;
  updatedAt?: string | null;
}

const POSITION_OPTIONS = [
  { value: "winner", label: "🏆 Winner" },
  { value: "runner_up", label: "🥈 Runner Up" },
  { value: "second_runner_up", label: "🥉 2nd Runner Up" },
  { value: "honorable_mention", label: "⭐ Honorable Mention" },
] as const;

const POSITION_COLORS: Record<string, string> = {
  winner: "border-yellow-400 bg-yellow-400/10",
  runner_up: "border-slate-300 bg-slate-300/10",
  second_runner_up: "border-amber-600 bg-amber-600/10",
  honorable_mention: "border-cyan-500 bg-cyan-500/10",
};

const POSITION_TEXT: Record<string, string> = {
  winner: "text-yellow-400",
  runner_up: "text-slate-300",
  second_runner_up: "text-amber-500",
  honorable_mention: "text-cyan-400",
};

function blankEntry(): ResultEntry {
  return {
    position: "winner",
    positionLabel: "",
    rank: 1,
    teamName: "",
    participants: [{ name: "" }],
    note: "",
    sourceType: "manual",
  };
}

export default function AdminResultsClient() {
  const toast = useAmongUsToast();

  const [events, setEvents] = useState<EventOption[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [currentResult, setCurrentResult] = useState<EventResult | null>(null);
  const [entries, setEntries] = useState<ResultEntry[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [teamOptions, setTeamOptions] = useState<TeamOption[]>([]);
  const [soloOptions, setSoloOptions] = useState<SoloOption[]>([]);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Results page visibility
  const [resultsPageEnabled, setResultsPageEnabled] = useState(true);
  const [visibilityLoading, setVisibilityLoading] = useState(true);
  const [visibilityUpdating, setVisibilityUpdating] = useState(false);

  useEffect(() => {
    const loadVisibility = async () => {
      try {
        const res = await fetch("/api/admin-panel/settings/results-visibility");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setResultsPageEnabled(data.enabled);
      } catch {
        // default to enabled if fetch fails
      } finally {
        setVisibilityLoading(false);
      }
    };
    loadVisibility();
  }, []);

  const handleToggleVisibility = async () => {
    setVisibilityUpdating(true);
    const newValue = !resultsPageEnabled;
    try {
      const res = await fetch("/api/admin-panel/settings/results-visibility", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: newValue }),
      });
      if (!res.ok) throw new Error("Failed");
      setResultsPageEnabled(newValue);
      toast.success(
        newValue
          ? "Results page is now visible to the public"
          : "Results page is now hidden from the public"
      );
    } catch {
      toast.error("Failed to update results page visibility");
    } finally {
      setVisibilityUpdating(false);
    }
  };

  // Load all events
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin-panel/results");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setEvents(data.events ?? []);
      } catch {
        toast.error("Failed to load events");
      }
    };
    load();
  }, []);

  // Load event-specific data when event is selected
  const loadEventResult = useCallback(
    async (eventId: string) => {
      if (!eventId) return;
      setLoadingEvent(true);
      setCurrentResult(null);
      setEntries([]);
      setTeamOptions([]);
      setSoloOptions([]);
      setIsPublished(false);
      try {
        const res = await fetch(`/api/admin-panel/results/${eventId}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();

        setTeamOptions(data.teamOptions ?? []);
        setSoloOptions(data.soloOptions ?? []);

        if (data.result) {
          setCurrentResult(data.result);
          // Hydrate entries with sourceType = manual if not tracked
          const hydrated = (data.result.entries ?? []).map(
            (e: ResultEntry) => ({
              ...e,
              positionLabel: e.positionLabel ?? "",
              teamName: e.teamName ?? "",
              note: e.note ?? "",
              participants: e.participants?.length
                ? e.participants
                : [{ name: "" }],
              sourceType: e.sourceType ?? "manual",
            })
          );
          setEntries(hydrated);
          setIsPublished(data.result.isPublished ?? false);
        }
      } catch {
        toast.error("Failed to load event results");
      } finally {
        setLoadingEvent(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (selectedEventId) loadEventResult(selectedEventId);
  }, [selectedEventId, loadEventResult]);

  const handleSelectTeam = (entryIdx: number, teamId: string) => {
    const team = teamOptions.find((t) => t.teamId === teamId);
    if (!team) return;
    setEntries((prev) =>
      prev.map((e, i) =>
        i !== entryIdx
          ? e
          : {
              ...e,
              teamName: team.teamName || team.teamCode || "",
              participants: team.participants.map((p) => ({
                name: p.name,
                userId: p.userId,
              })),
              sourceType: "registered_team" as const,
              sourceTeamId: teamId,
            }
      )
    );
  };

  const handleSelectSolo = (entryIdx: number, registrationId: string) => {
    const solo = soloOptions.find((s) => s.registrationId === registrationId);
    if (!solo) return;
    setEntries((prev) =>
      prev.map((e, i) =>
        i !== entryIdx
          ? e
          : {
              ...e,
              teamName: solo.name,
              participants: [{ name: solo.name, userId: solo.participantId }],
              sourceType: "registered_solo" as const,
              sourceRegistrationId: registrationId,
            }
      )
    );
  };

  const addEntry = (position: ResultEntry["position"]) => {
    setEntries((prev) => [...prev, { ...blankEntry(), position }]);
  };

  const removeEntry = (idx: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateEntry = (idx: number, patch: Partial<ResultEntry>) => {
    setEntries((prev) =>
      prev.map((e, i) => (i === idx ? { ...e, ...patch } : e))
    );
  };

  const addParticipant = (entryIdx: number) => {
    setEntries((prev) =>
      prev.map((e, i) =>
        i === entryIdx
          ? { ...e, participants: [...e.participants, { name: "" }] }
          : e
      )
    );
  };

  const removeParticipant = (entryIdx: number, pIdx: number) => {
    setEntries((prev) =>
      prev.map((e, i) =>
        i === entryIdx
          ? {
              ...e,
              participants: e.participants.filter((_, pi) => pi !== pIdx),
            }
          : e
      )
    );
  };

  const updateParticipantName = (
    entryIdx: number,
    pIdx: number,
    name: string
  ) => {
    setEntries((prev) =>
      prev.map((e, i) =>
        i === entryIdx
          ? {
              ...e,
              participants: e.participants.map((p, pi) =>
                pi === pIdx ? { ...p, name } : p
              ),
            }
          : e
      )
    );
  };

  const switchToManual = (entryIdx: number) => {
    updateEntry(entryIdx, {
      sourceType: "manual",
      sourceTeamId: undefined,
      sourceRegistrationId: undefined,
    });
  };

  const handleSave = async (publish: boolean) => {
    if (!selectedEventId) return;

    // Validate
    for (const entry of entries) {
      const hasName =
        entry.teamName.trim() ||
        entry.participants.some((p) => p.name.trim());
      if (!hasName) {
        toast.error("Each result entry must have a team/participant name");
        return;
      }
      const cleanParticipants = entry.participants.filter((p) =>
        p.name.trim()
      );
      if (cleanParticipants.length === 0) {
        toast.error("Each entry must have at least one participant");
        return;
      }
    }

    setSaving(true);
    try {
      const cleanEntries = entries.map((e) => ({
        position: e.position,
        positionLabel: e.positionLabel?.trim() || undefined,
        rank: e.rank,
        teamName: e.teamName?.trim() || undefined,
        participants: e.participants
          .filter((p) => p.name.trim())
          .map((p) => ({ name: p.name.trim(), userId: p.userId })),
        note: e.note?.trim() || undefined,
        teamId: e.sourceTeamId || undefined,
        registrationId: e.sourceRegistrationId || undefined,
        sourceType: e.sourceType,
      }));

      const res = await fetch(`/api/admin-panel/results/${selectedEventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: cleanEntries, isPublished: publish }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");

      setIsPublished(publish);
      setCurrentResult(data.result);
      toast.success(
        publish ? "Results published! 🎉" : "Results saved as draft"
      );
    } catch (err) {
      toast.error((err as Error).message || "Failed to save results");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEventId || !currentResult) return;
    if (!confirm("Delete all results for this event? This cannot be undone."))
      return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin-panel/results/${selectedEventId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setCurrentResult(null);
      setEntries([]);
      setIsPublished(false);
      toast.success("Results deleted");
    } catch {
      toast.error("Failed to delete results");
    } finally {
      setDeleting(false);
    }
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  // Group entries by position for display order
  const positionOrder = [
    "winner",
    "runner_up",
    "second_runner_up",
    "honorable_mention",
  ] as const;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Results Page Visibility Toggle */}
      <HandDrawnCard className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="hand-drawn-title admin-section-title text-white mb-1">
              Public Results Page
            </h2>
            <p className="text-white/50 text-xs">
              {resultsPageEnabled
                ? "Results page is currently visible to everyone."
                : "Results page is hidden — visitors will see a locked message."}
            </p>
          </div>
          <button
            onClick={handleToggleVisibility}
            disabled={visibilityLoading || visibilityUpdating}
            className={`relative inline-flex h-7 w-14 shrink-0 items-center rounded-full border-2 transition-colors focus:outline-none disabled:opacity-50 ${
              resultsPageEnabled
                ? "bg-green-500/80 border-green-400"
                : "bg-red-700/60 border-red-600"
            }`}
            aria-label="Toggle results page visibility"
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                resultsPageEnabled ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              resultsPageEnabled ? "bg-green-400" : "bg-red-500"
            }`}
          />
          <span
            className={`text-xs font-semibold ${
              resultsPageEnabled ? "text-green-400" : "text-red-400"
            }`}
          >
            {visibilityLoading
              ? "Loading..."
              : resultsPageEnabled
              ? "VISIBLE TO PUBLIC"
              : "HIDDEN FROM PUBLIC"}
          </span>
        </div>
      </HandDrawnCard>

      {/* Event Selector */}
      <HandDrawnCard className="p-4 sm:p-6">
        <h2 className="hand-drawn-title admin-section-title text-white mb-3">
          Select Event
        </h2>
        <select
          className="w-full bg-black/60 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors"
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
        >
          <option value="">-- Choose an event --</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.eventName}
              {ev.category ? ` (${ev.category})` : ""}
            </option>
          ))}
        </select>

        {selectedEvent && (
          <div className="mt-3 flex items-center gap-3 text-sm text-white/50">
            {selectedEvent.banner && (
              <img
                src={selectedEvent.banner}
                alt={selectedEvent.eventName}
                className="w-8 h-8 rounded-full object-cover border border-white/20"
              />
            )}
            <span>{selectedEvent.eventName}</span>
            {selectedEvent.isTeamEvent ? (
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs">
                Team Event
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 text-xs">
                Solo Event
              </span>
            )}
            {currentResult && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs border ${
                  isPublished
                    ? "bg-green-500/20 text-green-300 border-green-500/30"
                    : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                }`}
              >
                {isPublished ? "Published" : "Draft"}
              </span>
            )}
          </div>
        )}
      </HandDrawnCard>

      {loadingEvent && (
        <HandDrawnCard className="p-6 text-center">
          <p className="text-white/50">Loading event data...</p>
        </HandDrawnCard>
      )}

      {!loadingEvent && selectedEventId && (
        <>
          {/* Add Entry Buttons */}
          <HandDrawnCard className="p-4 sm:p-6">
            <h2 className="hand-drawn-title admin-section-title text-white mb-4">
              Add Result Entry
            </h2>
            <div className="flex flex-wrap gap-3">
              {POSITION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => addEntry(opt.value)}
                  className="hand-drawn-button px-4 py-2 text-sm"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </HandDrawnCard>

          {/* Entries Editor */}
          {positionOrder.map((pos) => {
            const posEntries = entries
              .map((e, i) => ({ entry: e, idx: i }))
              .filter(({ entry }) => entry.position === pos);
            if (posEntries.length === 0) return null;

            const posConfig = POSITION_OPTIONS.find((p) => p.value === pos);
            return (
              <div key={pos} className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <span className="text-xl">{posConfig?.label.split(" ")[0]}</span>
                  <h3 className={`font-bold uppercase tracking-wider ${POSITION_TEXT[pos]}`}>
                    {posConfig?.label.slice(2)}
                  </h3>
                </div>

                {posEntries.map(({ entry, idx }) => (
                  <HandDrawnCard
                    key={idx}
                    className={`p-4 sm:p-5 border-2 ${POSITION_COLORS[pos]}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold uppercase ${POSITION_TEXT[pos]}`}>
                          {posConfig?.label.slice(2)} #{idx + 1}
                        </span>
                      </div>
                      <button
                        onClick={() => removeEntry(idx)}
                        className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded border border-red-400/30 hover:border-red-300/50 transition-colors"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {/* Rank */}
                      <div>
                        <label className="text-xs text-white/50 uppercase tracking-wide block mb-1">
                          Rank / Order
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={entry.rank}
                          onChange={(e) =>
                            updateEntry(idx, {
                              rank: parseInt(e.target.value) || 1,
                            })
                          }
                          className="w-full bg-black/60 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/50"
                        />
                      </div>

                      {/* Custom Label */}
                      <div>
                        <label className="text-xs text-white/50 uppercase tracking-wide block mb-1">
                          Custom Label (optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Best Design Award"
                          value={entry.positionLabel}
                          onChange={(e) =>
                            updateEntry(idx, { positionLabel: e.target.value })
                          }
                          className="w-full bg-black/60 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/50"
                        />
                      </div>
                    </div>

                    {/* Source Type Toggle */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-white/50 uppercase tracking-wide">
                          Entry Source
                        </span>
                        <div className="flex rounded-lg overflow-hidden border border-white/20">
                          <button
                            onClick={() => {
                              if (
                                selectedEvent?.isTeamEvent &&
                                teamOptions.length > 0
                              ) {
                                updateEntry(idx, {
                                  sourceType: "registered_team",
                                  teamName: "",
                                  participants: [],
                                  sourceTeamId: undefined,
                                });
                              } else if (
                                !selectedEvent?.isTeamEvent &&
                                soloOptions.length > 0
                              ) {
                                updateEntry(idx, {
                                  sourceType: "registered_solo",
                                  teamName: "",
                                  participants: [],
                                  sourceRegistrationId: undefined,
                                });
                              }
                            }}
                            className={`px-3 py-1.5 text-xs transition-colors ${
                              entry.sourceType !== "manual"
                                ? "bg-cyan-500/30 text-cyan-300"
                                : "bg-black/30 text-white/40 hover:text-white/60"
                            }`}
                          >
                            From Registered
                          </button>
                          <button
                            onClick={() => switchToManual(idx)}
                            className={`px-3 py-1.5 text-xs transition-colors ${
                              entry.sourceType === "manual"
                                ? "bg-purple-500/30 text-purple-300"
                                : "bg-black/30 text-white/40 hover:text-white/60"
                            }`}
                          >
                            Manual Entry
                          </button>
                        </div>
                      </div>

                      {/* Registered Team/Solo Picker */}
                      {entry.sourceType !== "manual" &&
                        selectedEvent?.isTeamEvent &&
                        teamOptions.length > 0 && (
                          <div>
                            <label className="text-xs text-white/50 uppercase tracking-wide block mb-1">
                              Select Registered Team
                            </label>
                            <select
                              className="w-full bg-black/60 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/50"
                              value={entry.sourceTeamId ?? ""}
                              onChange={(e) =>
                                handleSelectTeam(idx, e.target.value)
                              }
                            >
                              <option value="">-- Select team --</option>
                              {teamOptions.map((t) => (
                                <option key={t.teamId} value={t.teamId}>
                                  {t.teamName || t.teamCode} (
                                  {t.participants.length} members)
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                      {entry.sourceType !== "manual" &&
                        !selectedEvent?.isTeamEvent &&
                        soloOptions.length > 0 && (
                          <div>
                            <label className="text-xs text-white/50 uppercase tracking-wide block mb-1">
                              Select Registered Participant
                            </label>
                            <select
                              className="w-full bg-black/60 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/50"
                              value={entry.sourceRegistrationId ?? ""}
                              onChange={(e) =>
                                handleSelectSolo(idx, e.target.value)
                              }
                            >
                              <option value="">-- Select participant --</option>
                              {soloOptions.map((s) => (
                                <option
                                  key={s.registrationId}
                                  value={s.registrationId}
                                >
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                      {entry.sourceType !== "manual" &&
                        ((selectedEvent?.isTeamEvent &&
                          teamOptions.length === 0) ||
                          (!selectedEvent?.isTeamEvent &&
                            soloOptions.length === 0)) && (
                          <p className="text-yellow-400/70 text-xs">
                            No registered{" "}
                            {selectedEvent?.isTeamEvent
                              ? "teams"
                              : "participants"}{" "}
                            found. Switch to Manual Entry.
                          </p>
                        )}
                    </div>

                    {/* Team Name (manual or display) */}
                    {(entry.sourceType === "manual" ||
                      (entry.participants.length > 1 &&
                        entry.sourceType !== "registered_solo")) && (
                      <div className="mb-3">
                        <label className="text-xs text-white/50 uppercase tracking-wide block mb-1">
                          Team Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter team name"
                          value={entry.teamName}
                          readOnly={entry.sourceType !== "manual"}
                          onChange={(e) =>
                            updateEntry(idx, { teamName: e.target.value })
                          }
                          className={`w-full border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/50 ${
                            entry.sourceType !== "manual"
                              ? "bg-black/30 border-white/10 text-white/50 cursor-not-allowed"
                              : "bg-black/60 border-white/20"
                          }`}
                        />
                      </div>
                    )}

                    {/* Participants */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs text-white/50 uppercase tracking-wide">
                          Participants
                        </label>
                        {entry.sourceType === "manual" && (
                          <button
                            onClick={() => addParticipant(idx)}
                            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            + Add Participant
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {entry.participants.map((p, pIdx) => (
                          <div key={pIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder={`Participant ${pIdx + 1} name`}
                              value={p.name}
                              readOnly={entry.sourceType !== "manual"}
                              onChange={(e) =>
                                updateParticipantName(idx, pIdx, e.target.value)
                              }
                              className={`flex-1 border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/50 ${
                                entry.sourceType !== "manual"
                                  ? "bg-black/30 border-white/10 text-white/50 cursor-not-allowed"
                                  : "bg-black/60 border-white/20"
                              }`}
                            />
                            {entry.sourceType === "manual" &&
                              entry.participants.length > 1 && (
                                <button
                                  onClick={() => removeParticipant(idx, pIdx)}
                                  className="text-red-400/60 hover:text-red-400 text-lg shrink-0"
                                >
                                  ×
                                </button>
                              )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Note */}
                    <div>
                      <label className="text-xs text-white/50 uppercase tracking-wide block mb-1">
                        Note (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Received special recognition for innovation"
                        value={entry.note}
                        onChange={(e) =>
                          updateEntry(idx, { note: e.target.value })
                        }
                        className="w-full bg-black/60 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/50"
                      />
                    </div>
                  </HandDrawnCard>
                ))}
              </div>
            );
          })}

          {/* No entries message */}
          {entries.length === 0 && (
            <HandDrawnCard className="p-6 text-center">
              <p className="text-white/40 text-sm">
                No result entries yet. Use the buttons above to add winners,
                runner-ups, or honorable mentions.
              </p>
            </HandDrawnCard>
          )}

          {/* Save Actions */}
          <HandDrawnCard className="p-4 sm:p-6">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleSave(false)}
                  disabled={saving || deleting}
                  className="hand-drawn-button px-5 py-2.5 bg-blue-600/80 hover:bg-blue-600 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Draft"}
                </button>
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving || deleting}
                  className="hand-drawn-button px-5 py-2.5 bg-green-600/80 hover:bg-green-600 disabled:opacity-50"
                >
                  {saving ? "Publishing..." : isPublished ? "Update & Publish" : "Publish Results 🎉"}
                </button>
                {isPublished && (
                  <button
                    onClick={() => handleSave(false)}
                    disabled={saving || deleting}
                    className="hand-drawn-button px-5 py-2.5 bg-yellow-600/80 hover:bg-yellow-600 disabled:opacity-50 text-sm"
                  >
                    Unpublish
                  </button>
                )}
              </div>

              {currentResult && (
                <button
                  onClick={handleDelete}
                  disabled={saving || deleting}
                  className="hand-drawn-button px-4 py-2 bg-red-700/60 hover:bg-red-700 disabled:opacity-50 text-sm"
                >
                  {deleting ? "Deleting..." : "Delete Results"}
                </button>
              )}
            </div>

            {currentResult?.updatedAt && (
              <p className="text-white/30 text-xs mt-3">
                Last saved:{" "}
                {new Date(currentResult.updatedAt).toLocaleString()}
              </p>
            )}
          </HandDrawnCard>
        </>
      )}

      {!selectedEventId && !loadingEvent && (
        <HandDrawnCard className="p-8 text-center">
          <div className="text-4xl mb-3">🏆</div>
          <p className="text-white/50 text-sm">
            Select an event above to manage its results
          </p>
        </HandDrawnCard>
      )}

      {/* Results Overview */}
      {events.length > 0 && (
        <HandDrawnCard className="p-4 sm:p-6">
          <h2 className="hand-drawn-title admin-section-title text-white mb-4">
            All Event Results
          </h2>
          <ResultsOverview onSelectEvent={setSelectedEventId} />
        </HandDrawnCard>
      )}
    </div>
  );
}

function ResultsOverview({
  onSelectEvent,
}: {
  onSelectEvent: (id: string) => void;
}) {
  const toast = useAmongUsToast();
  const [results, setResults] = useState<
    {
      _id: string;
      eventId: string;
      eventName: string;
      isPublished: boolean;
      entries: unknown[];
      updatedAt: string | null;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin-panel/results");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        toast.error("Failed to load results overview");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading)
    return <p className="text-white/50 text-sm">Loading overview...</p>;
  if (results.length === 0)
    return (
      <p className="text-white/40 text-sm">
        No results created yet for any event.
      </p>
    );

  return (
    <div className="space-y-2">
      {results.map((r) => (
        <div
          key={r._id}
          className="flex items-center justify-between gap-3 p-3 rounded-lg border border-white/10 bg-black/20 hover:bg-black/30 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${r.isPublished ? "bg-green-400" : "bg-yellow-400"}`}
            />
            <span className="text-white font-medium truncate">
              {r.eventName}
            </span>
            <span className="text-white/40 text-xs shrink-0">
              {Array.isArray(r.entries) ? r.entries.length : 0} entries
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                r.isPublished
                  ? "bg-green-500/20 text-green-300"
                  : "bg-yellow-500/20 text-yellow-300"
              }`}
            >
              {r.isPublished ? "Published" : "Draft"}
            </span>
            <button
              onClick={() => onSelectEvent(r.eventId)}
              className="text-cyan-400 hover:text-cyan-300 text-xs transition-colors underline"
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
