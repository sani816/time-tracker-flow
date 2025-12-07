import { useMemo } from 'react';
import { DayData, CATEGORIES, getCategoryColor, getCategoryLabel } from '@/types/activity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/EmptyState';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Clock, TrendingUp, Calendar, Target } from 'lucide-react';
import { format, parseISO, subDays } from 'date-fns';

interface AnalyticsDashboardProps {
  daysData: DayData[];
}

export const AnalyticsDashboard = ({ daysData }: AnalyticsDashboardProps) => {
  const analytics = useMemo(() => {
    if (daysData.length === 0) return null;

    // Category distribution
    const categoryMinutes: Record<string, number> = {};
    let totalMinutes = 0;

    daysData.forEach((day) => {
      day.activities.forEach((activity) => {
        categoryMinutes[activity.category] = (categoryMinutes[activity.category] || 0) + activity.minutes;
        totalMinutes += activity.minutes;
      });
    });

    const categoryData = Object.entries(categoryMinutes)
      .map(([category, minutes]) => ({
        name: getCategoryLabel(category),
        value: minutes,
        color: getCategoryColor(category),
        hours: Math.round((minutes / 60) * 10) / 10,
      }))
      .sort((a, b) => b.value - a.value);

    // Daily trend (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayData = daysData.find((d) => d.date === dateStr);
      return {
        date: format(date, 'EEE'),
        fullDate: format(date, 'MMM d'),
        hours: dayData ? Math.round((dayData.totalMinutes / 60) * 10) / 10 : 0,
      };
    });

    // Stats
    const avgMinutesPerDay = totalMinutes / daysData.length;
    const mostProductiveDay = [...daysData].sort((a, b) => b.totalMinutes - a.totalMinutes)[0];
    const totalActivities = daysData.reduce((sum, d) => sum + d.activities.length, 0);

    return {
      categoryData,
      last7Days,
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
      avgHoursPerDay: Math.round((avgMinutesPerDay / 60) * 10) / 10,
      mostProductiveDay,
      totalActivities,
      totalDays: daysData.length,
    };
  }, [daysData]);

  if (!analytics) {
    return <EmptyState type="analytics" />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Clock}
          label="Total Hours"
          value={`${analytics.totalHours}h`}
          color="primary"
        />
        <StatCard
          icon={TrendingUp}
          label="Daily Average"
          value={`${analytics.avgHoursPerDay}h`}
          color="secondary"
        />
        <StatCard
          icon={Calendar}
          label="Days Tracked"
          value={analytics.totalDays.toString()}
          color="accent"
        />
        <StatCard
          icon={Target}
          label="Activities"
          value={analytics.totalActivities.toString()}
          color="success"
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Time by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {analytics.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${Math.round(value / 60 * 10) / 10}h`, 'Time']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend
                    formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.last7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickFormatter={(value) => `${value}h`}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}h`, 'Hours']}
                    labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate || label}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar
                    dataKey="hours"
                    fill="url(#barGradient)"
                    radius={[6, 6, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--secondary))" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Productive Day */}
      {analytics.mostProductiveDay && (
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Most Productive Day</p>
                <p className="text-2xl font-bold text-foreground">
                  {format(parseISO(analytics.mostProductiveDay.date), 'EEEE, MMMM d')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gradient">
                  {Math.round(analytics.mostProductiveDay.totalMinutes / 60 * 10) / 10}h
                </p>
                <p className="text-sm text-muted-foreground">
                  {analytics.mostProductiveDay.activities.length} activities
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  color: 'primary' | 'secondary' | 'accent' | 'success';
}) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
  };

  return (
    <Card className="shadow-card hover:shadow-lg transition-shadow duration-300">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
