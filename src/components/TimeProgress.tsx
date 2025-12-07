import { MAX_MINUTES_PER_DAY } from '@/types/activity';
import { cn } from '@/lib/utils';

interface TimeProgressProps {
  totalMinutes: number;
  className?: string;
}

export const TimeProgress = ({ totalMinutes, className }: TimeProgressProps) => {
  const percentage = (totalMinutes / MAX_MINUTES_PER_DAY) * 100;
  const remainingMinutes = MAX_MINUTES_PER_DAY - totalMinutes;
  const hours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;

  const getProgressColor = () => {
    if (percentage >= 90) return 'from-destructive to-destructive/80';
    if (percentage >= 70) return 'from-warning to-warning/80';
    return 'from-primary via-secondary to-accent';
  };

  const getTextColor = () => {
    if (percentage >= 90) return 'text-destructive';
    if (percentage >= 70) return 'text-warning';
    return 'text-primary';
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Time Remaining</span>
        <span className={cn('text-lg font-bold', getTextColor())}>
          {hours}h {minutes}m
        </span>
      </div>
      
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out',
            getProgressColor()
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{Math.round(totalMinutes / 60 * 10) / 10}h tracked</span>
        <span>{Math.round(percentage)}% of day</span>
      </div>
    </div>
  );
};
