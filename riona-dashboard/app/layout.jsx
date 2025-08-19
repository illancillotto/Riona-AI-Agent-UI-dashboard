'use client';

import './globals.css';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function RootLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedSidebarCollapsed = localStorage.getItem('sidebarCollapsed');
    
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    } else {
      // Auto-detect system preference
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    
    if (savedSidebarCollapsed) {
      setSidebarCollapsed(JSON.parse(savedSidebarCollapsed));
    }
  }, []);

  useEffect(() => {
    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const collapseSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <html lang="en">
      <body>
        <div className={`main-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Sidebar 
            collapsed={sidebarCollapsed}
            mobileOpen={sidebarOpen}
            onCollapse={collapseSidebar}
            onMobileClose={() => setSidebarOpen(false)}
          />
          <div className="content-area">
            <Topbar
              darkMode={darkMode}
              onToggleDarkMode={toggleDarkMode}
              onToggleSidebar={toggleSidebar}
            />
            <main className="page-content">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}