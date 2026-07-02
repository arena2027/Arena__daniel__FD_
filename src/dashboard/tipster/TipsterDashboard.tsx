// ── Tipster Dashboard ─────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  TrendingUp,
  Users,
  Wallet,
  BarChart3,
  UserPlus,
  UserCircle,
  Plus,
} from 'lucide-react';
import { useAuth } from '../../auth/hooks/AuthContext';
import {
  DashboardCard,
  StatCard,
  ActivityFeed,
  QuickActionButton,
} from '../shared/DashboardComponents';

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
  const navigate = useNavigate();
  const [stats, setStats] = useState<TipsterStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setStats({
          totalPredictions: 156,
          winRate: 68.5,
          followers: 2340,
          revenue: 1250.0,
          streak: 12,
        });

        setActivities([
          {
            id: '1',
            type: 'prediction',
            message: 'New VIP prediction posted: Man City vs Arsenal — Over 2.5 goals',
            timestamp: '2 hours ago',
          },
          {
            id: '2',
            type: 'follower',
            message: '12 new followers joined your channel this week',
            timestamp: '4 hours ago',
          },
          {
            id: '3',
            type: 'revenue',
            message: '₦125,000 earned from VIP subscriptions this month',
            timestamp: '1 day ago',
          },
          {
            id: '4',
            type: 'subscriber',
            message: '3 subscribers renewed their VIP plan',
            timestamp: '2 days ago',
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
    return (
      <div className="flex flex-col items-center justify-center min-h-[16rem] gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-[#ef4444] border-t-transparent animate-spin" />
        <p className="text-sm text-[#71767b] font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-16 px-6">
        <p className="text-[#71767b]">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6 pb-mobile-nav md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-[#ef4444] uppercase tracking-wider mb-1">Tipster Dashboard</p>
          <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
            Welcome back, {user?.name?.split(' ')[0] ?? 'Tipster'}!
          </h1>
        </div>
        <p className="text-xs text-[#71767b] shrink-0">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
        <StatCard
          label="Total Predictions"
          value={stats.totalPredictions}
          change="+12 this week"
          changeType="positive"
          icon={<Target className="w-4 h-4" />}
        />
        <StatCard
          label="Win Rate"
          value={`${stats.winRate}%`}
          change="+2.1%"
          changeType="positive"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard
          label="Followers"
          value={stats.followers.toLocaleString()}
          change="+45 this week"
          changeType="positive"
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          label="Revenue"
          prefix="₦"
          value={stats.revenue.toLocaleString('en-NG')}
          change="+₦125 this month"
          changeType="positive"
          icon={<Wallet className="w-4 h-4" />}
        />
      </div>

      {/* Streak banner */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#ef4444]/10 to-transparent border border-[#ef4444]/20">
        <div className="w-10 h-10 rounded-xl bg-[#ef4444]/20 flex items-center justify-center shrink-0">
          <span className="text-lg">🔥</span>
        </div>
        <div>
          <p className="text-sm font-bold text-white">{stats.streak}-day winning streak</p>
          <p className="text-xs text-[#71767b]">Keep it going — your followers are watching</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-stretch">
        <DashboardCard title="Recent Activity">
          <ActivityFeed activities={activities} />
        </DashboardCard>

        <DashboardCard title="Quick Actions">
          <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
            <QuickActionButton
              label="Create New Prediction"
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/predictions')}
            />
            <QuickActionButton
              label="View Analytics"
              variant="success"
              icon={<BarChart3 className="w-4 h-4" />}
              onClick={() => navigate('/dashboard')}
            />
            <QuickActionButton
              label="View Channel Members"
              variant="accent"
              icon={<UserPlus className="w-4 h-4" />}
              onClick={() => navigate('/settings/account/channels/2/members')}
            />
            <QuickActionButton
              label="Update Profile"
              variant="muted"
              icon={<UserCircle className="w-4 h-4" />}
              onClick={() => navigate('/profile')}
            />
          </div>
        </DashboardCard>
      </div>

      {/* Performance Chart Placeholder */}
      <DashboardCard
        title="Performance Overview"
        action={
          <span className="text-[10px] font-bold text-[#71767b] uppercase tracking-wider">Last 30 days</span>
        }
      >
        <div className="h-48 sm:h-56 rounded-xl bg-[#0d0d0d] border border-[#1f1f1f] flex flex-col items-center justify-center gap-2 px-4">
          <BarChart3 className="w-8 h-8 text-[#71767b]/50" />
          <p className="text-sm text-[#71767b] text-center">Performance chart coming soon</p>
          <p className="text-xs text-[#71767b]/70 text-center">Win rate, revenue, and subscriber trends will appear here</p>
        </div>
      </DashboardCard>
    </div>
  );
};

export default TipsterDashboard;
