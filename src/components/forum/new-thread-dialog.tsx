"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/auth-store";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories: Array<{ id: string; name: string; slug: string }>;
}

interface NewThreadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
}

export function NewThreadDialog({
  open,
  onOpenChange,
  categories,
}: NewThreadDialogProps) {
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    categoryId: "",
  });

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Login required",
        description: "Please login to create a thread.",
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a title.",
      });
      return;
    }

    if (!formData.content.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter content for your thread.",
      });
      return;
    }

    if (!formData.categoryId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a category.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newThread = await response.json();
        toast({
          title: "Thread created",
          description: "Your thread has been created successfully.",
        });
        setFormData({ title: "", content: "", categoryId: "" });
        onOpenChange(false);
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to create thread");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create thread.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Start a Discussion
          </DialogTitle>
          <DialogDescription>
            Create a new thread to discuss with the community
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="What's your discussion about?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) =>
                setFormData({ ...formData, categoryId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts, questions, or experiences..."
              rows={6}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Creating..." : "Create Thread"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
