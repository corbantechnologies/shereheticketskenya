/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, FileText, Lock, Globe } from "lucide-react";

export default function TermsAndConditions() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-gray-300">
      {/* Header */}
      <div className="border-b border-white/5 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div className="text-sm font-bold tracking-tighter text-white">
            SHEREHE <span className="text-[var(--mainRed)]">TICKETS</span>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        <div className="space-y-12">
          {/* Title Area */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-[var(--mainRed)]/10 text-[var(--mainRed)] mb-4">
              <FileText className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-gray-500">Last updated: December 28, 2025</p>
          </div>

          {/* Quick Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <ShieldCheck className="h-6 w-6 text-[var(--mainRed)]" />
              <h3 className="font-semibold text-white">Trust & Security</h3>
              <p className="text-sm text-gray-500 font-light">
                We prioritize the security of your event data and ticket sales.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <Lock className="h-6 w-6 text-[var(--mainBlue)]" />
              <h3 className="font-semibold text-white">Privacy First</h3>
              <p className="text-sm text-gray-500 font-light">
                Your information is never sold to third parties. Period.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <Globe className="h-6 w-6 text-green-500" />
              <h3 className="font-semibold text-white">Fair Usage</h3>
              <p className="text-sm text-gray-500 font-light">
                Global reach with localized compliance for Kenya.
              </p>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="space-y-10 prose prose-invert max-w-none">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
              <p className="leading-relaxed">
                Welcome to Sherehe Tickets Kenya. These Terms and Conditions
                govern your use of our website and services. By accessing or
                using our platform as an Event Organizer, you agree to be bound
                by these terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">
                2. Organizer Responsibilities
              </h2>
              <p className="leading-relaxed">
                As an event organizer, you are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-400">
                <li>Providing accurate event information and pricing.</li>
                <li>
                  Honoring all valid tickets purchased through the platform.
                </li>
                <li>
                  Managing event cancellations and refunds according to your
                  stated policy.
                </li>
                <li>
                  Ensuring your events comply with local laws and regulations.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">
                3. Fees and Payments
              </h2>
              <p className="leading-relaxed">
                Sherehe Tickets Kenya charges a service fee for each ticket
                sold. These fees are disclosed during the ticket creation
                process. Payouts for event proceeds are processed according to
                our standard schedule, typically within 48-72 hours after
                successful event completion.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">
                4. Prohibited Content
              </h2>
              <p className="leading-relaxed">
                Events promoting illegal activities, hate speech, or content
                that violates intellectual property rights are strictly
                prohibited. We reserve the right to remove any event or
                organizer account that violates these standards.
              </p>
            </section>

            <section className="space-y-4 pt-10 border-t border-white/5">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[var(--mainRed)]/20 to-transparent border border-[var(--mainRed)]/20">
                <h3 className="text-xl font-bold text-white mb-2">
                  Need Clarification?
                </h3>
                <p className="text-gray-400 mb-6 font-light">
                  If you have any questions regarding these terms, our legal
                  team is here to help.
                </p>
                <Button className="bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90 text-white rounded-xl">
                  Contact Support
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="py-20 text-center opacity-20 filter grayscale">
        <div className="text-5xl font-black tracking-tighter">
          SHEREHE TICKETS
        </div>
      </div>
    </div>
  );
}
