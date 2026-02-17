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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/auth-store";
import {
  Eye,
  MessageCircle,
  Clock,
  Pin,
  Star,
  ArrowUp,
  Flag,
  Share2,
  Bookmark,
} from "lucide-react";

interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string | null;
    avatar: string | null;
    role: string;
  };
}

interface Thread {
  id: string;
  title: string;
  content: string;
  slug: string;
  views: number;
  isPinned: boolean;
  isFeatured: boolean;
  isLocked: boolean;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string | null;
    avatar: string | null;
    role: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  posts: Post[];
  _count: {
    posts: number;
  };
}

interface ThreadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  threadId: string | null;
}

export function ThreadDialog({ open, onOpenChange, threadId }: ThreadDialogProps) {
  // Translation not used
  const { toast } = useToast();
  const { isAuthenticated } = useAuthStore();
  const [thread, setThread] = useState<Thread | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    if (open && threadId) {
      fetchThread();
    }
  }, [open, threadId]);

  const fetchThread = async () => {
    if (!threadId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/threads/${threadId}`);
      if (response.ok) {
        const data = await response.json();
        setThread(data);
      }
    } catch (error) {
      console.error("Failed to fetch thread:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = async () => {
    if (!isAuthenticated || !threadId || !replyContent.trim()) return;

    try {
      const response = await fetch(`/api/threads/${threadId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent }),
      });

      if (response.ok) {
        setReplyContent("");
        fetchThread();
        toast({
          title: "Reply Posted",
          description: "Your reply has been posted successfully.",
        });
      } else {
        throw new Error("Failed to post reply");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    }
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start gap-2">
            {thread?.isPinned && (
              <Badge variant="secondary" className="gap-1">
                <Pin className="h-3 w-3" /> Pinned
              </Badge>
            )}
            {thread?.isFeatured && (
              <Badge variant="secondary" className="gap-1">
                <Star className="h-3 w-3" /> Featured
              </Badge>
            )}
          </div>
          <DialogTitle className="text-xl">{thread?.title || "Loading..."}</DialogTitle>
          <DialogDescription className="flex items-center gap-4">
            {thread && (
              <>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" /> {thread.views} views
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" /> {thread._count.posts} replies
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {timeAgo(thread.createdAt)}
                </span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6">
          <div className="px-6 space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Loading thread...</div>
            ) : thread ? (
              <>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={thread.author.avatar || undefined} />
                          <AvatarFallback>
                            {getInitials(thread.author.firstName, thread.author.lastName)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">
                            {thread.author.displayName || `${thread.author.firstName} ${thread.author.lastName}`}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {thread.author.role}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {thread.category.name}
                          </Badge>
                        </div>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <p className="whitespace-pre-wrap">{thread.content}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <ArrowUp className="h-4 w-4" /> 0
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Flag className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">
                    {thread.posts.length} replies
                  </h3>
                  
                  {thread.posts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No replies yet</p>
                      <p className="text-sm">Be the first to reply!</p>
                    </div>
                  ) : (
                    thread.posts.map((post) => (
                      <Card key={post.id}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={post.author.avatar || undefined} />
                                <AvatarFallback>
                                  {getInitials(post.author.firstName, post.author.lastName)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-sm">
                                  {post.author.displayName || `${post.author.firstName} ${post.author.lastName}`}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {post.author.role}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {timeAgo(post.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm whitespace-pre-wrap">{post.content}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button variant="ghost" size="sm" className="gap-1 h-7">
                                  <ArrowUp className="h-3 w-3" /> 0
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-1 h-7">
                                  <Flag className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                {isAuthenticated && !thread.isLocked && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Post Reply</h3>
                    <Textarea
                      placeholder="Write your reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={4}
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setReplyContent("")}>
                        Cancel
                      </Button>
                      <Button onClick={handleReply} disabled={!replyContent.trim()}>
                        Post Reply
                      </Button>
                    </div>
                  </div>
                )}

                {thread.isLocked && (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>This thread is locked. No new replies can be posted.</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Thread not found
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
