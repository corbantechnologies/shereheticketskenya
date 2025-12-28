"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  Lock,
  Globe,
  Calendar,
  CreditCard,
  Percent,
  Building2,
  Ban,
  Scale,
} from "lucide-react";
import Footer from "@/components/general/Footer";

export default function OrganizerTermsAndConditions() {
  return (
    <>
      <div className="min-h-screen bg-[#0A0A0B] text-gray-300">
        {/* Header */}
        <div className="border-b border-white/5 bg-white/5 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <div className="text-sm font-bold tracking-tighter text-white">
              SHEREHE <span className="text-[var(--mainRed)]">PLATFORM</span>
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
                Terms & Conditions for Event Organizers
              </h1>
              <p className="text-gray-500">Last updated: December 28, 2025</p>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <ShieldCheck className="h-6 w-6 text-[var(--mainRed)]" />
                <h3 className="font-semibold text-white">Secure Payments</h3>
                <p className="text-sm text-gray-500 font-light">
                  All ticket funds collected centrally and disbursed reliably.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <Percent className="h-6 w-6 text-green-500" />
                <h3 className="font-semibold text-white">Transparent Fees</h3>
                <p className="text-sm text-gray-500 font-light">
                  10% commission for free accounts, 5% for premium.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <Scale className="h-6 w-6 text-[var(--mainBlue)]" />
                <h3 className="font-semibold text-white">
                  Your Responsibility
                </h3>
                <p className="text-sm text-gray-500 font-light">
                  Clear cancellation policies and full event compliance.
                </p>
              </div>
            </div>

            {/* Detailed Sections */}
            <div className="space-y-10 prose prose-invert max-w-none">
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--mainRed)]/20 text-[var(--mainRed)] text-sm font-bold">
                    1
                  </span>
                  Introduction
                </h2>
                <p className="leading-relaxed">
                  These Terms and Conditions govern your use of the Sherehe
                  Platform as an Event Organizer. The Platform is operated by
                  Corban Technologies LTD, a company incorporated in Kenya. By
                  creating an account or listing events, you agree to be bound
                  by these Terms.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--mainRed)]/20 text-[var(--mainRed)] text-sm font-bold">
                    2
                  </span>
                  Account & Companies
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-400">
                  <li>
                    A default Company profile is created automatically when you
                    register as an Organizer.
                  </li>
                  <li>
                    You must update and maintain accurate Company details (name,
                    contacts, tax info, payout account).
                  </li>
                  <li>
                    Free accounts: limited to 1 Company with unlimited events.
                  </li>
                  <li>Premium accounts: multiple Companies allowed.</li>
                  <li>
                    You are responsible for all activity under your account.
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--mainRed)]/20 text-[var(--mainRed)] text-sm font-bold">
                    3
                  </span>
                  Event Responsibilities
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-400">
                  <li>
                    Provide accurate event details, pricing, dates, and venue
                    information.
                  </li>
                  <li>
                    Ensure events comply with all Kenyan laws and regulations
                    (permits, licenses, safety).
                  </li>
                  <li>Honor all valid tickets sold through the Platform.</li>
                  <li>
                    Prohibited: illegal activities, hate speech, fraud, or IP
                    violations.
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--mainRed)]/20 text-[var(--mainRed)] text-sm font-bold">
                    4
                  </span>
                  Commissions & Fees
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                  <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-3xl font-bold text-white mb-2">
                      10%
                    </div>
                    <p className="text-gray-400">Free Account Commission</p>
                  </div>
                  <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-3xl font-bold text-white mb-2">5%</div>
                    <p className="text-gray-400">Premium Account Commission</p>
                  </div>
                </div>
                <p className="text-gray-400">
                  Additional payment gateway fees may apply and will be deducted
                  from gross sales.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--mainRed)]/20 text-[var(--mainRed)] text-sm font-bold">
                    5
                  </span>
                  Settlements & Payouts
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-400">
                  <li>Funds disbursed whichever comes first:</li>
                  <li className="ml-6">
                    • Weekly on Fridays (for sales from previous Saturday to
                    Thursday noon)
                  </li>
                  <li className="ml-6">
                    • When an event reaches Ksh 100,000 in ticket sales
                  </li>
                  <li>
                    Net proceeds = gross sales minus commissions, fees, refunds,
                    and chargebacks.
                  </li>
                  <li>You must provide accurate payout details.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--mainRed)]/20 text-[var(--mainRed)] text-sm font-bold">
                    6
                  </span>
                  Cancellations & Refunds
                </h2>
                <p className="leading-relaxed text-gray-400">
                  You must clearly specify cancellation and refund policies for
                  each event. Sherehe Platform and Corban Technologies LTD are
                  not liable for any complaints, disputes, or losses arising
                  from event cancellations, changes, or refunds.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--mainRed)]/20 text-[var(--mainRed)] text-sm font-bold">
                    7
                  </span>
                  Limitation of Liability
                </h2>
                <p className="leading-relaxed text-gray-400">
                  The Platform is provided “as is”. We are not liable for
                  indirect or consequential damages. You indemnify us against
                  claims arising from your events or violations of these Terms.
                </p>
              </section>

              <section className="space-y-4 pt-10 border-t border-white/5">
                <div className="p-8 rounded-3xl bg-gradient-to-br from-[var(--mainRed)]/20 to-transparent border border-[var(--mainRed)]/20">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Questions about these Terms?
                  </h3>
                  <p className="text-gray-400 mb-6 font-light">
                    Our support team is ready to assist you with any
                    clarification needed.
                  </p>
                  <Button className="bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90 text-white rounded-xl">
                    Contact Support
                  </Button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
