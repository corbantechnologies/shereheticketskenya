/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(private)/company/[reference]/events/create/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import CreateEvent from "@/forms/events/CreateEvent";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useFetchCompany } from "@/hooks/company/actions";
import { DashboardSkeleton } from "@/components/general/LoadingComponents";

export default function StandaloneCreateEventPage() {
  const router = useRouter();
  const { reference } = useParams<{ reference: string }>();
  const { isLoading, data: company } = useFetchCompany(reference);

  if (isLoading) return <DashboardSkeleton />;

  if (!company) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Company not found.
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header / Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </button>
      </div>

      <Card className="border-none shadow-lg bg-white overflow-hidden">
        <CardContent className="p-0">
          <CreateEvent 
            companyCode={company.company_code}
            isPage={true} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
