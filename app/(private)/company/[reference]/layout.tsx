// app/(private)/company/[reference]/layout.tsx
"use client";

import OrganizerNavbar from "@/components/general/OrganizerNavbar";
import { useFetchCompany } from "@/hooks/company/actions";
import { useParams } from "next/navigation";
import { DashboardSkeleton } from "@/components/general/LoadingComponents";

export default function CompanyDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { reference } = useParams<{ reference: string }>();
  const { isLoading, data: company } = useFetchCompany(reference);

  if (isLoading) {
    return (
      <>
        <div className="h-16 bg-white border-b" />{" "}
        {/* placeholder for navbar height */}
        <DashboardSkeleton />
      </>
    );
  }

  if (!company) {
    return <div className="p-8 text-center">Company not found.</div>;
  }

  return (
    <>
      <OrganizerNavbar company={company} />
      <main className="pt-16 min-h-screen bg-background">{children}</main>
    </>
  );
}
