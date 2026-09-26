// app/(private)/layout.tsx
import React from "react";
import PortalShell from "@/components/portal/PortalShell";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
