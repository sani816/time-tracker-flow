export interface Activity {
  id: string;
  name: string;
  category: string;
  minutes: number;
  createdAt: Date;
}

export interface DayData {
  date: string;
  activities: Activity[];
  totalMinutes: number;
}

export const CATEGORIES = [
  { id: 'work', label: 'Work', color: 'hsl(243, 75%, 59%)' },
  { id: 'exercise', label: 'Exercise', color: 'hsl(142, 76%, 36%)' },
  { id: 'learning', label: 'Learning', color: 'hsl(270, 60%, 60%)' },
  { id: 'personal', label: 'Personal', color: 'hsl(38, 92%, 50%)' },
  { id: 'social', label: 'Social', color: 'hsl(340, 75%, 55%)' },
  { id: 'rest', label: 'Rest', color: 'hsl(200, 80%, 50%)' },
  { id: 'other', label: 'Other', color: 'hsl(0, 0%, 50%)' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];

export const MAX_MINUTES_PER_DAY = 1440;

export const getCategoryColor = (categoryId: string): string => {
  const category = CATEGORIES.find(c => c.id === categoryId);
  return category?.color || 'hsl(0, 0%, 50%)';
};

export const getCategoryLabel = (categoryId: string): string => {
  const category = CATEGORIES.find(c => c.id === categoryId);
  return category?.label || 'Other';
};
