// app/(private)/company/[reference]/page.tsx
"use client"

import { useFetchCompany } from "@/hooks/company/actions";
import { useParams } from "next/navigation";

export default function CompanyDetailPage() {
const {reference} : {reference: string} = useParams();
const {
    isLoading,
    error,
    data: company
} = useFetchCompany(reference);


    return (
        <div>
            <h1>Company Page</h1>
        </div>
    )
}
