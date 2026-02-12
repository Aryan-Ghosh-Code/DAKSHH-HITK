'use client';

import Image from 'next/image';
import {
  MOBILE_CREWMATES,
  DESKTOP_CREWMATES,
  COMING_SOON_MOBILE,
  COMING_SOON_DESKTOP,
  floatClass,
} from './crewmatesConfig';

const BASE = 'absolute pointer-events-none z-0';
const MOBILE_BASE = `md:hidden ${BASE} float opacity-60`;
const DESKTOP_BASE = `hidden md:block ${BASE} opacity-80`;

function transformStr(rotate: string, mirror?: boolean) {
  return mirror ? `scaleX(-1) rotate(${rotate})` : `rotate(${rotate})`;
}

type CrewmatesProps = { compact?: boolean };

export default function Crewmates({ compact = false }: CrewmatesProps) {
  const mobileCrewmates = compact ? COMING_SOON_MOBILE : MOBILE_CREWMATES;
  const desktopCrewmates = compact ? COMING_SOON_DESKTOP : DESKTOP_CREWMATES;

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-0 ${compact ? 'min-h-screen' : 'min-h-[300vh]'}`}
      data-crewmate-wrap
      aria-hidden="true"
    >
      {mobileCrewmates.map((m, i) => (
        <div
          key={`m-${i}`}
          className={`${MOBILE_BASE} ${floatClass(m.delay)}`}
          style={{ left: m.left, right: m.right, top: m.top }}
        >
          <div
            style={{
              width: m.size,
              height: m.size,
              transform: transformStr(m.rotate, m.mirror),
            }}
          >
            <Image
              src={m.src}
              alt="Crewmate"
              width={m.size}
              height={m.size}
              className="w-full h-full"
            />
          </div>
        </div>
      ))}
      {desktopCrewmates.map((d, i) => (
        <div
          key={`d-${i}`}
          className={`${DESKTOP_BASE} ${floatClass(d.delay)}`}
          style={{ left: d.left, right: d.right, top: d.top }}
        >
          <div
            className={d.sizeClass}
            style={{ transform: transformStr(d.rotate, d.mirror) }}
          >
            <Image
              src={d.src}
              alt="Crewmate"
              width={150}
              height={150}
              className="w-full h-full"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
