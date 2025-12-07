import { Clock, BarChart3, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  type: 'activities' | 'analytics';
  onAction?: () => void;
}

export const EmptyState = ({ type, onAction }: EmptyStateProps) => {
  const isActivities = type === 'activities';

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="relative mb-6">
        <div className="absolute inset-0 gradient-primary rounded-full blur-2xl opacity-20 animate-pulse-slow" />
        <div className="relative h-24 w-24 rounded-full gradient-primary flex items-center justify-center shadow-glow">
          {isActivities ? (
            <Clock className="h-12 w-12 text-primary-foreground" />
          ) : (
            <BarChart3 className="h-12 w-12 text-primary-foreground" />
          )}
        </div>
      </div>

      <h3 className="text-2xl font-bold text-foreground mb-2">
        {isActivities ? 'No Activities Yet' : 'No Analytics Data'}
      </h3>
      
      <p className="text-muted-foreground max-w-sm mb-8">
        {isActivities
          ? "Start tracking your time by adding your first activity. Every minute counts!"
          : "Track some activities first to see beautiful insights about how you spend your time."}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
        {isActivities ? (
          <>
            <Feature icon={Clock} label="Track Time" />
            <Feature icon={Calendar} label="Daily View" />
            <Feature icon={BarChart3} label="Analytics" />
          </>
        ) : (
          <>
            <Feature icon={Sparkles} label="Insights" />
            <Feature icon={Calendar} label="Trends" />
            <Feature icon={Clock} label="Patterns" />
          </>
        )}
      </div>

      {isActivities && onAction && (
        <Button variant="gradient" size="lg" onClick={onAction} className="gap-2">
          <Clock className="h-5 w-5" />
          Add Your First Activity
        </Button>
      )}
    </div>
  );
};

const Feature = ({ icon: Icon, label }: { icon: typeof Clock; label: string }) => (
  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <span>{label}</span>
  </div>
);
