"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LayoutDashboard } from "lucide-react";

// Import the existing AdminDashboard component
import { AdminDashboard } from "./admin-dashboard";

interface AdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminDialog({ open, onOpenChange }: AdminDialogProps) {
  // Translation not used

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" />
            Admin Panel
          </DialogTitle>
          <DialogDescription>
            Manage users, content, and site settings
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <AdminDashboard />
        </div>
      </DialogContent>
    </Dialog>
  );
}
