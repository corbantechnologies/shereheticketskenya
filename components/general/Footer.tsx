"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-12 border-t border-zinc-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Sherehe Tickets</h3>
            <p className="text-sm leading-relaxed">
              Your premier platform for discovering and booking the most
              exciting events in Kenya. From concerts to conferences, we&apos;ve
              got you covered.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="#" className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Discover</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/events"
                  className="hover:text-white transition-colors"
                >
                  Browse Events
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/categories"
                  className="hover:text-white transition-colors"
                >
                  Categories
                </Link>
              </li> */}
              <li>
                <Link
                  href="/cities"
                  className="hover:text-white transition-colors"
                >
                  Cities
                </Link>
              </li>
              <li>
                <Link
                  href="/today"
                  className="hover:text-white transition-colors"
                >
                  Happening Today
                </Link>
              </li>
            </ul>
          </div>

          {/* For Organizers */}
          <div>
            <h4 className="text-white font-semibold mb-6">Organizers</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/login"
                  className="hover:text-white transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/signup/organizer"
                  className="hover:text-white transition-colors"
                >
                  Create Account
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="hover:text-white transition-colors"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[var(--mainRed)] shrink-0" />
                <span>Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[var(--mainRed)] shrink-0" />
                <span>+254 710 584 581</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[var(--mainRed)] shrink-0" />
                <span>support@sherehe.co.ke</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>
            © {new Date().getFullYear()} Sherehe Tickets Kenya. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/terms-and-conditions"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
