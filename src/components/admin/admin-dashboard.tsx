"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/auth-store";
import {
  Users,
  MessageSquare,
  ShoppingCart,
  Flag,
  TrendingUp,
  Clock,
  Search,
  MoreHorizontal,
  Ban,
  CheckCircle,
  XCircle,
  UserCheck,
  AlertTriangle,
  BarChart3,
  Globe,
  Activity,
} from "lucide-react";

interface AdminStats {
  counts: {
    totalUsers: number;
    activeUsers: number;
    pendingUsers: number;
    totalThreads: number;
    totalPosts: number;
    totalClassifieds: number;
    pendingReports: number;
    newUsersThisWeek: number;
    newThreadsThisWeek: number;
  };
  usersByNationality: Array<{ nationality: string; _count: number }>;
  activeCategories: Array<{ name: string; threads: number }>;
}

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string | null;
  nationality: string | null;
  profession: string | null;
  avatar: string | null;
  role: string;
  status: string;
  emailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  _count: {
    threads: number;
    posts: number;
    classifieds: number;
  };
}

interface Report {
  id: string;
  reporter: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  targetType: string;
  targetId: string;
  reason: string;
  description: string | null;
  status: string;
  createdAt: string;
  thread: { id: string; title: string } | null;
}

export function AdminDashboard() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
      fetchUsers();
      fetchReports();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(`/api/admin/users?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/admin/reports");
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });

      if (response.ok) {
        toast({
          title: "Action completed",
          description: `User has been ${action}ed successfully.`,
        });
        fetchUsers();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Action failed",
        description: "Failed to perform action.",
      });
    }
  };

  const handleReportAction = async (reportId: string, status: string) => {
    try {
      const response = await fetch("/api/admin/reports", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, status }),
      });

      if (response.ok) {
        toast({
          title: "Report updated",
          description: "Report status has been updated.",
        });
        fetchReports();
        fetchStats();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update report.",
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need administrator privileges to access this panel.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, content, and moderation</p>
        </div>
        <Button onClick={() => { fetchStats(); fetchUsers(); fetchReports(); }}>
          <Activity className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.counts.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.counts.newUsersThisWeek} this week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Discussions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.counts.totalThreads.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.counts.newThreadsThisWeek} this week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classifieds</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.counts.totalClassifieds.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Active listings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.counts.pendingReports}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <Flag className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      className="pl-8 w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={fetchUsers}>Search</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Nationality</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={u.avatar || undefined} />
                            <AvatarFallback>
                              {u.firstName[0]}{u.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {u.displayName || `${u.firstName} ${u.lastName}`}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {u.profession}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.nationality || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            u.status === "active"
                              ? "default"
                              : u.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {u.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div>{u._count.threads} threads</div>
                          <div>{u._count.posts} posts</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {u.status !== "active" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUserAction(u.id, "activate")}
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </Button>
                          )}
                          {u.status !== "suspended" && u.status !== "banned" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUserAction(u.id, "suspend")}
                            >
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                            </Button>
                          )}
                          {u.status !== "banned" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUserAction(u.id, "ban")}
                            >
                              <Ban className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Content Reports</CardTitle>
              <CardDescription>Review and moderate reported content</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {report.reporter.firstName} {report.reporter.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {report.reporter.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Badge variant="outline">{report.targetType}</Badge>
                          {report.thread && (
                            <div className="text-sm mt-1">{report.thread.title}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{report.reason}</div>
                          {report.description && (
                            <div className="text-xs text-muted-foreground">
                              {report.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            report.status === "pending"
                              ? "secondary"
                              : report.status === "resolved"
                              ? "default"
                              : "outline"
                          }
                        >
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReportAction(report.id, "resolved")}
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReportAction(report.id, "dismissed")}
                          >
                            <XCircle className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Users by Nationality */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Users by Nationality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.usersByNationality.map((item) => (
                    <div key={item.nationality} className="flex items-center">
                      <div className="w-24 font-medium">{item.nationality}</div>
                      <div className="flex-1 mx-4">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{
                              width: `${(item._count / (stats?.counts.totalUsers || 1)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{item._count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Most Active Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.activeCategories.map((cat, index) => (
                    <div key={cat.name} className="flex items-center">
                      <div className="w-8 text-muted-foreground font-medium">#{index + 1}</div>
                      <div className="flex-1 font-medium">{cat.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {cat.threads} threads
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
