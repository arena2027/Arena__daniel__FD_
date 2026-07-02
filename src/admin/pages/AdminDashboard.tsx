// ── Admin Dashboard ───────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardCard, StatCard, QuickActionButton } from '../../dashboard/shared/DashboardComponents';
import { Percent } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalTipsters: number;
  totalPredictions: number;
  reportedContent: number;
  pendingVerifications: number;
  systemHealth: 'good' | 'warning' | 'critical';
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
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
    return (
      <div className="flex flex-col items-center justify-center min-h-[16rem] gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-[#ef4444] border-t-transparent animate-spin" />
        <p className="text-sm text-[#71767b] font-semibold">Loading admin dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-16 px-6">
        <p className="text-[#71767b]">Failed to load admin data</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-[#ef4444] uppercase tracking-wider mb-1">Admin</p>
          <h1 className="text-xl sm:text-2xl font-black text-white">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${
            stats.systemHealth === 'good' ? 'bg-green-500' :
            stats.systemHealth === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          <span className="text-xs text-[#71767b] capitalize">
            System: {stats.systemHealth}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <DashboardCard title="User Management">
          <div className="grid grid-cols-1 gap-2.5">
            <QuickActionButton label={`Manage Users (${stats.totalUsers.toLocaleString()})`} variant="primary" />
            <QuickActionButton label={`Verify Tipsters (${stats.pendingVerifications} pending)`} variant="success" />
            <QuickActionButton label={`View Reports (${stats.reportedContent})`} variant="accent" />
          </div>
        </DashboardCard>

        <DashboardCard title="Platform & Revenue">
          <div className="grid grid-cols-1 gap-2.5">
            <QuickActionButton
              label="Pricing & Commissions"
              variant="primary"
              icon={<Percent className="w-4 h-4" />}
              onClick={() => navigate('/admin/pricing')}
            />
            <QuickActionButton label="View Logs" variant="muted" />
            <QuickActionButton label="Emergency Controls" variant="muted" />
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="Recent System Activity">
        <div className="space-y-4">
          {[
            { title: 'New tipster verification request', desc: 'John Smith applied for tipster status', time: '2 hours ago' },
            { title: 'User reported content', desc: 'Inappropriate prediction in Premier League section', time: '4 hours ago' },
            { title: 'System backup completed', desc: 'Daily backup finished successfully', time: '6 hours ago' },
          ].map((item) => (
            <div key={item.title} className="flex items-start justify-between gap-3 py-2 border-b border-[#1f1f1f] last:border-0">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-[#71767b] mt-0.5">{item.desc}</p>
              </div>
              <span className="text-xs text-[#71767b] shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};

export default AdminDashboard;
