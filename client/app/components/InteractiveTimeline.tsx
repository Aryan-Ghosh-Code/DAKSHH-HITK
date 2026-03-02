import React from "react";
import { Calendar } from "lucide-react";
import AnimatedEventCard from "./AnimatedEventCard";
import { FEST_SCHEDULE } from "../../constants/schedule";

export default function InteractiveTimeline() {
  return (
    <div className="relative p-4 h-full w-full">
      {/* Central Dashed Line */}
      <div className="hidden md:block absolute top-0 bottom-0 border-l-[3px] border-white/40 border-dashed left-1/2 -translate-x-1/2 z-0" />

      {FEST_SCHEDULE.map((dayData, dayIndex) => {
        const previousEventsCount = FEST_SCHEDULE.slice(0, dayIndex).reduce((acc, curr) => acc + curr.events.length, 0);

        return (
          <div key={dayData.dayTitle} className="mb-24 mt-10 relative z-20">
            <div className="flex justify-center mb-16 relative">
              <div className="hand-drawn-card w-auto! inline-flex! flex-col items-center px-8! py-4! bg-black/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <h2 className="hand-drawn-title text-2xl! md:text-3xl! text-white mb-2">
                  {dayData.dayTitle}
                </h2>
                <div className="flex items-center gap-2 text-[#00FFFF] font-mono text-sm tracking-widest">
                  <Calendar size={14} /> {dayData.date}
                </div>
              </div>
            </div>

            {dayData.events.map((event, index) => (
              <AnimatedEventCard
                key={event.id}
                event={event}
                index={index}
                isEven={(previousEventsCount + index) % 2 === 0}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}