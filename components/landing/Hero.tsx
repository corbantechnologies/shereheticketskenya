"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Ticket } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-16 md:pt-20 lg:pt-24 pb-16">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[var(--mainBlue)]/10 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--mainRed)]/10 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
      </div>

      <div className="container relative z-10 mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--mainBlue)]/10 text-[var(--mainBlue)] text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <PartyPopperIcon className="h-4 w-4" />
          <span>The #1 Event Platform in Kenya</span>
        </div>

        <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Discover & Book <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--mainBlue)] to-[var(--mainRed)]">
             Unforgettable Events
          </span>
        </h1>

        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          From pulsating concerts in Nairobi to serene festivals on the coast.
          Find your next experience and secure your tickets in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <Button
            size="lg"
            className="rounded-full px-8 h-12 text-base shadow-lg shadow-[var(--mainBlue)]/20 hover:shadow-[var(--mainBlue)]/40 transition-all"
            asChild
          >
            <Link href="/events">
              Explore Events <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 h-12 text-base hover:bg-muted/50 transition-all"
            asChild
          >
            <Link href="/signup/organizer">Create an Event</Link>
          </Button>
        </div>

        {/* Stats / Social Proof */}
        <div className="mt-20 pt-10 border-t border-border/50 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-in fade-in zoom-in duration-1000 delay-500">
          <div>
            <div className="text-3xl font-bold text-foreground">500+</div>
            <div className="text-sm text-muted-foreground mt-1">
              Active Events
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">10k+</div>
            <div className="text-sm text-muted-foreground mt-1">
              Tickets Sold
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">50+</div>
            <div className="text-sm text-muted-foreground mt-1">Venues</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">4.9/5</div>
            <div className="text-sm text-muted-foreground mt-1">
              User Rating
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PartyPopperIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5.8 11.3 2 22l10.7-3.79" />
      <path d="M4 3h.01" />
      <path d="M22 8h.01" />
      <path d="M15 2h.01" />
      <path d="M22 20h.01" />
      <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
      <path d="m22 13-.5.17" />
      <path d="m20 16.5-1.5.5" />
    </svg>
  );
}
