import { Activity, getCategoryColor, getCategoryLabel } from '@/types/activity';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit2, Trash2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityCardProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  index: number;
}

export const ActivityCard = ({ activity, onEdit, onDelete, index }: ActivityCardProps) => {
  const categoryColor = getCategoryColor(activity.category);
  const hours = Math.floor(activity.minutes / 60);
  const minutes = activity.minutes % 60;
  const timeDisplay = hours > 0 
    ? `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`
    : `${minutes}m`;

  return (
    <Card
      className={cn(
        'group relative overflow-hidden p-4 transition-all duration-300 hover:shadow-card hover:-translate-y-1',
        'animate-slide-up border-l-4'
      )}
      style={{ 
        animationDelay: `${index * 50}ms`,
        borderLeftColor: categoryColor,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{activity.name}</h3>
          <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ 
                backgroundColor: `${categoryColor}20`,
                color: categoryColor,
              }}
            >
              {getCategoryLabel(activity.category)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {timeDisplay}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={() => onEdit(activity)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(activity.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
