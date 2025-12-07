import { Clock, BarChart3, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  showAnalytics: boolean;
  onToggleAnalytics: () => void;
}

export const Header = ({ showAnalytics, onToggleAnalytics }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 glass-effect">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Clock className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">TimeFlow</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Track your time beautifully</p>
          </div>
        </div>

        <Button
          variant={showAnalytics ? 'outline' : 'gradient'}
          size="sm"
          onClick={onToggleAnalytics}
          className="gap-2"
        >
          {showAnalytics ? (
            <>
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Tracker</span>
              <span className="sm:hidden">Back</span>
            </>
          ) : (
            <>
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">View Analytics</span>
              <span className="sm:hidden">Analytics</span>
            </>
          )}
        </Button>
      </div>
    </header>
  );
};
