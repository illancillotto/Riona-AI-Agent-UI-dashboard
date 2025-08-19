'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ActionCard({ 
  title, 
  description, 
  icon: Icon, 
  children, 
  onSubmit,
  className,
  disabled = false 
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await onSubmit(formData);
      setResult({ success: true, message: response?.message || 'Action completed successfully' });
    } catch (error) {
      setResult({ success: false, message: error.message || 'Action failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(
      "bg-card rounded-lg border border-border p-6 shadow-sm",
      className
    )}>
      {/* Header */}
      <div className="flex items-start space-x-3 mb-4">
        {Icon && (
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          </div>
        )}
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-4">
        {typeof children === 'function' 
          ? children({ loading, onSubmit: handleSubmit }) 
          : children
        }
        
        {/* Result */}
        {result && (
          <div className={cn(
            "p-3 rounded-lg text-sm",
            result.success 
              ? "bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-100 dark:border-green-800"
              : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-100 dark:border-red-800"
          )}>
            {result.message}
          </div>
        )}
      </div>
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-background/50 rounded-lg flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}