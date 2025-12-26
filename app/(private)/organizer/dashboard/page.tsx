"use client";

import { useFetchAccount } from "@/hooks/accounts/actions";
import { DashboardSkeleton } from "@/components/general/LoadingComponents";

export default function OrganizerDashboardPage() {
    const {
        isLoading: isLoadingOrganizer,
        data: organizer,
        refetch: refetchOrganizer,
    } = useFetchAccount()

    if (isLoadingOrganizer) {
        return <DashboardSkeleton />
    }

    console.log(organizer)
    return (
        <div>
            <h1>Organizer Dashboard Page</h1>
        </div>
    );
}
