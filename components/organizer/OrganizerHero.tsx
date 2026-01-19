"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Users } from "lucide-react";

export default function OrganizerHero() {
  return (
    <section className="relative overflow-hidden bg-background pt-16 md:pt-20 lg:pt-24 pb-16">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-0 pointer-events-none">
        <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-[var(--mainBlue)]/10 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[var(--mainRed)]/10 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
      </div>

      <div className="container relative z-10 mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--mainRed)]/10 text-[var(--mainRed)] text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Users className="h-4 w-4" />
          <span>For Event Planners & Promoters</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          The All-In-One Platform <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--mainRed)] to-[var(--mainBlue)]">
            for Event Organizers
          </span>
        </h1>

        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Manage ticket sales, track revenue in real-time, and ensure smooth
          entry management—all from one powerful dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <Button
            size="lg"
            className="rounded-full px-8 h-12 text-base shadow-lg shadow-[var(--mainRed)]/20 hover:shadow-[var(--mainRed)]/40 hover:bg-[var(--mainRed)]/90 bg-[var(--mainRed)] transition-all"
            asChild
          >
            <Link href="/signup/organizer">
              Create an Event <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 h-12 text-base hover:bg-muted/50 transition-all"
            asChild
          >
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </div>

        {/* Stats / Social Proof */}
        <div className="mt-20 pt-10 border-t border-border/50 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-in fade-in zoom-in duration-1000 delay-500">
          <div>
            <div className="text-3xl font-bold text-foreground">0%</div>
            <div className="text-sm text-muted-foreground mt-1">Setup Fees</div>
          </div>
          {/* <div>
            <div className="text-3xl font-bold text-foreground">Instant</div>
            <div className="text-sm text-muted-foreground mt-1">Payouts</div>
          </div> */}
          <div>
            <div className="text-3xl font-bold text-foreground">24/7</div>
            <div className="text-sm text-muted-foreground mt-1">Support</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">100%</div>
            <div className="text-sm text-muted-foreground mt-1">Secure</div>
          </div>
        </div>
      </div>
    </section>
  );
}
