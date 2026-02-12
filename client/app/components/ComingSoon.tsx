'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Crewmates from './Crewmates';

const CAPTIONS = [
  'Something sus is brewing...',
  'Report to the cafeteria soon.',
  'Tasks incoming • Stay tuned.',
  'Emergency meeting in progress.',
];

export default function ComingSoon() {
  const [phase, setPhase] = useState<'intro' | 'fade-in' | 'visible'>('intro');
  const [captionIndex, setCaptionIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    // Crewmate spins & floats across: ~3s
    const introDone = setTimeout(() => {
      setPhase('fade-in');
      document.body.style.overflow = '';
    }, 3200);
    return () => clearTimeout(introDone);
  }, []);

  useEffect(() => {
    if (phase !== 'visible') return;
    const i = setInterval(() => {
      setCaptionIndex((c) => (c + 1) % CAPTIONS.length);
    }, 2500);
    return () => clearInterval(i);
  }, [phase]);

  return (
    <>
      {/* Black overlay - fades out when intro ends (DotOrbit stays as bg layer) */}
      <div
        className="fixed inset-0 z-20 bg-black transition-opacity duration-700 pointer-events-none"
        style={{
          opacity: phase === 'intro' ? 1 : 0,
          pointerEvents: phase === 'intro' ? 'auto' : 'none',
        }}
        aria-hidden="true"
      />

      {/* Spinning crewmate that floats left to right - only visible during intro */}
      <div
        className="fixed inset-0 z-30 pointer-events-none overflow-hidden"
        style={{
          opacity: phase === 'intro' ? 1 : 0,
          transition: 'opacity 0.5s ease-out',
        }}
        aria-hidden="true"
      >
        <div className="crewmate-intro-float absolute left-0 top-1/2 -translate-y-1/2">
          <div className="crewmate-intro-spin w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
            <Image
              src="/1.png"
              alt=""
              width={96}
              height={96}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Main content - fades in after intro */}
      <div
        className="fixed inset-0 z-10 flex flex-col items-center justify-center min-h-screen transition-opacity duration-1000"
        style={{
          opacity: phase === 'fade-in' || phase === 'visible' ? 1 : 0,
        }}
        onTransitionEnd={() => phase === 'fade-in' && setPhase('visible')}
      >
        <Crewmates compact />

        <div className="relative z-20 text-center px-4">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase tracking-wider text-white mb-4 sm:mb-6"
            style={{ filter: 'url(#wobbly-text)' }}
          >
            Coming Soon
          </h1>
          <p
            className="text-sm sm:text-base md:text-lg font-medium transition-opacity duration-500"
            style={{
              color: ['#00FFFF', '#FF4655', '#FFD700', '#00FF00'][captionIndex % 4],
              textShadow: '0 0 12px currentColor',
            }}
          >
            {CAPTIONS[captionIndex]}
          </p>
        </div>
      </div>
    </>
  );
}
