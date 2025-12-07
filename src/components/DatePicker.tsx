import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { addDays, subDays, isToday } from 'date-fns';

interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export const DatePicker = ({ date, onDateChange }: DatePickerProps) => {
  const handlePrevDay = () => onDateChange(subDays(date, 1));
  const handleNextDay = () => onDateChange(addDays(date, 1));
  const handleToday = () => onDateChange(new Date());

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={handlePrevDay}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'min-w-[180px] justify-start text-left font-medium',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && onDateChange(d)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={handleNextDay}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {!isToday(date) && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-primary"
          onClick={handleToday}
        >
          Today
        </Button>
      )}
    </div>
  );
};
