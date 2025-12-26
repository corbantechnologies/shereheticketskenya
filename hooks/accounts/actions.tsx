"use client"

import { useQuery } from "@tanstack/react-query"
import useUserUsername from "../authentication/useUserUsername"
import { getAccount } from "@/services/accounts"
import useAxiosAuth from "../authentication/useAxiosAuth"

export function useFetchAccount() {
    const username = useUserUsername()
    const header = useAxiosAuth()

    return useQuery({
        queryKey: ["account", username],
        queryFn: () => getAccount(username!, header),
        enabled: !!username,
    })
}