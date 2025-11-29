"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface WhitepaperHeaderProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
  onSearch: (query: string) => void;
}

export default function WhitepaperHeader({
  isDarkMode,
  onThemeToggle,
  onSearch,
}: WhitepaperHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 left-0 right-0 z-40 border-b backdrop-blur-xl transition-colors duration-300",
        isDarkMode
          ? "bg-black/40 border-white/10"
          : "bg-white/80 border-gray-200"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Title */}
          <div className="flex items-center gap-3">
            <span className={cn(
              "font-bold text-lg tracking-tight",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Table of Contents
            </span>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className={cn("h-4 w-4", isDarkMode ? "text-zinc-500" : "text-gray-400")}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search sections..."
                onChange={(e) => onSearch(e.target.value)}
                className={cn(
                  "block w-64 pl-10 pr-3 py-2 border rounded-lg leading-5 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors",
                  isDarkMode
                    ? "bg-white/5 border-white/10 text-white focus:ring-purple-500/50 focus:border-purple-500/50"
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                )}
              />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isDarkMode
                  ? "text-zinc-400 hover:text-white hover:bg-white/10"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              )}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
