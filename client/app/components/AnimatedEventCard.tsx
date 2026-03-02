"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Clock, MapPin } from "lucide-react";
import { FestEvent } from "../../constants/schedule"; 

interface AnimatedEventCardProps {
  event: FestEvent;
  index: number;
  isEven: boolean;
}

export default function AnimatedEventCard({ event, index, isEven }: AnimatedEventCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isScanned, setIsScanned] = useState(false); 
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { 
        threshold: 0.25, 
        rootMargin: "0px" 
      } 
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // Timer to handle the scanning duration
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVisible && !isScanned) {
      timer = setTimeout(() => {
        setIsScanned(true);
      }, 1500); 
    }
    return () => clearTimeout(timer);
  }, [isVisible, isScanned]);

  const translateClass = isEven ? "-translate-x-16 md:-translate-x-24" : "translate-x-16 md:translate-x-24";

  return (
    <div
      ref={cardRef}
      className={`relative mb-16 flex justify-between items-center w-full ${
        isEven ? "md:flex-row-reverse" : "md:flex-row"
      } flex-col group transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-x-0" : `opacity-0 ${translateClass}`
      }`}
    >
      <div className="hidden md:block w-5/12" />

      {/* Peeking Figures */}
      <div className="hidden md:flex absolute inset-0 pointer-events-none items-center justify-center z-10">
        {isEven ? (
          <div 
            className={`absolute right-1/2 -mr-22.5 transition-all duration-700 ease-out delay-200
              ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}
            `}
          >
            <Image
              src="/peeking2.png"
              alt="Peeking Crewmate"
              width={230}
              height={150}
              className="object-contain drop-shadow-[0_0_15px_rgba(0,255,0,0.3)]"
              unoptimized
            />
          </div>
        ) : (
          <div 
            className={`absolute left-1/2 -ml-2.75 transition-all duration-700 ease-out delay-200
              ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}
            `}
          >
            <Image
              src="/peeking.png"
              alt="Peeking Crewmate"
              width={85}
              height={75}
              className="object-contain drop-shadow-[0_0_15px_rgba(255,0,0,0.3)]"
              unoptimized
            />
          </div>
        )}
      </div>

      {/* Event Details Panel */}
      <div className="w-full md:w-5/12 transition-all duration-300 hover:-translate-y-2 hover:drop-shadow-[0_0_20px_rgba(0,255,0,0.6)] relative z-40 h-full min-h-45">
        <div className="hand-drawn-card text-left! flex flex-col h-full group-hover:bg-black/90 relative overflow-hidden">
          
          {/* Scanning Overlay */}
          <div 
            className={`absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-500 ease-in-out
              ${isVisible && !isScanned ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
          >
            <div className="flex flex-col items-center">
              <Image
                src="/medbayScan.gif"
                alt="Scanning..."
                width={150}
                height={150}
                className="object-contain drop-shadow-[0_0_15px_rgba(0,255,0,0.5)]"
                unoptimized
              />
              <span className="text-[#00FFFF] font-mono text-xs tracking-widest mt-2 animate-pulse uppercase">Scanning Data...</span>
            </div>
          </div>

          {/* Actual Card Content */}
          <div className={`flex flex-col h-full transition-opacity duration-700 delay-150 ${isScanned ? "opacity-100" : "opacity-0"}`}>
            <h3 className="text-2xl font-bold text-[#00FFFF] mb-3 uppercase tracking-wider transition-colors group-hover:text-[#FF4655]" style={{ filter: "url(#wobbly-text)" }}>
              {event.eventName}
            </h3>
            
            {event.description && (
              <p className="text-white/80 font-medium text-sm mb-5 leading-relaxed">
                {event.description}
              </p>
            )}
            
            <div className="flex flex-col gap-3 mt-auto border-t border-white/20 pt-4">
              <div className="flex items-center gap-3 text-white">
                <Clock size={18} className="text-[#FFD700]" />
                <span className="font-mono text-sm tracking-wide">{event.time}</span>
              </div>
              {event.venue && (
                <div className="flex items-center gap-3 text-white">
                  <MapPin size={18} className="text-[#FF4655]" />
                  <span className="font-mono text-sm tracking-wide">{event.venue}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}