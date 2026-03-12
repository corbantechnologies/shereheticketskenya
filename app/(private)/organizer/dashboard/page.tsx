/* eslint-disable @typescript-eslint/no-explicit-any */
// app/organizer/dashboard/page.tsx
"use client";

import { useFetchAccount } from "@/hooks/accounts/actions";
import { LoadingSpinner } from "@/components/general/LoadingComponents";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, Plus, Lock, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrganizerDashboardPage() {
  const router = useRouter();
  const { isLoading, data: organizer } = useFetchAccount();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#d5d5d5]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!organizer) {
    return (
      <div className="min-h-screen bg-[#d5d5d5] flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Unable to load dashboard.</p>
      </div>
    );
  }

  const { first_name, last_name, email, is_premium, companies = [] } = organizer;

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Organizer Portal</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage your event companies and settings.
            </p>
          </div>

          <Button
            disabled={!is_premium}
            className="bg-[var(--mainBlue)] hover:bg-[var(--mainBlue)]/90 text-white text-sm h-9 self-start sm:self-auto"
            onClick={() => {
              // TODO: Open create company modal
            }}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New company
            {!is_premium && <Lock className="h-3.5 w-3.5 ml-2" />}
          </Button>
        </div>

        {/* Profile + plan card */}
        <Card className="py-0 border-none shadow-lg bg-white">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="h-10 w-10">
                <AvatarImage src={undefined} />
                <AvatarFallback className="bg-[var(--mainBlue)]/10 text-[var(--mainBlue)] text-sm font-semibold">
                  {first_name?.[0]}{last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {first_name} {last_name}
                </p>
                <p className="text-xs text-muted-foreground">{email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={is_premium ? "default" : "secondary"}
                className={`text-xs px-2.5 py-0.5 ${is_premium ? "bg-[var(--mainBlue)] text-white" : ""}`}
              >
                {is_premium ? "Premium" : "Free plan"}
              </Badge>
              {!is_premium && (
                <p className="text-xs text-muted-foreground">
                  Upgrade to unlock multiple companies &amp; more.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Companies section */}
        <Card className="py-0 border-none shadow-lg bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">
                Companies
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  {companies.length} {companies.length === 1 ? "company" : "companies"}
                </span>
              </h2>
            </div>

            {companies.length > 0 ? (
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/40 border-b border-gray-200">
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Company</th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hidden sm:table-cell">Code</th>
                      <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {companies.map((company: any) => (
                      <tr
                        key={company.reference}
                        className="hover:bg-muted/20 transition-colors cursor-pointer"
                        onClick={() => router.push(`/company/${company.reference}`)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarImage src={company.logo || undefined} />
                              <AvatarFallback className="bg-[var(--mainRed)]/10 text-[var(--mainRed)] text-xs font-semibold">
                                <Building2 className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground text-sm">{company.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell font-mono">
                          {company.company_code}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            className="inline-flex items-center gap-1 text-xs text-[var(--mainBlue)] hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/company/${company.reference}`);
                            }}
                          >
                            Manage <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">No companies yet</p>
                <p className="text-xs text-muted-foreground mb-4 max-w-xs">
                  {is_premium
                    ? "Create your first event company to get started."
                    : "Upgrade to premium to create your first event company."}
                </p>
                <Button
                  size="sm"
                  disabled={!is_premium}
                  className="bg-[var(--mainBlue)] hover:bg-[var(--mainBlue)]/90 text-white text-xs h-8"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Create company
                  {!is_premium && <Lock className="h-3 w-3 ml-1.5" />}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>



      </div>
    </div>
  );
}
