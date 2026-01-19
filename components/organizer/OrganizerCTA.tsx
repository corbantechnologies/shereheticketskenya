"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrganizerCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--mainRed)] to-[var(--mainBlue)] opacity-90" />
      {/* <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20" /> */}

      <div className="container relative z-10 mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Sell Out Your Next Event?
        </h2>
        <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">
          Join the community of top organizers in Kenya and take your events to
          the next level.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            variant="secondary"
            className="rounded-full px-8 h-12 text-base font-semibold shadow-xl hover:bg-white text-[var(--mainRed)]"
            asChild
          >
            <Link href="/signup/organizer">Get Started for Free</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 h-12 text-base bg-transparent text-white border-white hover:bg-white/10 hover:text-white"
            asChild
          >
            <Link href="/contact">Book a Demo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
