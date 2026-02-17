"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  MapPin,
  Phone,
  ExternalLink,
} from "lucide-react";

const footerLinks = {
  categories: [
    { title: "Moving to Oman", href: "/#moving" },
    { title: "Employment & Business", href: "/#employment" },
    { title: "Housing & Real Estate", href: "/#housing" },
    { title: "Medical & Health", href: "/#medical" },
    { title: "Transport & Driving", href: "/#transport" },
  ],
  community: [
    { title: "Discussion Forum", href: "/#forum" },
    { title: "Classifieds", href: "/#classifieds" },
    { title: "News & Updates", href: "/#news" },
    { title: "Events", href: "/#events" },
    { title: "Guides", href: "/#guides" },
  ],
  support: [
    { title: "Help Center", href: "/#help" },
    { title: "Contact Us", href: "/#contact" },
    { title: "Report an Issue", href: "/#report" },
    { title: "Feedback", href: "/#feedback" },
    { title: "FAQs", href: "/#faqs" },
  ],
  legal: [
    { title: "Terms of Service", href: "/#terms" },
    { title: "Privacy Policy", href: "/#privacy" },
    { title: "Cookie Policy", href: "/#cookies" },
    { title: "GDPR Compliance", href: "/#gdpr" },
    { title: "Disclaimers", href: "/#disclaimers" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="text-xl font-bold text-primary-foreground">OE</span>
              </div>
              <div>
                <span className="text-xl font-bold text-primary">Oman</span>
                <span className="text-xl font-semibold text-foreground">Expat</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              Your trusted community for expatriates living in or relocating to Oman. 
              Connect, share, and thrive in your new home.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Muscat, Sultanate of Oman</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:info@omanexpat.com" className="hover:text-primary transition-colors">
                  info@omanexpat.com
                </a>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Categories</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Community</h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Oman Expat. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          {/* Flag Colors Indicator */}
          <div className="flex items-center gap-1">
            <div className="h-4 w-4 rounded-sm bg-[var(--oman-red)]" title="Oman Red" />
            <div className="h-4 w-4 rounded-sm bg-[var(--oman-white)] border" title="Oman White" />
            <div className="h-4 w-4 rounded-sm bg-[var(--oman-green)]" title="Oman Green" />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Disclaimer:</strong> Oman Expat is an independent community platform and is not affiliated with 
            the Government of Oman. Information provided on this platform is for general guidance purposes only and 
            should not be considered as legal, immigration, or professional advice. Always verify information with 
            official government sources and consult qualified professionals for specific situations.
          </p>
        </div>
      </div>
    </footer>
  );
}
