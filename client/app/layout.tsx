import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DAKSHH Tech Fest 2026",
  description: "A premier tech festival by Heritage Institute of Technology, Kolkata",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} antialiased`}
        style={{ backgroundColor: '#000' }}
      >
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <filter id="wobbly-border" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence baseFrequency="0.03 0.05" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id="wobbly-text" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence baseFrequency="0.02 0.03" numOctaves="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
