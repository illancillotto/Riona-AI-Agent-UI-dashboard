'use client';

import { useState, useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import SettingsForm from '../../components/SettingsForm';
import LoginForm from '../../components/LoginForm';
import { Riona } from '../../lib/rionaApi';

export default function SettingsPage() {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await Riona.me();
      setAuthenticated(true);
    } catch (error) {
      if (error.message.includes('Not authenticated') || error.message.includes('401')) {
        setAuthenticated(false);
      }
    }
  };

  // Show login form if not authenticated
  if (authenticated === false) {
    return <LoginForm onLoginSuccess={() => {
      setAuthenticated(null);
      checkAuth();
    }} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your Riona AI Agent dashboard and backend connections
        </p>
      </div>

      {/* Settings Form */}
      <SettingsForm />

      {/* Security Notice */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <SettingsIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
              Security Notice
            </h4>
            <ul className="text-amber-700 dark:text-amber-300 space-y-1">
              <li>• Credentials are securely transmitted to the backend server</li>
              <li>• Passwords are never stored in browser localStorage</li>
              <li>• API keys are masked in the interface for security</li>
              <li>• All sensitive data is encrypted in transit</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}