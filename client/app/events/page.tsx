"use client";

import Navbar from "../components/Navbar";
import { DotOrbit } from "@paper-design/shaders-react";
import Crewmates from "../components/Crewmates";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import SpaceLoader from "../components/SpaceLoader";
import EventCard from "../components/EventCard";

type PublicEvent = {
  _id: string;
  eventName: string;
  category: "Software" | "Hardware" | "Entrepreneurship" | string;
  description?: string;
  banner?: string;
  date?: string;
  time?: string;
  venue?: string;
  isTeamEvent?: boolean;
  membersPerTeam?: number;
};

const CATEGORIES = ["All", "Software", "Hardware", "Entrepreneurship"];

const Events = () => {
  const [events, setEvents] = useState<PublicEvent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/events/public");
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          toast.error(data.error || "Failed to fetch events");
          setEvents([]);
          return;
        }

        setEvents(data as PublicEvent[]);
      } catch (error) {
        console.error(error);
        toast.error((error as Error)?.message || "Failed to fetch events");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filtered = useMemo(() => {
    if (!events) return [];
    return events.filter((e) => {
      const matchesCategory = category === "All" || e.category === category;
      const matchesQuery =
        query.trim() === "" ||
        e.eventName.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [events, category, query]);

  return (
    <div className="w-full min-h-screen relative" data-main-content>
      <Navbar />

      <div className="fixed inset-0 w-full h-full z-0">
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

      <div className="relative z-10 h-screen overflow-hidden">
        <Crewmates />
        <div className="relative z-10 pt-24 pb-12 px-4 max-w-7xl mx-auto">
          <h1 className="hand-drawn-title text-4xl sm:text-5xl text-center text-white mb-4">
            All Events
          </h1>
          <p className="text-center text-white/70 mb-8">
            Browse events and filter by category or search by name.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`hand-drawn-button px-3 py-2 text-sm ${category === cat ? "border-yellow" : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-1/3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events by name..."
                className="w-full rounded-md px-3 py-2 bg-black/60 border border-white/10 text-white"
              />
            </div>
          </div>

          {loading && (
            <div className="w-full flex items-center justify-center py-16">
              <SpaceLoader />
            </div>
          )}

          {!loading && (!events || events.length === 0) && (
            <div className="py-20 text-center text-white/70">
              No events available at the moment. Check back later.
            </div>
          )}

          {!loading && events && events.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.length === 0 ? (
                <div className="col-span-full text-center text-white/70 py-8">
                  No events match your filters.
                </div>
              ) : (
                filtered.map((ev) => (
                  <EventCard
                    key={String(ev._id)}
                    _id={ev._id}
                    eventName={ev.eventName}
                    description={ev.description}
                    category={ev.category}
                    banner={ev.banner}
                    date={ev.date}
                    time={ev.time}
                    venue={ev.venue}
                    isTeamEvent={ev.isTeamEvent}
                    membersPerTeam={ev.membersPerTeam}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
