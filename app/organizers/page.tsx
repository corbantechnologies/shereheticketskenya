"use client";

import OrganizerHero from "@/components/organizer/OrganizerHero";
import OrganizerFeatures from "@/components/organizer/OrganizerFeatures";
import OrganizerCTA from "@/components/organizer/OrganizerCTA";
import Footer from "@/components/general/Footer";
import Navbar from "@/components/landing/Navbar";

export default function OrganizerPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <OrganizerHero />
        <OrganizerFeatures />
        <OrganizerCTA />
      </main>
      <Footer />
    </div>
  );
}
