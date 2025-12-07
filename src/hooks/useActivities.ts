import { useState, useEffect, useCallback } from 'react';
import { Activity, DayData, MAX_MINUTES_PER_DAY } from '@/types/activity';
import { format } from 'date-fns';

const STORAGE_KEY = 'timeflow_activities';

interface StoredData {
  [date: string]: Activity[];
}

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useActivities = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activities, setActivities] = useState<Activity[]>([]);
  const [allData, setAllData] = useState<StoredData>({});

  const dateKey = format(selectedDate, 'yyyy-MM-dd');

  // Load all data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAllData(parsed);
      } catch (e) {
        console.error('Failed to parse stored data:', e);
      }
    }
  }, []);

  // Update activities when date changes
  useEffect(() => {
    const dayActivities = allData[dateKey] || [];
    setActivities(dayActivities.map(a => ({
      ...a,
      createdAt: new Date(a.createdAt)
    })));
  }, [dateKey, allData]);

  // Save to localStorage
  const saveData = useCallback((newData: StoredData) => {
    setAllData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }, []);

  const totalMinutes = activities.reduce((sum, a) => sum + a.minutes, 0);
  const remainingMinutes = MAX_MINUTES_PER_DAY - totalMinutes;

  const addActivity = useCallback((activity: Omit<Activity, 'id' | 'createdAt'>): { success: boolean; error?: string } => {
    if (activity.minutes > remainingMinutes) {
      return { success: false, error: `Cannot add ${activity.minutes} minutes. Only ${remainingMinutes} minutes remaining.` };
    }

    const newActivity: Activity = {
      ...activity,
      id: generateId(),
      createdAt: new Date(),
    };

    const newActivities = [...activities, newActivity];
    const newData = {
      ...allData,
      [dateKey]: newActivities,
    };

    saveData(newData);
    setActivities(newActivities);
    return { success: true };
  }, [activities, allData, dateKey, remainingMinutes, saveData]);

  const updateActivity = useCallback((id: string, updates: Partial<Omit<Activity, 'id' | 'createdAt'>>): { success: boolean; error?: string } => {
    const activity = activities.find(a => a.id === id);
    if (!activity) {
      return { success: false, error: 'Activity not found' };
    }

    const newMinutes = updates.minutes ?? activity.minutes;
    const minutesDiff = newMinutes - activity.minutes;

    if (minutesDiff > remainingMinutes) {
      return { success: false, error: `Cannot set ${newMinutes} minutes. Only ${remainingMinutes + activity.minutes} minutes available.` };
    }

    const newActivities = activities.map(a =>
      a.id === id ? { ...a, ...updates } : a
    );

    const newData = {
      ...allData,
      [dateKey]: newActivities,
    };

    saveData(newData);
    setActivities(newActivities);
    return { success: true };
  }, [activities, allData, dateKey, remainingMinutes, saveData]);

  const deleteActivity = useCallback((id: string) => {
    const newActivities = activities.filter(a => a.id !== id);
    const newData = {
      ...allData,
      [dateKey]: newActivities,
    };

    if (newActivities.length === 0) {
      delete newData[dateKey];
    }

    saveData(newData);
    setActivities(newActivities);
  }, [activities, allData, dateKey, saveData]);

  const getAllDaysData = useCallback((): DayData[] => {
    return Object.entries(allData).map(([date, acts]) => ({
      date,
      activities: acts.map(a => ({ ...a, createdAt: new Date(a.createdAt) })),
      totalMinutes: acts.reduce((sum, a) => sum + a.minutes, 0),
    })).sort((a, b) => b.date.localeCompare(a.date));
  }, [allData]);

  return {
    selectedDate,
    setSelectedDate,
    activities,
    totalMinutes,
    remainingMinutes,
    addActivity,
    updateActivity,
    deleteActivity,
    getAllDaysData,
    hasData: Object.keys(allData).length > 0,
  };
};
