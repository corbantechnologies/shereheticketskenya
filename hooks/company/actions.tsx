"use client"

import { useQuery } from "@tanstack/react-query"
import useAxiosAuth from "../authentication/useAxiosAuth"
import { getCompanies, getCompany } from "@/services/company"

export function useFetchCompanies() {
    const header = useAxiosAuth()

    return useQuery({
        queryKey: ["companies"],
        queryFn: () => getCompanies(header),
    })
}

export function useFetchCompany(reference: string) {
    const header = useAxiosAuth()

    return useQuery({
        queryKey: ["company", reference],
        queryFn: () => getCompany(reference, header),
        enabled: !!reference,
    })
}