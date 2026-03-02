import React from "react";
import Navbar from "./Navbar";
import { DotOrbit } from "@paper-design/shaders-react";
import Image from "next/image";

export default function SabotageLoader() {
  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center relative">
      <Navbar />
      <div className="fixed inset-0 w-full h-full z-0">
        <DotOrbit
          width="100%" height="100%" colors={["#ffffff", "#FF4655", "#555555"]}
          colorBack="#000000" stepsPerColor={4} size={0.2} sizeRange={0.5} spreading={1} speed={0.5} scale={0.35}
        />
      </div>
      <div className="z-10 flex flex-col items-center gap-6">
        <Image
          src="/AmongUsVent.gif" 
          alt="Sabotage..."
          className="object-contain drop-shadow-[0_0_30px_rgba(255,70,85,0.6)]"
          height={200}
          width={200}
          unoptimized
        />
        <h1 className="hand-drawn-title text-[#FF4655] animate-pulse text-3xl! md:text-4xl!">
          Sabotage in progress...
        </h1>
      </div>
    </div>
  );
}