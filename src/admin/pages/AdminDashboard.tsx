// ── Admin Dashboard ───────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { DashboardCard, StatCard } from '../../dashboard/shared/DashboardComponents';

interface AdminStats {
  totalUsers: number;
  totalTipsters: number;
  totalPredictions: number;
  reportedContent: number;
  pendingVerifications: number;
  systemHealth: 'good' | 'warning' | 'critical';
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Mock data - replace with actual API calls
        setStats({
          totalUsers: 15420,
          totalTipsters: 342,
          totalPredictions: 12847,
          reportedContent: 23,
          pendingVerifications: 15,
          systemHealth: 'good',
        });
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading admin dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-center text-gray-500">Failed to load admin data</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            stats.systemHealth === 'good' ? 'bg-green-500' :
            stats.systemHealth === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm text-gray-600 capitalize">
            System: {stats.systemHealth}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change="+5.2%"
          changeType="positive"
        />
        <StatCard
          label="Active Tipsters"
          value={stats.totalTipsters.toLocaleString()}
          change="+12 this month"
          changeType="positive"
        />
        <StatCard
          label="Total Predictions"
          value={stats.totalPredictions.toLocaleString()}
          change="+8.1%"
          changeType="positive"
        />
        <StatCard
          label="Pending Verifications"
          value={stats.pendingVerifications}
          change={stats.pendingVerifications > 10 ? 'High priority' : 'Normal'}
          changeType={stats.pendingVerifications > 10 ? 'negative' : 'neutral'}
        />
      </div>

      {/* Admin Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management */}
        <DashboardCard title="User Management">
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Manage Users ({stats.totalUsers.toLocaleString()})
            </button>
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              Verify Tipsters ({stats.pendingVerifications} pending)
            </button>
            <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
              View Reports ({stats.reportedContent})
            </button>
          </div>
        </DashboardCard>

        {/* System Management */}
        <DashboardCard title="System Management">
          <div className="space-y-3">
            <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              System Settings
            </button>
            <button className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors">
              View Logs
            </button>
            <button className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
              Emergency Controls
            </button>
          </div>
        </DashboardCard>
      </div>

      {/* Recent Activity */}
      <DashboardCard title="Recent System Activity">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="text-sm font-medium text-gray-900">New tipster verification request</p>
              <p className="text-xs text-gray-500">John Smith applied for tipster status</p>
            </div>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="text-sm font-medium text-gray-900">User reported content</p>
              <p className="text-xs text-gray-500">Inappropriate prediction in Premier League section</p>
            </div>
            <span className="text-xs text-gray-500">4 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="text-sm font-medium text-gray-900">System backup completed</p>
              <p className="text-xs text-gray-500">Daily backup finished successfully</p>
            </div>
            <span className="text-xs text-gray-500">6 hours ago</span>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default AdminDashboard;