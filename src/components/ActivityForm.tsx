import { useState, useEffect } from 'react';
import { Activity, CATEGORIES, MAX_MINUTES_PER_DAY } from '@/types/activity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Save } from 'lucide-react';

interface ActivityFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editActivity?: Activity | null;
  remainingMinutes: number;
  onSubmit: (activity: Omit<Activity, 'id' | 'createdAt'>) => { success: boolean; error?: string };
  onUpdate: (id: string, updates: Partial<Omit<Activity, 'id' | 'createdAt'>>) => { success: boolean; error?: string };
}

export const ActivityForm = ({
  open,
  onOpenChange,
  editActivity,
  remainingMinutes,
  onSubmit,
  onUpdate,
}: ActivityFormProps) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('work');
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('30');
  const { toast } = useToast();

  const isEditing = !!editActivity;
  const maxMinutes = isEditing 
    ? remainingMinutes + (editActivity?.minutes || 0)
    : remainingMinutes;

  useEffect(() => {
    if (editActivity) {
      setName(editActivity.name);
      setCategory(editActivity.category);
      setHours(Math.floor(editActivity.minutes / 60).toString());
      setMinutes((editActivity.minutes % 60).toString());
    } else {
      setName('');
      setCategory('work');
      setHours('0');
      setMinutes('30');
    }
  }, [editActivity, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    
    if (!name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter an activity name',
        variant: 'destructive',
      });
      return;
    }

    if (totalMinutes <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Duration must be greater than 0',
        variant: 'destructive',
      });
      return;
    }

    if (totalMinutes > maxMinutes) {
      toast({
        title: 'Time Limit Exceeded',
        description: `Maximum ${Math.floor(maxMinutes / 60)}h ${maxMinutes % 60}m available`,
        variant: 'destructive',
      });
      return;
    }

    const activityData = {
      name: name.trim(),
      category,
      minutes: totalMinutes,
    };

    const result = isEditing
      ? onUpdate(editActivity.id, activityData)
      : onSubmit(activityData);

    if (result.success) {
      toast({
        title: isEditing ? 'Activity Updated' : 'Activity Added',
        description: `${name} - ${hours}h ${minutes}m`,
      });
      onOpenChange(false);
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Save className="h-5 w-5 text-primary" />
                Edit Activity
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-primary" />
                Add Activity
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Activity Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What did you work on?"
              className="h-11"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Duration</Label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="24"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="h-11 pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    h
                  </span>
                </div>
              </div>
              <span className="text-muted-foreground">:</span>
              <div className="flex-1">
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    className="h-11 pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    m
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Max available: {Math.floor(maxMinutes / 60)}h {maxMinutes % 60}m
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="gradient" className="flex-1">
              {isEditing ? 'Save Changes' : 'Add Activity'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
