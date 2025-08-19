'use client';

import { cn } from '../lib/utils';

export default function StatCard({ title, value, description, icon: Icon, className, trend }) {
  return (
    <div className={cn(
      "bg-card rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-shadow",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center mt-2 text-xs",
              trend.direction === 'up' ? 'text-green-600' : trend.direction === 'down' ? 'text-red-600' : 'text-muted-foreground'
            )}>
              <span>{trend.value}</span>
              <span className="ml-1">{trend.label}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}