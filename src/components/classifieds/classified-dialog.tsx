"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/auth-store";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Heart,
  Share2,
  Flag,
  MessageCircle,
  Tag,
} from "lucide-react";

interface Classified {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number | null;
  currency: string;
  category: string;
  location: string | null;
  isFeatured: boolean;
  isUrgent: boolean;
  status: string;
  contactPhone: string | null;
  contactEmail: string | null;
  images: string[];
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string | null;
    avatar: string | null;
    email: string;
  };
}

interface ClassifiedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classifiedId: string | null;
}

export function ClassifiedDialog({ open, onOpenChange, classifiedId }: ClassifiedDialogProps) {
  // Translation not used
  const { toast } = useToast();
  const { isAuthenticated } = useAuthStore();
  const [classified, setClassified] = useState<Classified | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && classifiedId) {
      fetchClassified();
    }
  }, [open, classifiedId]);

  const fetchClassified = async () => {
    if (!classifiedId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/classifieds/${classifiedId}`);
      if (response.ok) {
        const data = await response.json();
        setClassified(data);
      }
    } catch (error) {
      console.error("Failed to fetch classified:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContact = () => {
    toast({
      title: "Contact Seller",
      description: "Contact feature coming soon!",
    });
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to save listings.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Saved",
      description: "Listing saved to your favorites.",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-2">
            {classified?.isUrgent && (
              <Badge variant="destructive" className="gap-1">
                Urgent
              </Badge>
            )}
            {classified?.isFeatured && (
              <Badge className="gap-1">
                Featured
              </Badge>
            )}
          </div>
          <DialogTitle className="text-xl">{classified?.title || "Loading..."}</DialogTitle>
          <DialogDescription className="flex items-center gap-4">
            {classified && (
              <>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {classified.location || "Oman"}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {timeAgo(classified.createdAt)}
                </span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">Loading listing...</div>
        ) : classified ? (
          <div className="space-y-6">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              {classified.images && classified.images.length > 0 ? (
                <img 
                  src={classified.images[0]} 
                  alt={classified.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Tag className="h-16 w-16 text-muted-foreground" />
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold text-primary">
                  {classified.price 
                    ? `${classified.price.toLocaleString()} ${classified.currency}`
                    : "Contact for price"
                  }
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleSave}>
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {classified.description || "No description provided."}
              </p>
            </div>

            <Separator />

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={classified.author.avatar || undefined} />
                    <AvatarFallback>
                      {getInitials(classified.author.firstName, classified.author.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">
                      {classified.author.displayName || `${classified.author.firstName} ${classified.author.lastName}`}
                    </p>
                    <p className="text-sm text-muted-foreground">Seller</p>
                  </div>
                  <Button className="gap-2" onClick={handleContact}>
                    <MessageCircle className="h-4 w-4" />
                    Contact Seller
                  </Button>
                </div>
              </CardContent>
            </Card>

            {(classified.contactPhone || classified.contactEmail) && (
              <div className="space-y-2">
                <h3 className="font-semibold">Contact Information</h3>
                {classified.contactPhone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{classified.contactPhone}</span>
                  </div>
                )}
                {classified.contactEmail && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{classified.contactEmail}</span>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Category:</span>
                <Badge variant="secondary" className="ml-2">{classified.category}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="outline" className="ml-2">{classified.status}</Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Listing not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
