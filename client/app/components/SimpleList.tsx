import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { FEST_SCHEDULE } from "../../constants/schedule";

export default function SimpleList() {
  return (
    <div className="max-w-4xl mx-auto space-y-16 relative z-20">
      {FEST_SCHEDULE.map((dayData) => (
        <div key={dayData.dayTitle} className="hand-drawn-card bg-black/60 p-6! md:p-10!">
          <div className="border-b-[3px] border-white/20 pb-6 mb-8" style={{ filter: "url(#wobbly-border)" }}>
            <h2 className="hand-drawn-title text-left! text-2xl! md:text-4xl! text-white mb-3">
              {dayData.dayTitle}
            </h2>
            <div className="flex items-center gap-2 text-[#00FFFF] font-mono tracking-widest text-sm md:text-base">
              <Calendar size={18} /> {dayData.date}
            </div>
          </div>

          <div className="space-y-6">
            {dayData.events.map((event) => (
              <div 
                key={event.id} 
                className="group border-[3px] border-white/10 rounded-[20px] p-5 md:p-6 bg-white/5 transition-all duration-300 hover:bg-black/80 hover:drop-shadow-[0_0_20px_rgba(0,255,0,0.6)] hover:-translate-y-1" 
                style={{ filter: "url(#wobbly-border)" }}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-4">
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider group-hover:text-[#00FF00] transition-colors" style={{ filter: "url(#wobbly-text)" }}>
                    {event.eventName}
                  </h3>
                  <div className="text-sm font-mono text-[#FFD700] border-2 border-white/20 px-3 py-1 rounded-full whitespace-nowrap bg-black/50 w-fit">
                    {event.time}
                  </div>
                </div>
                
                {event.description && (
                  <p className="text-white/70 font-medium text-sm md:text-base mb-4 leading-relaxed max-w-2xl">
                    {event.description}
                  </p>
                )}

                {event.venue && (
                  <div className="flex items-center gap-2 text-sm font-mono text-[#FF4655] tracking-wide">
                    <MapPin size={16} /> {event.venue}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}