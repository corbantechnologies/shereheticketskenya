"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Calculator,
  QrCode,
  Smartphone,
  Users,
  Zap,
} from "lucide-react";

const features = [
  {
    title: "Real-Time Analytics",
    description:
      "Track ticket sales, revenue, and attendee demographics in real-time from your dashboard.",
    icon: BarChart3,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  // {
  //   title: "Instant Payouts",
  //   description:
  //     "Get paid instantly via M-Pesa or bank transfer. No waiting for weeks after your event ends.",
  //   icon: Zap,
  //   color: "text-amber-500",
  //   bg: "bg-amber-500/10",
  // },
  // {
  //   title: "Seamless Check-in",
  //   description:
  //     "Scan tickets at the door using our free organizer app. Keep lines moving fast and secure.",
  //   icon: QrCode,
  //   color: "text-emerald-500",
  //   bg: "bg-emerald-500/10",
  // },
  {
    title: "Marketing Tools",
    description:
      "Promote your event with built-in email marketing, discount codes, and affiliate tracking.",
    icon: Smartphone,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  // {
  //   title: "Team Management",
  //   description:
  //     "Grant access to your team members with specific roles and permissions.",
  //   icon: Users,
  //   color: "text-pink-500",
  //   bg: "bg-pink-500/10",
  // },
  {
    title: "Revenue Calculator",
    description:
      "Forecast your earnings and set optimal ticket prices with our revenue calculator.",
    icon: Calculator,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
];

export default function OrganizerFeatures() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Powerful Tools for Succesful Events
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to plan, promote, and manage your events like a
            pro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.bg}`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
