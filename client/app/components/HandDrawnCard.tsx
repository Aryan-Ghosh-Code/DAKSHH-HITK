import React from 'react';

interface HandDrawnCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function HandDrawnCard({ children, className = '', style }: HandDrawnCardProps) {
  return (
    <div className={`hand-drawn-card ${className}`} style={style}>
      {children}
    </div>
  );
}
