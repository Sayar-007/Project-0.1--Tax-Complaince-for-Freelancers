import React, { useState, useEffect } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CriticalAlertBannerProps {
  severity: 'critical' | 'high' | 'medium';
  message: string;
  action?: string;
}

export const CriticalAlertBanner: React.FC<CriticalAlertBannerProps> = ({
  severity,
  message,
  action,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const storageKey = `alert_dismissed_${message.substring(0, 10)}`; // Simple hash key

  useEffect(() => {
    const dismissed = localStorage.getItem(storageKey);
    if (dismissed) {
      setIsVisible(false);
    }
  }, [storageKey]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(storageKey, 'true');
  };

  if (!isVisible) return null;

  const styles = {
    critical: "bg-red-50 border-red-200 text-red-800",
    high: "bg-orange-50 border-orange-200 text-orange-800",
    medium: "bg-yellow-50 border-yellow-200 text-yellow-800",
  };

  const iconStyles = {
    critical: "text-red-600",
    high: "text-orange-600",
    medium: "text-yellow-600",
  };

  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-2xl rounded-lg border p-4 shadow-lg animate-in slide-in-from-top-2",
        styles[severity]
      )}
    >
      <div className="flex items-start gap-4">
        {severity !== 'medium' ? (
          <AlertTriangle className={cn("h-5 w-5 mt-0.5", iconStyles[severity])} />
        ) : (
          <Info className={cn("h-5 w-5 mt-0.5", iconStyles[severity])} />
        )}

        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
          {action && (
            <button className="mt-2 text-xs font-semibold underline hover:no-underline">
              {action}
            </button>
          )}
        </div>

        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
