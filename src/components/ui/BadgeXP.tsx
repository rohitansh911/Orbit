interface BadgeXPProps {
  children: React.ReactNode;
  className?: string;
  solid?: boolean; // solid indigo variant (on active quest)
}

export default function BadgeXP({
  children,
  className = "",
  solid = false,
}: BadgeXPProps) {
  if (solid) {
    return (
      <span
        className={`text-[10px] font-black text-[#f5f5e8] bg-[#1a1a1a] px-4 py-2 rounded-full shadow-sm tracking-wider ${className}`}
      >
        {children}
      </span>
    );
  }
  return (
    <span
      className={`badge-xp px-3.5 py-1.5 rounded-full text-[10px] font-black ${className}`}
    >
      {children}
    </span>
  );
}
