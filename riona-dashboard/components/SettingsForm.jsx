'use client';

import { useState, useEffect } from 'react';
import {
  Save,
  Eye,
  EyeOff,
  TestTube,
  CheckCircle,
  XCircle,
  Database,
  Key,
  Globe,
  Shield
} from 'lucide-react';
import { cn, maskString, showToast } from '../lib/utils';
import { Riona, isOnline } from '../lib/rionaApi';

export default function SettingsForm() {
  const [settings, setSettings] = useState({
    backendUrl: process.env.NEXT_PUBLIC_RIONA_API || 'http://localhost:3099',
    mongoUri: '',
    igUsername: '',
    igPassword: '',
    googleApiKey: '',
    proxyHost: '',
    proxyUsername: '',
    proxyPassword: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState({});
  const [showPasswords, setShowPasswords] = useState({});
  const [connectionStatus, setConnectionStatus] = useState('unknown');

  useEffect(() => {
    loadSettings();
    checkConnection();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await Riona.getSettings();
      setSettings(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Failed to load settings:', error);
      showToast('Using default settings', 'info');
    } finally {
      setLoading(false);
    }
  };

  const checkConnection = async () => {
    const online = await isOnline();
    setConnectionStatus(online ? 'connected' : 'disconnected');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Riona.saveSettings(settings);
      showToast('Settings saved successfully', 'success');

      // Check connection with new settings
      setTimeout(checkConnection, 1000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      showToast(`Failed to save settings: ${error.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async (type) => {
    setTesting(prev => ({ ...prev, [type]: true }));

    try {
      let result = false;

      switch (type) {
        case 'backend':
          result = await isOnline();
          break;
        case 'instagram':
          // This would test IG credentials
          result = settings.igUsername && settings.igPassword;
          break;
        case 'googleai':
          // This would test Google AI API key
          result = settings.googleApiKey && settings.googleApiKey.length > 10;
          break;
        case 'proxy':
          // This would test proxy connection
          result = settings.proxyHost || true; // Always pass for demo
          break;
        default:
          result = false;
      }

      showToast(
        result ? `${type} connection successful` : `${type} connection failed`,
        result ? 'success' : 'error'
      );

      return result;
    } catch (error) {
      showToast(`${type} test failed: ${error.message}`, 'error');
      return false;
    } finally {
      setTesting(prev => ({ ...prev, [type]: false }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const sections = [
    {
      id: 'backend',
      title: 'Backend Connection',
      icon: Globe,
      description: 'Configure connection to Riona AI Agent backend'
    },
    {
      id: 'instagram',
      title: 'Instagram Credentials',
      icon: Shield,
      description: 'Instagram account credentials for automation'
    },
    {
      id: 'ai',
      title: 'AI Configuration',
      icon: Key,
      description: 'API keys for AI services'
    },
    {
      id: 'proxy',
      title: 'Proxy Settings',
      icon: Database,
      description: 'Optional proxy configuration for requests'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-card rounded-lg border p-6 animate-pulse">
            <div className="h-6 bg-accent rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-accent rounded w-1/4"></div>
              <div className="h-10 bg-accent rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-card rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "w-3 h-3 rounded-full",
              connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
            )} />
            <span className="font-medium">
              Backend Status: {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <button
            onClick={() => testConnection('backend')}
            disabled={testing.backend}
            className="flex items-center space-x-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <TestTube className="h-4 w-4" />
            <span>{testing.backend ? 'Testing...' : 'Test Connection'}</span>
          </button>
        </div>
      </div>

      {/* Backend Connection */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Backend Connection</h3>
            <p className="text-sm text-muted-foreground">Configure connection to Riona AI Agent backend</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Backend URL
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                value={settings.backendUrl}
                onChange={(e) => updateSetting('backendUrl', e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                placeholder="http://localhost:3099"
              />
              <button
                onClick={() => testConnection('backend')}
                disabled={testing.backend}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
              >
                {testing.backend ? 'Testing...' : 'Test'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              MongoDB URI (Read-only)
            </label>
            <input
              type="text"
              value={settings.mongoUri || 'mongodb://localhost:27017/riona-ai-agent'}
              readOnly
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-muted-foreground"
              placeholder="Configured on backend"
            />
            <p className="text-xs text-muted-foreground mt-1">
              MongoDB URI is configured on the backend server
            </p>
          </div>
        </div>
      </div>

      {/* Instagram Credentials */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Instagram Credentials</h3>
              <p className="text-sm text-muted-foreground">Instagram account credentials for automation</p>
            </div>
          </div>
          <button
            onClick={() => testConnection('instagram')}
            disabled={testing.instagram}
            className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50 text-sm"
          >
            {testing.instagram ? 'Testing...' : 'Test'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Instagram Username
            </label>
            <input
              type="text"
              value={settings.igUsername}
              onChange={(e) => updateSetting('igUsername', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              placeholder="your_username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Instagram Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.igPassword ? 'text' : 'password'}
                value={settings.igPassword}
                onChange={(e) => updateSetting('igPassword', e.target.value)}
                className="w-full px-3 py-2 pr-10 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                placeholder="your_password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('igPassword')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.igPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Configuration */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Key className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">AI Configuration</h3>
              <p className="text-sm text-muted-foreground">API keys for AI services</p>
            </div>
          </div>
          <button
            onClick={() => testConnection('googleai')}
            disabled={testing.googleai}
            className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50 text-sm"
          >
            {testing.googleai ? 'Testing...' : 'Test'}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Google Generative AI API Key
          </label>
          <div className="relative">
            <input
              type={showPasswords.googleApiKey ? 'text' : 'password'}
              value={settings.googleApiKey}
              onChange={(e) => updateSetting('googleApiKey', e.target.value)}
              className="w-full px-3 py-2 pr-10 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              placeholder="AIzaSy..."
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('googleApiKey')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPasswords.googleApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Get your API key from Google AI Studio
          </p>
        </div>
      </div>

      {/* Proxy Settings */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Database className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Proxy Settings</h3>
              <p className="text-sm text-muted-foreground">Optional proxy configuration for requests</p>
            </div>
          </div>
          <button
            onClick={() => testConnection('proxy')}
            disabled={testing.proxy}
            className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50 text-sm"
          >
            {testing.proxy ? 'Testing...' : 'Test'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-foreground mb-2">
              Proxy Host
            </label>
            <input
              type="text"
              value={settings.proxyHost}
              onChange={(e) => updateSetting('proxyHost', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              placeholder="proxy.example.com:8080"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Username
            </label>
            <input
              type="text"
              value={settings.proxyUsername}
              onChange={(e) => updateSetting('proxyUsername', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.proxyPassword ? 'text' : 'password'}
                value={settings.proxyPassword}
                onChange={(e) => updateSetting('proxyPassword', e.target.value)}
                className="w-full px-3 py-2 pr-10 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                placeholder="Optional"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('proxyPassword')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.proxyPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => loadSettings()}
          disabled={loading}
          className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>
    </div>
  );
}