'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Play, 
  FileText, 
  Settings,
  ChevronLeft,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Characters', href: '/characters', icon: Users },
  { name: 'Actions', href: '/actions', icon: Play },
  { name: 'Logs', href: '/logs', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar({ collapsed, mobileOpen, onCollapse, onMobileClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "bg-card border-r border-border flex flex-col",
        "md:relative md:translate-x-0",
        // Mobile styles
        "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:block",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        // Desktop collapsed state
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">R</span>
              </div>
              <span className="font-semibold text-foreground">Riona Dashboard</span>
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            {/* Collapse button (desktop) */}
            <button
              onClick={onCollapse}
              className="hidden md:block p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            </button>
            
            {/* Close button (mobile) */}
            <button
              onClick={onMobileClose}
              className="md:hidden p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground",
                      collapsed ? "justify-center" : "justify-start"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground">
              <p>Riona AI Agent</p>
              <p>Dashboard v1.0.0</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}