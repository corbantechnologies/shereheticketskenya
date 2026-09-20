// app/(private)/company/[reference]/events/[event_code]/scan/page.tsx
"use client";

import React from "react";
import { useParams } from "next/navigation";
import GateScannerView from "@/components/gate/GateScannerView";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { useFetchCompanyEvent } from "@/hooks/events/actions";

export default function CompanyEventScanPage() {
  const { reference, event_code } = useParams<{ reference: string; event_code: string }>();
  const authHeaders = useAxiosAuth();
  const { data: event } = useFetchCompanyEvent(event_code);

  return (
    <GateScannerView
      eventCode={event_code}
      eventName={event?.name}
      gatePasscode={event?.gate_passcode}
      authHeaders={authHeaders}
      backHref={`/company/${reference}/events/${event_code}`}
    />
  );
}
