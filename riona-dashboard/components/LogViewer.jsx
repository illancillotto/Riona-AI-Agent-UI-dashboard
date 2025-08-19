'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Copy, 
  Trash2, 
  Search,
  Filter,
  Download,
  AlertCircle,
  Info,
  AlertTriangle
} from 'lucide-react';
import { connectSSE, createMockLogStream } from '../lib/sse';
import { formatDate, showToast } from '../lib/utils';
import { cn } from '../lib/utils';

const LOG_LEVELS = {
  info: { color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', icon: Info },
  warn: { color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', icon: AlertTriangle },
  error: { color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', icon: AlertCircle }
};

export default function LogViewer({ streamUrl, useMockData = false }) {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [autoScroll, setAutoScroll] = useState(true);
  
  const logsEndRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredLogs, autoScroll]);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, selectedLevel]);

  const filterLogs = () => {
    let filtered = logs;
    
    // Filter by level
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(log => log.level === selectedLevel);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(term) ||
        log.source?.toLowerCase().includes(term)
      );
    }
    
    setFilteredLogs(filtered);
  };

  const startStreaming = () => {
    if (isStreaming) return;
    
    setIsStreaming(true);
    
    const handleMessage = (logData) => {
      const newLog = {
        id: Date.now() + Math.random(),
        timestamp: logData.timestamp || new Date().toISOString(),
        level: logData.level || 'info',
        message: logData.message || logData,
        source: logData.source || 'riona-agent'
      };
      
      setLogs(prev => [...prev, newLog]);
    };
    
    if (useMockData) {
      cleanupRef.current = createMockLogStream(handleMessage);
    } else {
      cleanupRef.current = connectSSE(streamUrl, handleMessage);
    }
  };

  const stopStreaming = () => {
    if (!isStreaming) return;
    
    setIsStreaming(false);
    
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
  };

  const clearLogs = () => {
    if (confirm('Are you sure you want to clear all logs?')) {
      setLogs([]);
    }
  };

  const copyLogs = () => {
    const logText = filteredLogs
      .map(log => `[${formatDate(log.timestamp)}] ${log.level.toUpperCase()}: ${log.message}`)
      .join('\n');
    
    navigator.clipboard.writeText(logText).then(() => {
      showToast('Logs copied to clipboard', 'success');
    }).catch(() => {
      showToast('Failed to copy logs', 'error');
    });
  };

  const downloadLogs = () => {
    const logText = filteredLogs
      .map(log => `[${formatDate(log.timestamp)}] ${log.level.toUpperCase()}: ${log.message}`)
      .join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `riona-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLevelStats = () => {
    const stats = { info: 0, warn: 0, error: 0 };
    logs.forEach(log => {
      if (stats.hasOwnProperty(log.level)) {
        stats[log.level]++;
      }
    });
    return stats;
  };

  const levelStats = getLevelStats();

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <h3 className="font-semibold text-foreground">Real-time Logs</h3>
          <div className="flex items-center space-x-2">
            {Object.entries(levelStats).map(([level, count]) => (
              <div key={level} className="flex items-center space-x-1 text-xs">
                <div className={cn("w-2 h-2 rounded-full", {
                  'bg-blue-500': level === 'info',
                  'bg-yellow-500': level === 'warn',
                  'bg-red-500': level === 'error'
                })} />
                <span className="text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={isStreaming ? stopStreaming : startStreaming}
            className={cn(
              "flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              isStreaming 
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-green-500 text-white hover:bg-green-600"
            )}
          >
            {isStreaming ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Start</span>
              </>
            )}
          </button>

          <button
            onClick={copyLogs}
            disabled={filteredLogs.length === 0}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            title="Copy logs"
          >
            <Copy className="h-4 w-4" />
          </button>

          <button
            onClick={downloadLogs}
            disabled={filteredLogs.length === 0}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            title="Download logs"
          >
            <Download className="h-4 w-4" />
          </button>

          <button
            onClick={clearLogs}
            disabled={logs.length === 0}
            className="p-2 rounded-lg hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
            title="Clear logs"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 p-4 bg-muted/20 border-b border-border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warn">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>

        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
            className="rounded border-border"
          />
          <span className="text-muted-foreground">Auto-scroll</span>
        </label>
      </div>

      {/* Logs Display */}
      <div className="h-96 overflow-y-auto font-mono text-sm">
        {filteredLogs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Info className="h-8 w-8 mx-auto mb-2" />
              <p>No logs to display</p>
              <p className="text-xs mt-1">
                {!isStreaming ? 'Start streaming to see logs' : 'Waiting for log messages...'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1 p-4">
            {filteredLogs.map((log) => {
              const levelConfig = LOG_LEVELS[log.level] || LOG_LEVELS.info;
              const Icon = levelConfig.icon;
              
              return (
                <div
                  key={log.id}
                  className={cn(
                    "flex items-start space-x-3 p-2 rounded-lg text-sm",
                    levelConfig.bg
                  )}
                >
                  <Icon className={cn("h-4 w-4 mt-0.5 flex-shrink-0", levelConfig.color)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs text-muted-foreground font-medium">
                        {formatDate(log.timestamp)}
                      </span>
                      <span className={cn("text-xs font-bold uppercase", levelConfig.color)}>
                        {log.level}
                      </span>
                      {log.source && (
                        <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                          {log.source}
                        </span>
                      )}
                    </div>
                    <p className="text-foreground whitespace-pre-wrap break-words">
                      {log.message}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}