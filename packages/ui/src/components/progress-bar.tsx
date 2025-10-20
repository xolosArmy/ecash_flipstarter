import { cn } from '../utils';

export interface ProgressBarProps {
  progress: number; // 0-1
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const pct = Math.min(Math.max(progress, 0), 1) * 100;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className={cn('h-full rounded-full bg-brand-light transition-all duration-500 ease-out')}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
