"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";

interface ShareableCardProps {
  children: React.ReactNode;
  filename: string;
  className?: string;
}

export default function ShareableCard({ children, filename, className = "" }: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!cardRef.current) return;
    setExporting(true);

    try {
      // Small delay to ensure any CSS transitions finish
      await new Promise(r => setTimeout(r, 100));

      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 3, // High-res for social sharing
        style: {
          transform: "scale(1)", // reset any scale transforms during capture
          boxShadow: "none", // remove external shadows
        }
      });
      
      download(dataUrl, `${filename}-${new Date().toISOString().split('T')[0]}.png`);
    } catch (err) {
      console.error("Failed to export image", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {/* The actual exportable card wrapper */}
      <div 
        ref={cardRef} 
        className="bg-background overflow-hidden relative"
      >
        {children}
      </div>

      {/* Export button overlay */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-50">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-black transition-colors disabled:opacity-50"
        >
          {exporting ? (
            <span className="material-symbols-outlined text-sm animate-spin">sync</span>
          ) : (
            <span className="material-symbols-outlined text-sm">ios_share</span>
          )}
          {exporting ? "Rendering..." : "Export"}
        </button>
      </div>
    </div>
  );
}
