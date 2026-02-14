"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import HandDrawnCard from "./HandDrawnCard";
import { PublicEventProps } from "@/types/interface";

type LegacyProps = {
  title?: string;
  teams?: string;
  prizePool?: string;
  featured?: boolean;
};

type Props = Partial<PublicEventProps> & LegacyProps & { featured?: boolean };

export default function EventCard(props: Props) {
  const {
    _id,
    eventName,
    title,
    description,
    category,
    banner,
    date,
    time,
    venue,
    isTeamEvent,
    membersPerTeam,
    teams,
    prizePool,
    featured = false,
  } = props as any;

  const displayTitle = eventName ?? title ?? "Untitled Event";
  const displayCategory = category ?? "General";

  const card = (
    <HandDrawnCard
      className={`h-full ${featured ? "border-yellow border-2 sm:border-3 md:border-4" : ""} cursor-pointer`}
    >
      <div className="mb-2 sm:mb-3 flex flex-wrap gap-2">
        <span className="text-[10px] sm:text-xs uppercase tracking-wider text-cyan px-2 py-1 border border-cyan rounded">
          {displayCategory}
        </span>
        {featured && (
          <span className="text-[10px] sm:text-xs uppercase tracking-wider text-yellow px-2 py-1 border border-yellow rounded">
            Featured
          </span>
        )}
      </div>

      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">
        {displayTitle}
      </h3>

      {banner && (
        <div className="mb-3 flex justify-center">
          <Image
            src={banner}
            alt={`${displayTitle} banner`}
            width={96}
            height={96}
            className="h-24 w-auto object-contain rounded-md"
          />
        </div>
      )}

      <p className="text-white/70 text-xs sm:text-sm md:text-base mb-3 sm:mb-4">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-[10px] sm:text-xs text-white/60">
        {date && time && (
          <div>
            <span className="text-cyan font-semibold">When:</span> {date} ·{" "}
            {time}
          </div>
        )}
        {venue && (
          <div>
            <span className="text-yellow font-semibold">Where:</span> {venue}
          </div>
        )}
        {typeof isTeamEvent !== "undefined" && (
          <div>
            <span className="text-cyan font-semibold">Format:</span>{" "}
            {isTeamEvent ? `Team (${membersPerTeam ?? "N/A"})` : "Individual"}
          </div>
        )}
        {prizePool && (
          <div>
            <span className="text-yellow font-semibold">Prize:</span>{" "}
            {prizePool}
          </div>
        )}
        {teams && (
          <div>
            <span className="text-cyan font-semibold">Teams:</span> {teams}
          </div>
        )}
      </div>
    </HandDrawnCard>
  );

  if (_id) {
    return (
      <Link href={`/events/${String(_id)}`} className="block">
        {card}
      </Link>
    );
  }

  return card;
}
