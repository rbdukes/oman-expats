"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/stores/auth-store";
import { LoginDialog } from "@/components/auth/login-dialog";
import { RegisterDialog } from "@/components/auth/register-dialog";
import { ProfileDialog } from "@/components/profile/profile-dialog";
import { SettingsDialog } from "@/components/settings/settings-dialog";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { LanguageSelector } from "@/components/ui-extensions/language-selector";
import { useLanguage, Language } from "@/contexts/language-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  MessageSquare,
  Home,
  Briefcase,
  Building,
  Car,
  Heart,
  ShoppingCart,
  Newspaper,
  HelpCircle,
  BookOpen,
  LayoutDashboard,
  Globe,
  ChevronDown,
} from "lucide-react";

const navigationCategories = [
  {
    title: "Moving to Oman",
    icon: Home,
    section: "moving",
    items: [
      { title: "Visa & Residency", section: "visa" },
      { title: "Work Permits", section: "work-permits" },
      { title: "Family Sponsorship", section: "family" },
      { title: "PRO Services", section: "pro" },
      { title: "Immigration Updates", section: "immigration" },
    ],
  },
  {
    title: "Employment & Business",
    icon: Briefcase,
    section: "employment",
    items: [
      { title: "Job Board", section: "jobs" },
      { title: "CV Posting", section: "cv" },
      { title: "Business Setup", section: "business" },
      { title: "Free Zones", section: "freezones" },
      { title: "Networking", section: "networking" },
    ],
  },
  {
    title: "Housing & Real Estate",
    icon: Building,
    section: "housing",
    items: [
      { title: "Apartments for Rent", section: "apartments" },
      { title: "Villas for Rent", section: "villas" },
      { title: "Property Sales", section: "property" },
      { title: "Roommates", section: "roommates" },
    ],
  },
  {
    title: "Medical & Health",
    icon: Heart,
    section: "medical",
    items: [
      { title: "Hospitals", section: "hospitals" },
      { title: "Clinics", section: "clinics" },
      { title: "Insurance Providers", section: "insurance" },
      { title: "Pharmacies", section: "pharmacies" },
    ],
  },
  {
    title: "Classifieds",
    icon: ShoppingCart,
    section: "classifieds",
    items: [
      { title: "Buy & Sell", section: "buy-sell" },
      { title: "Jobs Offered", section: "jobs-offered" },
      { title: "Services", section: "services" },
      { title: "Announcements", section: "announcements" },
    ],
  },
];

const quickLinks = [
  { title: "Forum", icon: MessageSquare, section: "forum" },
  { title: "News", icon: Newspaper, section: "news" },
  { title: "Guides", icon: BookOpen, section: "guides" },
  { title: "Help", icon: HelpCircle, section: "help" },
];

// Mobile language button component
function MobileLanguageButton({ lang }: { lang: { code: string; flag: string; name: string } }) {
  const { language, setLanguage } = useLanguage();
  const isActive = language === lang.code;
  
  return (
    <button
      onClick={() => setLanguage(lang.code as Language)}
      className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-colors ${
        isActive
          ? "bg-primary/10 border-primary text-primary"
          : "bg-background border-border hover:bg-muted"
      }`}
    >
      <span className="text-xl">{lang.flag}</span>
      <span className="text-xs font-medium mt-1">{lang.name}</span>
    </button>
  );
}

// Dropdown Navigation Item
function NavDropdown({ category, onNavigate }: { category: typeof navigationCategories[0]; onNavigate: (section: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={buttonRef}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        onClick={() => onNavigate(category.section)}
      >
        <category.icon className="h-4 w-4" />
        {category.title}
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div
          ref={contentRef}
          className="absolute top-full left-0 mt-1 w-56 bg-popover border rounded-md shadow-lg z-50 py-1"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {category.items.map((item) => (
            <button
              key={item.section}
              className="w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() => {
                onNavigate(item.section);
                setIsOpen(false);
              }}
            >
              {item.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [notifications] = useState(3);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return "U";
  };

  const handleNavigate = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Scroll to categories section as fallback
      const categoriesSection = document.getElementById('categories');
      if (categoriesSection) {
        categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">OE</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-primary">Oman</span>
              <span className="text-xl font-semibold text-foreground">Expat</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            {navigationCategories.map((category) => (
              <NavDropdown
                key={category.title}
                category={category}
                onNavigate={handleNavigate}
              />
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Language Selector */}
            <LanguageSelector />

            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
                    >
                      {notifications}
                    </Badge>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar || undefined} alt={user.displayName || user.firstName} />
                        <AvatarFallback>{getInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || undefined} />
                        <AvatarFallback>{getInitials()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.displayName || `${user.firstName} ${user.lastName}`}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem onClick={() => setAdminOpen(true)}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" onClick={() => setLoginOpen(true)}>
                  Sign In
                </Button>
                <Button onClick={() => setRegisterOpen(true)}>
                  Join Now
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navigationCategories.map((category) => (
                    <div key={category.title} className="space-y-2">
                      <button
                        onClick={() => handleNavigate(category.section)}
                        className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors w-full text-left"
                      >
                        <category.icon className="h-5 w-5" />
                        {category.title}
                      </button>
                      <div className="ml-7 space-y-1">
                        {category.items.map((item) => (
                          <button
                            key={item.section}
                            onClick={() => handleNavigate(item.section)}
                            className="block py-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left"
                          >
                            {item.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    {quickLinks.map((link) => (
                      <button
                        key={link.section}
                        onClick={() => handleNavigate(link.section)}
                        className="flex items-center gap-2 py-2 font-medium text-foreground hover:text-primary transition-colors w-full text-left"
                      >
                        <link.icon className="h-5 w-5" />
                        {link.title}
                      </button>
                    ))}
                  </div>
                  
                  {/* Mobile Language Selector */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center gap-2 py-2 text-muted-foreground">
                      <Globe className="h-5 w-5" />
                      <span className="font-medium">Language</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {[
                        { code: "en", flag: "🇬🇧", name: "EN" },
                        { code: "ru", flag: "🇷🇺", name: "RU" },
                        { code: "ar", flag: "🇴🇲", name: "AR" },
                        { code: "zh", flag: "🇨🇳", name: "ZH" },
                        { code: "de", flag: "🇩🇪", name: "DE" },
                        { code: "fr", flag: "🇫🇷", name: "FR" },
                      ].map((lang) => (
                        <MobileLanguageButton key={lang.code} lang={lang} />
                      ))}
                    </div>
                  </div>
                  
                  {!isAuthenticated && (
                    <div className="border-t pt-4 mt-4 space-y-2">
                      <Button variant="outline" className="w-full" onClick={() => setLoginOpen(true)}>
                        Sign In
                      </Button>
                      <Button className="w-full" onClick={() => setRegisterOpen(true)}>
                        Join Now
                      </Button>
                    </div>
                  )}

                  {isAuthenticated && user && (
                    <div className="border-t pt-4 mt-4 space-y-2">
                      <Button variant="outline" className="w-full" onClick={() => setProfileOpen(true)}>
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                      {user.role === "admin" && (
                        <Button variant="outline" className="w-full" onClick={() => setAdminOpen(true)}>
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Button>
                      )}
                      <Button variant="outline" className="w-full" onClick={() => setSettingsOpen(true)}>
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                      <Button variant="destructive" className="w-full" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Log out
                      </Button>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Auth Modals */}
      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />
      <RegisterDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />

      {/* Profile Modal */}
      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />

      {/* Settings Modal */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />

      {/* Admin Modal */}
      <Dialog open={adminOpen} onOpenChange={setAdminOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5" />
              Admin Panel
            </DialogTitle>
          </DialogHeader>
          <AdminDashboard />
        </DialogContent>
      </Dialog>
    </>
  );
}
