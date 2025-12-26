/* eslint-disable @typescript-eslint/no-explicit-any */
// app/organizer/dashboard/page.tsx
"use client";

import { useFetchAccount } from "@/hooks/accounts/actions";
import { LoadingSpinner } from "@/components/general/LoadingComponents";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, PartyPopper, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrganizerDashboardPage() {
  const router = useRouter();
  const { isLoading, data: organizer } = useFetchAccount();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (!organizer) {
    return <div className="p-8 text-center">Unable to load dashboard.</div>;
  }

  const { first_name, is_premium, companies = [] } = organizer;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Greeting */}
      <div className="bg-gradient-to-br from-[var(--mainBlue)] to-[var(--mainBlue)]/80 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back, {first_name}! 🎉
          </h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Manage your event companies and create unforgettable sherehe
            experiences.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        {/* Premium Status & Quick Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-6">
            <Badge
              variant={is_premium ? "default" : "secondary"}
              className="text-lg px-6 py-2"
            >
              {is_premium ? "Premium Organizer" : "Free Plan"}
            </Badge>
            <p className="text-muted-foreground text-lg">
              {companies.length}{" "}
              {companies.length === 1 ? "Company" : "Companies"}
            </p>
          </div>

          <Button
            size="lg"
            disabled={!is_premium}
            className="bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90 text-white shadow-lg"
            onClick={() => {
              // TODO: Open create company modal
            }}
          >
            <Plus className="mr-2 h-6 w-6" />
            Create New Company
            {!is_premium && <Lock className="ml-3 h-5 w-5" />}
          </Button>
        </div>

        {/* Companies Grid */}
        {companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {companies.map((company: any) => (
              <Card
                key={company.reference}
                className="hover:shadow-2xl transition-all duration-300 cursor-pointer border border-border bg-card hover:border-[var(--mainBlue)]/30"
                onClick={() => router.push(`/company/${company.reference}`)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
                      <AvatarImage src={company.logo || undefined} />
                      <AvatarFallback className="bg-[var(--mainRed)] text-white text-2xl font-bold">
                        <Building2 className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <PartyPopper className="h-10 w-10 text-[var(--mainRed)] opacity-30" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl mb-2">{company.name}</CardTitle>
                  <CardDescription className="text-sm mb-6">
                    {company.company_code}
                  </CardDescription>
                  <Button
                    className="w-full bg-[var(--mainBlue)] hover:bg-[var(--mainBlue)]/90 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/company/${company.reference}`);
                    }}
                  >
                    Manage Company
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <Building2 className="h-20 w-20 text-muted-foreground mb-6" />
              <CardTitle className="text-2xl mb-3">No Companies Yet</CardTitle>
              <CardDescription className="max-w-md mb-8">
                Start by creating your first event company. Premium users can
                create multiple.
              </CardDescription>
              <Button
                size="lg"
                disabled={!is_premium}
                className="bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Company
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
