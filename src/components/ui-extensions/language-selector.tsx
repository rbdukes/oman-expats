"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Globe } from "lucide-react";
import { useLanguage, languages, Language } from "@/contexts/language-context";

export function LanguageSelector() {
  const { language, setLanguage, languageOption } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 h-9"
      >
        <Globe className="h-4 w-4" />
        <span className="text-lg">{languageOption.flag}</span>
        <span className="hidden sm:inline text-xs font-medium uppercase">
          {languageOption.code}
        </span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-popover border rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm rounded-md transition-colors ${
                  language === lang.code
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{lang.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {lang.nativeName}
                  </div>
                </div>
                <span className="text-xs font-bold uppercase text-muted-foreground">
                  {lang.code}
                </span>
              </button>
            ))}
          </div>
          
          {/* Language info footer */}
          <div className="border-t px-3 py-2 bg-muted/50">
            <p className="text-xs text-muted-foreground text-center">
              Language preference saved
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
