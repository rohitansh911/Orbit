interface ProgressDotsProps {
  total: number;
  current: number; // 0-indexed
}

export default function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="flex items-center gap-2" role="progressbar" aria-valuenow={current + 1} aria-valuemax={total}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`ob-dot h-1.5 ${
            i === current ? "active" : i < current ? "done" : ""
          }`}
        />
      ))}
    </div>
  );
}
