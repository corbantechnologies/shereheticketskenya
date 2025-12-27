"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ShieldCheck, Smartphone, Zap } from "lucide-react";

const features = [
  {
    title: "Instant Booking",
    description:
      "Book your tickets in seconds with our streamlined checkout process. No queues, no hassle.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Secure Payments",
    description:
      "Your transactions are always safe with bank-level encryption and trusted payment gateways.",
    icon: ShieldCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Mobile Tickets",
    description:
      "Forget printing. Your tickets are delivered instantly to your phone and email.",
    icon: Smartphone,
    color: "text-[var(--mainBlue)]",
    bg: "bg-[var(--mainBlue)]/10",
  },
  {
    title: "Verified Events",
    description:
      "We vet every organizer to ensure you only get authentic and high-quality experiences.",
    icon: CheckCircle2,
    color: "text-[var(--mainRed)]",
    bg: "bg-[var(--mainRed)]/10",
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Why Choose Sherehe?
          </h2>
          <p className="text-muted-foreground text-lg">
            We make it easier than ever to discover, book, and enjoy the best
            events happening around you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
