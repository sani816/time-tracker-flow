import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { DatePicker } from '@/components/DatePicker';
import { TimeProgress } from '@/components/TimeProgress';
import { ActivityCard } from '@/components/ActivityCard';
import { ActivityForm } from '@/components/ActivityForm';
import { EmptyState } from '@/components/EmptyState';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { useActivities } from '@/hooks/useActivities';
import { Activity } from '@/types/activity';
import { format } from 'date-fns';

const Index = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const {
    selectedDate,
    setSelectedDate,
    activities,
    totalMinutes,
    remainingMinutes,
    addActivity,
    updateActivity,
    deleteActivity,
    getAllDaysData,
    hasData,
  } = useActivities();

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormOpen(true);
  };

  const handleCloseForm = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingActivity(null);
  };

  const handleAddClick = () => {
    setEditingActivity(null);
    setFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        showAnalytics={showAnalytics}
        onToggleAnalytics={() => setShowAnalytics(!showAnalytics)}
      />

      <main className="container px-4 py-6 md:px-6 md:py-8">
        {showAnalytics ? (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
              <p className="text-muted-foreground">Insights into how you spend your time</p>
            </div>
            <AnalyticsDashboard daysData={getAllDaysData()} />
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Date & Progress Section */}
            <div className="mb-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {format(selectedDate, 'EEEE')}
                  </h2>
                  <p className="text-muted-foreground">
                    {format(selectedDate, 'MMMM d, yyyy')}
                  </p>
                </div>
                <DatePicker date={selectedDate} onDateChange={setSelectedDate} />
              </div>

              <Card className="p-5 shadow-card">
                <TimeProgress totalMinutes={totalMinutes} />
              </Card>
            </div>

            {/* Activities Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Activities</h3>
                  <p className="text-sm text-muted-foreground">
                    {activities.length} {activities.length === 1 ? 'activity' : 'activities'} logged
                  </p>
                </div>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={handleAddClick}
                  className="gap-2"
                  disabled={remainingMinutes <= 0}
                >
                  <Plus className="h-4 w-4" />
                  Add Activity
                </Button>
              </div>

              {activities.length === 0 ? (
                <EmptyState type="activities" onAction={handleAddClick} />
              ) : (
                <div className="grid gap-3">
                  {activities.map((activity, index) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      onEdit={handleEdit}
                      onDelete={deleteActivity}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <ActivityForm
        open={formOpen}
        onOpenChange={handleCloseForm}
        editActivity={editingActivity}
        remainingMinutes={remainingMinutes}
        onSubmit={addActivity}
        onUpdate={updateActivity}
      />
    </div>
  );
};

export default Index;
