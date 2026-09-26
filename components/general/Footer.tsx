"use client";

import React from "react";
import Link from "next/link";
import {
  Ticket,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Smartphone,
  Heart,
  ExternalLink,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12 font-sans">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-rose-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Ticket className="h-4 w-4 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Sherehe<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-rose-400">Tickets</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Kenya’s premier event discovery and ticketing platform. Powering concerts, festivals, tech conferences, and campus gatherings with instant M-Pesa checkout, tamper-proof QR passes, and mobile gate verification.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" /> 100% Verified Passes
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                <Smartphone className="h-3.5 w-3.5" /> Instant M-Pesa STK
              </span>
            </div>
          </div>

          {/* Discover Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">Discover</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/events" className="hover:text-cyan-400 transition-colors">
                  All Upcoming Events
                </Link>
              </li>
              <li>
                <Link href="/events?category=Concerts" className="hover:text-cyan-400 transition-colors">
                  Concerts & Live Music
                </Link>
              </li>
              <li>
                <Link href="/events?category=Festivals" className="hover:text-cyan-400 transition-colors">
                  Festivals & Nightlife
                </Link>
              </li>
              <li>
                <Link href="/events?category=Tech" className="hover:text-cyan-400 transition-colors">
                  Tech & Business Summits
                </Link>
              </li>
              <li>
                <Link href="/events?category=Sports" className="hover:text-cyan-400 transition-colors">
                  Sports & Outdoor Fitness
                </Link>
              </li>
            </ul>
          </div>

          {/* For Organizers */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">For Organizers</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/organizers" className="hover:text-rose-400 transition-colors">
                  Why Host with Sherehe
                </Link>
              </li>
              <li>
                <Link href="/signup/organizer" className="hover:text-rose-400 transition-colors">
                  Create Organizer Account
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-rose-400 transition-colors">
                  Organizer Sign In
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-rose-400 transition-colors">
                  Platform Pricing (3.5%)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">Support</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-blue-400" />
                <span>support@sherehe.co.ke</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-rose-400" />
                <span>Nairobi, Kenya</span>
              </li>
              <li className="pt-2">
                <Link href="/terms-and-conditions" className="hover:text-slate-200 transition-colors">
                  Terms & Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Sherehe Tickets Kenya. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Part of the</span>
            <a
              href="https://corbantechnologies.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline font-semibold flex items-center gap-1"
            >
              Corban Technologies
              <ExternalLink className="h-3 w-3" />
            </a>
            <span>Ecosystem</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
