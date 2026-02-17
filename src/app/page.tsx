"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AnnouncementBanner } from "@/components/layout/announcement-banner";
import { RegisterDialog } from "@/components/auth/register-dialog";
import { ThreadDialog } from "@/components/forum/thread-dialog";
import { ClassifiedDialog } from "@/components/classifieds/classified-dialog";
import { NewThreadDialog } from "@/components/forum/new-thread-dialog";
import { NewClassifiedDialog } from "@/components/classifieds/new-classified-dialog";
import {
  Home,
  Briefcase,
  Building,
  Car,
  Heart,
  ShoppingCart,
  Users,
  TrendingUp,
  Clock,
  ChevronRight,
  Search,
  ArrowRight,
  Star,
  Pin,
  Globe,
  MapPin,
  Calendar,
  Eye,
  MessageCircle,
  BookOpen,
  Newspaper,
} from "lucide-react";

// Icon mapping for categories
const categoryIcons: Record<string, typeof Home> = {
  Home,
  Briefcase,
  Building,
  Car,
  Heart,
  ShoppingCart,
  Users,
  Newspaper,
  BookOpen,
};

interface Stats {
  members: number;
  discussions: number;
  posts: number;
  countries: number;
  dailyPosts: number;
  dailyThreads: number;
  dailyMembers: number;
  classifieds: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  subcategories: Array<{ id: string; name: string; slug: string }>;
  threads: number;
  posts: number;
}

interface Thread {
  id: string;
  title: string;
  slug: string;
  views: number;
  isPinned: boolean;
  isFeatured: boolean;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string | null;
    avatar: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  _count: {
    posts: number;
  };
}

interface Classified {
  id: string;
  title: string;
  slug: string;
  price: number | null;
  currency: string;
  category: string;
  location: string | null;
  isFeatured: boolean;
  isUrgent: boolean;
  createdAt: string;
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [classifieds, setClassifieds] = useState<Classified[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog states
  const [registerOpen, setRegisterOpen] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [selectedClassifiedId, setSelectedClassifiedId] = useState<string | null>(null);
  const [newThreadOpen, setNewThreadOpen] = useState(false);
  const [newClassifiedOpen, setNewClassifiedOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, categoriesRes, threadsRes, classifiedsRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/categories/stats"),
          fetch("/api/threads/featured"),
          fetch("/api/classifieds/latest"),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }

        if (threadsRes.ok) {
          const threadsData = await threadsRes.json();
          setThreads(threadsData);
        }

        if (classifiedsRes.ok) {
          const classifiedsData = await classifiedsRes.json();
          setClassifieds(classifiedsData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle hash navigation
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [isLoading]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <div className="flex flex-col">
      {/* Announcement Banner */}
      <AnnouncementBanner
        title="🎉 Welcome to Oman Expat!"
        content="Join our growing community. Sign up today and connect with fellow expats!"
        type="announcement"
      />

      {/* Hero Section */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <Star className="h-3 w-3 mr-1" />
              The #1 Expat Community in Oman
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Your Trusted <span className="text-primary">Expat Community</span> in Oman
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              Connect with fellow expatriates, find jobs, housing, and essential information 
              for living in the Sultanate of Oman.
            </p>

            {/* Search Bar */}
            <div className="w-full max-w-2xl mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search discussions, classifieds, guides..."
                  className="pl-12 pr-4 h-12 text-base bg-background"
                />
                <Button className="absolute right-2 top-1/2 -translate-y-1/2">
                  Search
                </Button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="gap-2" onClick={() => setRegisterOpen(true)}>
                Join the Community
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2" onClick={() => scrollToSection('discussions')}>
                Browse Discussions
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-8 w-8 mx-auto mb-2 rounded-full" />
                  <Skeleton className="h-8 w-16 mx-auto mb-1" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </div>
              ))
            ) : (
              <>
                <div className="text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl md:text-3xl font-bold">
                    {stats ? formatNumber(stats.members) : "0"}
                  </div>
                  <div className="text-sm text-muted-foreground">Members</div>
                </div>
                <div className="text-center">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl md:text-3xl font-bold">
                    {stats ? formatNumber(stats.discussions) : "0"}
                  </div>
                  <div className="text-sm text-muted-foreground">Discussions</div>
                </div>
                <div className="text-center">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl md:text-3xl font-bold">
                    {stats ? stats.countries : "0"}
                  </div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl md:text-3xl font-bold">
                    {stats ? formatNumber(stats.dailyPosts) : "0"}
                  </div>
                  <div className="text-sm text-muted-foreground">Daily Posts</div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Categories */}
      <section id="categories" className="py-16 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Explore Categories</h2>
              <p className="text-muted-foreground mt-1">Find information relevant to your expat journey</p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Categories Yet</h3>
                <p className="text-muted-foreground">
                  Categories will appear here as content is created.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const IconComponent = category.icon ? categoryIcons[category.icon] || Home : Home;
                return (
                  <Card 
                    key={category.id} 
                    id={category.slug}
                    className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer scroll-mt-20"
                    onClick={() => scrollToSection('discussions')}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div 
                          className="p-3 rounded-lg"
                          style={{ 
                            backgroundColor: category.color ? `${category.color}20` : "hsl(var(--muted))",
                            color: category.color || "hsl(var(--primary))" 
                          }}
                        >
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {category.threads} thread{category.threads !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {category.name}
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {category.subcategories.slice(0, 3).map((sub) => (
                          <span
                            key={sub.id}
                            id={sub.slug}
                            className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                          >
                            {sub.name}
                          </span>
                        ))}
                        {category.subcategories.length > 3 && (
                          <span className="text-xs px-2 py-1 text-muted-foreground">
                            +{category.subcategories.length - 3} more
                          </span>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 text-sm text-muted-foreground">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {category.posts.toLocaleString()} post{category.posts !== 1 ? "s" : ""}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Forum & Classifieds Split */}
      <section id="discussions" className="py-16 scroll-mt-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="discussions" className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <TabsList className="bg-muted">
                <TabsTrigger value="discussions" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Latest Discussions
                </TabsTrigger>
                <TabsTrigger value="classifieds" className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Classifieds
                </TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setNewThreadOpen(true)}>
                  Start Discussion
                </Button>
                <Button variant="outline" size="sm" onClick={() => setNewClassifiedOpen(true)}>
                  Post Ad
                </Button>
              </div>
            </div>

            <TabsContent value="discussions" className="mt-0">
              {isLoading ? (
                <div className="space-y-4">
                  {Array(4).fill(0).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="flex-1">
                            <Skeleton className="h-5 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : threads.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Discussions Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Be the first to start a discussion in our community!
                    </p>
                    <Button onClick={() => setNewThreadOpen(true)}>Start a Discussion</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {threads.map((thread) => (
                    <Card 
                      key={thread.id} 
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedThreadId(thread.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src={thread.author.avatar || undefined} />
                            <AvatarFallback>
                              {getInitials(thread.author.firstName, thread.author.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              {thread.isPinned && (
                                <Badge variant="secondary" className="text-xs gap-1">
                                  <Pin className="h-3 w-3" /> Pinned
                                </Badge>
                              )}
                              {thread.isFeatured && (
                                <Badge variant="secondary" className="text-xs gap-1">
                                  <Star className="h-3 w-3" /> Featured
                                </Badge>
                              )}
                            </div>
                            <span className="font-semibold hover:text-primary transition-colors line-clamp-1">
                              {thread.title}
                            </span>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                              <span className="hover:text-primary transition-colors">
                                {thread.category.name}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                {thread._count.posts}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {thread.views.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {timeAgo(thread.createdAt)}
                              </span>
                              <span className="text-primary font-medium">
                                {thread.author.displayName || `${thread.author.firstName} ${thread.author.lastName}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              {threads.length > 0 && (
                <div className="mt-6 text-center">
                  <Button variant="outline" className="gap-2">
                    View All Discussions
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="classifieds" className="mt-0" id="classifieds">
              {isLoading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array(4).fill(0).map((_, i) => (
                    <Card key={i}>
                      <Skeleton className="aspect-video" />
                      <CardHeader>
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : classifieds.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Classifieds Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Be the first to post a classified ad!
                    </p>
                    <Button onClick={() => setNewClassifiedOpen(true)}>Post a Classified</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {classifieds.map((ad) => (
                    <Card 
                      key={ad.id} 
                      className="overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
                      onClick={() => setSelectedClassifiedId(ad.id)}
                    >
                      <div className="aspect-video bg-muted relative flex items-center justify-center">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                        {ad.isUrgent && (
                          <Badge className="absolute top-2 left-2 bg-red-500">
                            Urgent
                          </Badge>
                        )}
                        {ad.isFeatured && (
                          <Badge className="absolute top-2 left-2 bg-primary">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base line-clamp-1 group-hover:text-primary transition-colors">
                          {ad.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {ad.location || "Oman"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">
                            {ad.price ? `${ad.price} ${ad.currency}` : "Contact for price"}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {ad.category}
                          </Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {timeAgo(ad.createdAt)}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
              {classifieds.length > 0 && (
                <div className="mt-6 text-center">
                  <Button variant="outline" className="gap-2">
                    View All Classifieds
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section id="join" className="py-16 bg-primary text-primary-foreground scroll-mt-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Connect with expatriates, access exclusive resources, and make 
            your life in Oman easier. Registration is free!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" className="gap-2" onClick={() => setRegisterOpen(true)}>
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Links Bar */}
      <section className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/#terms" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/#privacy" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/#contact" className="text-muted-foreground hover:text-primary transition-colors">
              Contact Us
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/#advertise" className="text-muted-foreground hover:text-primary transition-colors">
              Advertise
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/#help" id="help" className="text-muted-foreground hover:text-primary transition-colors">
              Help Center
            </Link>
          </div>
        </div>
      </section>

      {/* Dialogs */}
      <RegisterDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onSwitchToLogin={() => setRegisterOpen(false)}
      />
      
      {selectedThreadId && (
        <ThreadDialog
          threadId={selectedThreadId}
          open={!!selectedThreadId}
          onOpenChange={(open) => !open && setSelectedThreadId(null)}
        />
      )}
      
      {selectedClassifiedId && (
        <ClassifiedDialog
          classifiedId={selectedClassifiedId}
          open={!!selectedClassifiedId}
          onOpenChange={(open) => !open && setSelectedClassifiedId(null)}
        />
      )}
      
      <NewThreadDialog
        open={newThreadOpen}
        onOpenChange={setNewThreadOpen}
        categories={categories}
      />
      
      <NewClassifiedDialog
        open={newClassifiedOpen}
        onOpenChange={setNewClassifiedOpen}
      />
    </div>
  );
}
