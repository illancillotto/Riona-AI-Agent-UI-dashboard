'use client';

import { useState, useEffect } from 'react';
import { 
  Bot, 
  Instagram, 
  Activity, 
  Clock,
  TrendingUp,
  Users,
  MessageSquare,
  Heart
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import LoginForm from '../../components/LoginForm';
import { Riona, isOnline } from '../../lib/rionaApi';

export default function Dashboard() {
  const [stats, setStats] = useState({
    character: { name: 'Loading...', status: 'unknown' },
    instagram: { status: 'unknown', session: false },
    actions: { today: 0, total: 0 },
    queue: { pending: 0 }
  });
  
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(false);
  const [authenticated, setAuthenticated] = useState(null); // null = checking, true = authenticated, false = not authenticated

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Check if backend is online
      const backendOnline = await isOnline();
      setOnline(backendOnline);

      if (backendOnline) {
        // Load character info
        try {
          const characters = await Riona.listCharacters();
          const activeChar = characters.find(c => c.active) || characters[0];
          setStats(prev => ({
            ...prev,
            character: { 
              name: activeChar?.name || 'No Character', 
              status: 'active' 
            }
          }));
        } catch (error) {
          console.warn('Failed to load characters:', error);
        }

        // Check Instagram session
        try {
          const userData = await Riona.me();
          setAuthenticated(true);
          setStats(prev => ({
            ...prev,
            instagram: { 
              status: userData ? 'logged_in' : 'logged_out', 
              session: !!userData 
            }
          }));
        } catch (error) {
          if (error.message.includes('Not authenticated') || error.message.includes('401')) {
            setAuthenticated(false);
          }
          setStats(prev => ({
            ...prev,
            instagram: { status: 'logged_out', session: false }
          }));
        }

        // Mock data for actions (would come from backend analytics)
        setStats(prev => ({
          ...prev,
          actions: { today: 12, total: 248 },
          queue: { pending: 3 }
        }));
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock chart data
  const chartData = [
    { day: 'Mon', actions: 5 },
    { day: 'Tue', actions: 8 },
    { day: 'Wed', actions: 12 },
    { day: 'Thu', actions: 7 },
    { day: 'Fri', actions: 15 },
    { day: 'Sat', actions: 9 },
    { day: 'Sun', actions: 6 }
  ];

  const maxActions = Math.max(...chartData.map(d => d.actions));

  // Show login form if not authenticated
  if (authenticated === false) {
    return <LoginForm onLoginSuccess={() => {
      setAuthenticated(null);
      loadDashboardData();
    }} />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
            <Bot className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome to Riona Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              {online ? 'Backend is online and ready' : 'Backend is offline - some features may be unavailable'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Character"
          value={stats.character.name}
          description={stats.character.status === 'active' ? 'Ready for actions' : 'Not configured'}
          icon={Bot}
          trend={stats.character.status === 'active' ? { direction: 'up', value: 'Active', label: '' } : null}
        />
        
        <StatCard
          title="Instagram Session"
          value={stats.instagram.session ? 'Logged In' : 'Logged Out'}
          description={stats.instagram.session ? 'Session active' : 'Login required'}
          icon={Instagram}
          trend={stats.instagram.session ? { direction: 'up', value: 'Connected', label: '' } : { direction: 'down', value: 'Disconnected', label: '' }}
        />
        
        <StatCard
          title="Actions Today"
          value={loading ? '...' : stats.actions.today.toString()}
          description={`${stats.actions.total} total actions`}
          icon={Activity}
          trend={{ direction: 'up', value: '+3', label: 'from yesterday' }}
        />
        
        <StatCard
          title="Queue"
          value={loading ? '...' : stats.queue.pending.toString()}
          description="Pending actions"
          icon={Clock}
          trend={stats.queue.pending > 0 ? { direction: 'neutral', value: 'Active', label: '' } : { direction: 'neutral', value: 'Idle', label: '' }}
        />
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Weekly Activity</h3>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-3">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground w-12">{item.day}</span>
                <div className="flex-1 mx-3">
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${(item.actions / maxActions) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-foreground w-8 text-right">{item.actions}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Quick Actions</h3>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-3">
            <button 
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-accent text-left transition-colors"
              onClick={() => window.location.href = '/actions'}
            >
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-medium text-foreground">Like Posts</p>
                <p className="text-xs text-muted-foreground">Engage with hashtag posts</p>
              </div>
            </button>
            
            <button 
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-accent text-left transition-colors"
              onClick={() => window.location.href = '/actions'}
            >
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium text-foreground">Auto Comment</p>
                <p className="text-xs text-muted-foreground">Leave AI-generated comments</p>
              </div>
            </button>
            
            <button 
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-accent text-left transition-colors"
              onClick={() => window.location.href = '/characters'}
            >
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium text-foreground">Manage Characters</p>
                <p className="text-xs text-muted-foreground">Create or switch AI personalities</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}