"use client";

import { useState } from "react";
import { X, Info, AlertTriangle, CheckCircle, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnnouncementBannerProps {
  title: string;
  content: string;
  type?: "info" | "warning" | "success" | "announcement";
  dismissible?: boolean;
}

const typeStyles = {
  info: {
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    border: "border-blue-500/30",
    text: "text-blue-700 dark:text-blue-300",
    icon: Info,
  },
  warning: {
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    border: "border-amber-500/30",
    text: "text-amber-700 dark:text-amber-300",
    icon: AlertTriangle,
  },
  success: {
    bg: "bg-green-500/10 dark:bg-green-500/20",
    border: "border-green-500/30",
    text: "text-green-700 dark:text-green-300",
    icon: CheckCircle,
  },
  announcement: {
    bg: "bg-primary/10 dark:bg-primary/20",
    border: "border-primary/30",
    text: "text-primary",
    icon: Megaphone,
  },
};

export function AnnouncementBanner({
  title,
  content,
  type = "announcement",
  dismissible = true,
}: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const styles = typeStyles[type];
  const Icon = styles.icon;

  if (!isVisible) return null;

  return (
    <div
      className={`${styles.bg} ${styles.border} border-b ${styles.text} transition-all`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="font-semibold">{title}</span>
              <span className="hidden sm:inline ml-2 opacity-90">{content}</span>
            </div>
          </div>
          {dismissible && (
            <Button
              variant="ghost"
              size="icon"
              className={`${styles.text} hover:bg-transparent flex-shrink-0`}
              onClick={() => setIsVisible(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
