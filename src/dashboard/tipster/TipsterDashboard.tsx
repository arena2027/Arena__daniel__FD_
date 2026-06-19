// ── Tipster Dashboard ─────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/hooks/AuthContext';
import { DashboardCard, StatCard, ActivityFeed } from '../shared/DashboardComponents';

interface TipsterStats {
  totalPredictions: number;
  winRate: number;
  followers: number;
  revenue: number;
  streak: number;
}

interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

const TipsterDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<TipsterStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Mock data - replace with actual API calls
        setStats({
          totalPredictions: 156,
          winRate: 68.5,
          followers: 2340,
          revenue: 1250.00,
          streak: 12,
        });

        setActivities([
          {
            id: '1',
            type: 'prediction',
            message: 'Primary sidebar → secondary chat list → main chat pane with fixed header, scrollable feed, and fixed bottom input bar.',
            timestamp: '2 hours ago',
          },
          {
            id: '2',
            type: 'follower',
            message: 'UI layout summary updated to reflect the left-to-right hierarchy, unread badges, and responsive Tailwind structure.',
            timestamp: '4 hours ago',
          },
          {
            id: '3',
            type: 'revenue',
            message: 'Prediction copy now highlights the fixed navigation, message feed, and mobile-first layout behavior.',
            timestamp: '1 day ago',
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-center text-gray-500">Failed to load dashboard data</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Predictions"
          value={stats.totalPredictions}
          change="+12 this week"
          changeType="positive"
        />
        <StatCard
          label="Win Rate"
          value={`${stats.winRate}%`}
          change="+2.1%"
          changeType="positive"
        />
        <StatCard
          label="Followers"
          value={stats.followers.toLocaleString()}
          change="+45 this week"
          changeType="positive"
        />
        <StatCard
          label="Revenue"
          value={`$${stats.revenue.toFixed(2)}`}
          change="+$125 this month"
          changeType="positive"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <DashboardCard title="Recent Activity">
          <ActivityFeed activities={activities} />
        </DashboardCard>

        {/* Quick Actions */}
        <DashboardCard title="Quick Actions">
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Create New Prediction
            </button>
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              View Analytics
            </button>
            <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
              Manage Subscribers
            </button>
            <button className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
              Update Profile
            </button>
          </div>
        </DashboardCard>
      </div>

      {/* Performance Chart Placeholder */}
      <DashboardCard title="Performance Overview">
        <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
          <p className="text-gray-500">Performance chart will be implemented here</p>
        </div>
      </DashboardCard>
    </div>
  );
};

export default TipsterDashboard;
