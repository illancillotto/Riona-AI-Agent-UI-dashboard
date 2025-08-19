'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  Sun, 
  Moon, 
  Search,
  Wifi,
  WifiOff,
  User
} from 'lucide-react';
import { Riona, isOnline } from '../lib/rionaApi';
import { cn } from '../lib/utils';

const pageNames = {
  '/dashboard': 'Dashboard',
  '/characters': 'Characters',
  '/actions': 'Actions',
  '/logs': 'Logs',
  '/settings': 'Settings',
};

export default function Topbar({ darkMode, onToggleDarkMode, onToggleSidebar }) {
  const pathname = usePathname();
  const [online, setOnline] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState('No Character');
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadCurrentCharacter();
  }, []);

  const checkStatus = async () => {
    const status = await isOnline();
    setOnline(status);
    
    // Check if user is logged in
    try {
      const userData = await Riona.me();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

  const loadCurrentCharacter = async () => {
    try {
      const characters = await Riona.listCharacters();
      const active = characters.find(c => c.active);
      if (active) {
        setCurrentCharacter(active.name);
      }
    } catch (error) {
      console.error('Failed to load current character:', error);
    }
  };

  const pageName = pageNames[pathname] || 'Riona Dashboard';

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div>
          <h1 className="text-xl font-semibold text-foreground">{pageName}</h1>
          <p className="text-sm text-muted-foreground">AI Agent Dashboard</p>
        </div>
      </div>

      {/* Center - Search */}
      <div className="hidden md:flex flex-1 max-w-lg mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            disabled
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-3">
        {/* Status indicators */}
        <div className="flex items-center space-x-2">
          <div className={cn(
            "flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm",
            online ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
          )}>
            {online ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            <span className="hidden sm:inline">{online ? 'Online' : 'Offline'}</span>
          </div>
        </div>

        {/* Current character */}
        <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-accent rounded-lg text-sm">
          <User className="h-4 w-4" />
          <span>{currentCharacter}</span>
        </div>

        {/* User info */}
        {user && (
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-accent rounded-lg text-sm">
            <span>@{user.username}</span>
          </div>
        )}

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}