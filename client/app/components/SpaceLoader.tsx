'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function SpaceLoader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0 as any);
  const [opacity, setOpacity] = useState(1);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [welcomeOpacity, setWelcomeOpacity] = useState(0);
  const [toOpacity, setToOpacity] = useState(0);
  const [dakshhOpacity, setDakshhOpacity] = useState(0);
  const [imgOpacity, setImgOpacity] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mounted) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let fl = 3;
    let count = 20000; // Many many more stars!
    let points: any[] = [];
    let startSpeed = 2;
    let tick = 0;
    let width: number;
    let height: number;
    let bounds: any;
    let vp: { x: number; y: number };
    let mouse: { x: number; y: number; down: boolean };
    let canvasOffset: { x: number; y: number };

    function rand(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    function resetPoint(p: any, init?: boolean) {
      p.z = init ? rand(0, bounds.z.max) : bounds.z.max;
      p.x = rand(bounds.x.min, bounds.x.max) / (fl / (fl + p.z));
      p.y = rand(bounds.y.min, bounds.y.max) / (fl / (fl + p.z));
      p.ox = p.x;
      p.oy = p.y;
      p.oz = p.z;
      p.vx = 0;
      p.vy = 0;
      p.vz = rand(-1, -10) + startSpeed;
      p.ax = 0;
      p.ay = 0;
      p.az = 0;
      p.s = 0;
      p.sx = 0;
      p.sy = 0;
      p.os = p.s;
      p.osx = p.sx;
      p.osy = p.sy;
      p.hue = rand(120, 200);
      p.lightness = rand(70, 100);
      p.alpha = 0;
      return p;
    }

    function create() {
      vp = {
        x: width / 2,
        y: height / 2,
      };
      mouse = {
        x: vp.x,
        y: vp.y,
        down: false,
      };
      bounds = {
        x: { min: -vp.x, max: width - vp.x },
        y: { min: -vp.y, max: height - vp.y },
        z: { min: -fl, max: 1000 },
      };
    }

    function update() {
      if (mouse.down) {
        if (startSpeed > -30) {
          startSpeed -= 0.1;
        } else {
          startSpeed = -30;
        }
      } else {
        if (startSpeed < 0) {
          startSpeed += 1;
        } else {
          startSpeed = 0;
        }
      }

      vp.x += (width / 2 - (mouse.x - width / 2) - vp.x) * 0.025;
      vp.y += (height / 2 - (mouse.y - height / 2) - vp.y) * 0.025;
      bounds = {
        x: { min: -vp.x, max: width - vp.x },
        y: { min: -vp.y, max: height - vp.y },
        z: { min: -fl, max: 1000 },
      };

      if (points.length < count) {
        points.push(resetPoint({}));
      }
      let i = points.length;
      while (i--) {
        const p = points[i];
        p.vx += p.ax;
        p.vy += p.ay;
        p.vz += p.az;
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        if (mouse.down) {
          p.az = -0.5;
        }
        if (
          p.z > bounds.z.max ||
          p.z < bounds.z.min
        ) {
          resetPoint(p);
        }
        p.ox = p.x;
        p.oy = p.y;
        p.oz = p.z;
        p.os = p.s;
        p.osx = p.sx;
        p.osy = p.sy;
      }
    }

    function render() {
      if (!ctx) return;
      ctx.save();
      ctx.translate(vp.x, vp.y);
      ctx.clearRect(-vp.x, -vp.y, width, height);
      let i = points.length;
      while (i--) {
        const p = points[i];
        p.s = fl / (fl + p.z);
        p.sx = p.x * p.s;
        p.sy = p.y * p.s;
        p.alpha = (bounds.z.max - p.z) / (bounds.z.max / 2);
        ctx.beginPath();
        ctx.moveTo(p.sx, p.sy);
        ctx.lineTo(p.osx, p.osy);
        ctx.lineWidth = 2;
        ctx.strokeStyle =
          'hsla(' + p.hue + ', 100%, ' + p.lightness + '%, ' + p.alpha + ')';
        ctx.stroke();
      }
      ctx.restore();
    }

    function resize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      canvasOffset = { x: canvas.offsetLeft, y: canvas.offsetTop };
    }

    function mousemove(e: MouseEvent) {
      mouse.x = e.pageX - canvasOffset.x;
      mouse.y = e.pageY - canvasOffset.y;
    }

    function mousedown() {
      mouse.down = true;
    }

    function mouseup() {
      mouse.down = false;
    }

    function loop() {
      animationRef.current = requestAnimationFrame(loop);
      // Throttle updates to reduce CPU usage - only update every other frame
      if (tick % 2 === 0) {
        update();
      }
      render();
      tick++;
    }

    // Initialize
    resize();
    create();
    loop();

    // Event listeners
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', mousemove);
    canvas.addEventListener('mousedown', mousedown);
    canvas.addEventListener('mouseup', mouseup);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', mousemove);
      canvas.removeEventListener('mousedown', mousedown);
      canvas.removeEventListener('mouseup', mouseup);
    };
  }, [mounted]);

  // Handle text fade in/out sequence - sequential display
  useEffect(() => {
    if (!mounted) return;

    // WELCOME: fades in at 0.5s, stays until 2.5s, fades out by 3s
    setTimeout(() => setWelcomeOpacity(1), 500);
    setTimeout(() => setWelcomeOpacity(0), 3000);

    // TO: fades in at 3s, stays until 4.5s, fades out by 5s
    setTimeout(() => setToOpacity(1), 3000);
    setTimeout(() => setToOpacity(0), 5000);

    // DAKSHH: fades in at 5s, stays until 6.5s, fades out by 7s
    setTimeout(() => setDakshhOpacity(1), 5000);
    setTimeout(() => setDakshhOpacity(0), 7000);

    setTimeout(() => setImgOpacity(1), 7000);
    setTimeout(() => setImgOpacity(0), 9000);
  }, [mounted]);

  // Handle loader fade out after 7.5 seconds (longer duration)
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(0);
      setTimeout(() => {
        setVisible(false);
        // Ensure overflow is restored and mark loader as complete
        document.body.style.overflow = '';
        document.body.classList.remove('loader-ready');
        document.body.classList.add('loader-complete');
      }, 500); // Wait for fade transition
    }, 9500); // Increased to 7.5 seconds

    return () => clearTimeout(timer);
  }, []);

  // Hide body overflow and show loader immediately on mount
  useEffect(() => {
    if (mounted) {
      document.body.style.overflow = 'hidden';
      // Remove complete class if it exists (for page reloads)
      document.body.classList.remove('loader-complete');
      // Add class to show content once loader is ready (after a tiny delay to ensure loader renders first)
      requestAnimationFrame(() => {
        document.body.classList.add('loader-ready');
      });
    }
    return () => {
      // Don't remove loader-ready on cleanup if loader is complete
      if (!document.body.classList.contains('loader-complete')) {
        document.body.style.overflow = '';
        document.body.classList.remove('loader-ready');
      }
    };
  }, [mounted]);

  // Additional effect to ensure overflow is restored when visible becomes false
  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = '';
      document.body.classList.remove('loader-ready');
      document.body.classList.add('loader-complete');
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-9999 bg-black transition-opacity duration-500"
      style={{ opacity }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 m-auto"
        style={{
          display: 'block',
        }}
      />
      {/* Welcome text overlay - all words in same position, perfectly centered */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* WELCOME */}
          <div
            className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold uppercase tracking-wider transition-opacity duration-500 absolute"
            style={{
              opacity: welcomeOpacity,
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              filter: 'url(#wobbly-text)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            STUDENTS OF
          </div>
          {/* TO */}
          <div
            className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold uppercase tracking-wider transition-opacity duration-500 absolute"
            style={{
              opacity: toOpacity,
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              filter: 'url(#wobbly-text)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            HITK
          </div>
          {/* DAKSHH */}
          <div
            className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold uppercase tracking-wider transition-opacity duration-500 absolute"
            style={{
              opacity: dakshhOpacity,
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              filter: 'url(#wobbly-text)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            PRESENTS
          </div>
          <div
            className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold uppercase tracking-wider transition-opacity duration-500 absolute"
            style={{
              opacity: imgOpacity,
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              filter: 'url(#wobbly-text)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Image
              src="/SHHH.png"
              alt="SHHH"
              width={700}
              height={700}
            />
          </div>
          <div
            className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold uppercase tracking-wider transition-opacity duration-500 absolute"
            style={{
              opacity: dakshhOpacity,
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              filter: 'url(#wobbly-text)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
