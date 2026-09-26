"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  QrCode,
  Tag,
  DollarSign,
  Users,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface GuideSection {
  id: string;
  title: string;
  badge: string;
  icon: React.ElementType;
  summary: string;
  steps: { title: string; desc: string }[];
  proTip?: string;
}

const guides: GuideSection[] = [
  {
    id: "events",
    title: "1. Creating & Publishing Events",
    badge: "Basics",
    icon: Calendar,
    summary:
      "Set up your event identity, dates, venue, capacity, and release customized ticket tiers to begin selling.",
    steps: [
      {
        title: "Create Organization & Event",
        desc: "Navigate to your company and click 'Create Event'. Upload high-resolution cover banners (Cloudinary optimized) and input dates, venue, and descriptions.",
      },
      {
        title: "Configure Ticket Tiers",
        desc: "Add multiple tiers (e.g., Early Bird, Regular, VIP, VVIP). Set individual ticket prices (KES), set capacity limits or unlimited tickets, and assign sale start/end dates.",
      },
      {
        title: "Publish to Marketplace",
        desc: "When ready, click 'Publish Event'. Your event will instantly appear on the Sherehe public marketplace with real-time M-Pesa STK push checkout.",
      },
    ],
    proTip:
      "Tiers with a 'Sales End' date will automatically change status to 'Ended' when the cutoff arrives, automatically switching buyers to the next tier.",
  },
  {
    id: "gate",
    title: "2. Gate Entry & Bouncer Scanner Station",
    badge: "Gate Ops",
    icon: QrCode,
    summary:
      "Enable your gate bouncers and ushers to scan attendee QR codes on any smartphone with zero logins required.",
    steps: [
      {
        title: "Locate Your Gate Passcode",
        desc: "Every event has an auto-generated 6-character Gate PIN (e.g. 'SH-48210') visible on your event dashboard.",
      },
      {
        title: "Share the Bouncer URL",
        desc: "Copy and share the standalone gate link (e.g. 'sherehe.co.ke/gate/[event_code]?pin=SH-48210') directly to your ushers via WhatsApp.",
      },
      {
        title: "Real-time Verification & Duplicate Detection",
        desc: "Gate staff point their camera at attendee passes. Green chimes confirm valid tickets, while duplicates display exact scan timestamps and gate stations to prevent fraud.",
      },
      {
        title: "Manual Search Desk",
        desc: "If an attendee's phone battery died, gate staff can switch to the 'Search Attendee' tab and look them up by phone number or name for manual check-in.",
      },
    ],
    proTip:
      "Bouncers never need an organizer login account; the gate PIN grants fast, restricted scanning access only for your event.",
  },
  {
    id: "coupons",
    title: "3. Coupons & Affiliate Marketing",
    badge: "Growth",
    icon: Tag,
    summary:
      "Run discount promotions and track influencer ticket sales with granular promo code campaigns.",
    steps: [
      {
        title: "Create Promo Code",
        desc: "Go to your event dashboard's 'Coupons' tab and click 'New Coupon'. Choose either a Percentage discount (e.g., 15%) or a Fixed discount (e.g., KES 200 off).",
      },
      {
        title: "Apply Target Scope & Limits",
        desc: "Scope the code to specific ticket types (e.g., VIP only) or all tiers. Set an optional usage cap (e.g., first 50 claims) and validity expiry dates.",
      },
      {
        title: "Track Conversion Telemetry",
        desc: "View real-time metrics showing exactly how many tickets were sold and orders generated per affiliate code.",
      },
    ],
    proTip:
      "Use custom codes for promoters (e.g. 'DJJOE10', 'CAMPUSVIP') to attribute sales directly to specific team members.",
  },
  {
    id: "settlement",
    title: "4. Revenue, Financials & M-Pesa Payouts",
    badge: "Finance",
    icon: DollarSign,
    summary:
      "Monitor sales velocity, track platform commissions, and request disbursements straight to your Safaricom M-Pesa.",
    steps: [
      {
        title: "Automated Financial Ledger",
        desc: "Gross revenue is calculated automatically from confirmed M-Pesa bookings. The standard 3.5% platform commission is automatically deducted.",
      },
      {
        title: "Sales Velocity Charting",
        desc: "Monitor your 14-day rolling sales volume on the live interactive Recharts telemetry graph.",
      },
      {
        title: "Request Instant Payout",
        desc: "Click 'Request Payout' in the Financials tab, enter your preferred amount and recipient Safaricom phone number. Disbursed funds are credited directly to your M-Pesa.",
      },
    ],
    proTip:
      "Your Withdrawable Balance dynamically recalculates after deducting pending or previously disbursed payout requests.",
  },
];

export default function OrganizerGuides() {
  const [openSection, setOpenSection] = useState<string | null>("events");

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <Card className="py-0 border-none shadow-lg bg-white overflow-hidden">
      <CardContent className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-[var(--mainBlue)]">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Organizer Field Guide & Knowledge Base
              </h2>
              <p className="text-xs text-slate-500">
                Essential workflows to master your events, gate scanning, promo codes, and payouts.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs text-blue-600 bg-blue-50 border-blue-200 self-start sm:self-auto">
            Interactive Handbook
          </Badge>
        </div>

        {/* Guide Accordion Items */}
        <div className="space-y-3 pt-1">
          {guides.map((guide) => {
            const isOpen = openSection === guide.id;
            const Icon = guide.icon;

            return (
              <div
                key={guide.id}
                className="border border-slate-200/80 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(guide.id)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 bg-slate-50/70 hover:bg-slate-100/70 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-200 text-slate-800">
                      <Icon className="h-4 w-4 text-[var(--mainBlue)]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{guide.title}</span>
                        <Badge className="text-[10px] px-2 py-0 bg-slate-200 text-slate-700 hover:bg-slate-200 font-semibold">
                          {guide.badge}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
                        {guide.summary}
                      </p>
                    </div>
                  </div>
                  <div className="text-slate-400">
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 bg-white border-t border-slate-100 space-y-4 animate-in fade-in duration-150">
                    <p className="text-xs text-slate-600 sm:hidden">{guide.summary}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {guide.steps.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-slate-50/80 border border-slate-100 space-y-1"
                        >
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 text-[var(--mainBlue)] text-[10px]">
                              {idx + 1}
                            </span>
                            <span>{step.title}</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed pl-5.5">
                            {step.desc}
                          </p>
                        </div>
                      ))}
                    </div>

                    {guide.proTip && (
                      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900">
                        <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-amber-950">Pro Tip: </span>
                          <span className="text-amber-800">{guide.proTip}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
