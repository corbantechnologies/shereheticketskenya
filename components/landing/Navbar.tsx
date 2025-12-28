"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-2xl tracking-tight">
          Sherehe <span className="text-[var(--mainRed)]">Tickets</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/events"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Events
          </Link>
          {/* <Link
            href="/categories"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Categories
          </Link> */}
          <Link
            href="/organizer"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            For Organizers
          </Link>
        </nav>


        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border py-4 px-6 space-y-4 shadow-xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4">
            <Link
              href="/events"
              className="text-lg font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Events
            </Link>
            <Link
              href="/categories"
              className="text-lg font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/organizer"
              className="text-lg font-medium"
              onClick={() => setMobileOpen(false)}
            >
              For Organizers
            </Link>
          </nav>
          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/auth/login">Log In</Link>
            </Button>
            <Button className="w-full justify-start md:justify-center" asChild>
              <Link href="/auth/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
