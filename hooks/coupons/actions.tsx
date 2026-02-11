"use client"

import { useQuery } from "@tanstack/react-query"
import useAxiosAuth from "../authentication/useAxiosAuth"
import { getCoupons, getCoupon } from "@/services/coupons"

export function useFetchCoupons(event_code?: string) {
    const { headers } = useAxiosAuth();

    return useQuery({
        queryKey: ["coupons", event_code],
        queryFn: () => getCoupons({ headers }, { event: event_code }),
    })
}

export function useFetchCoupon(reference: string) {
    const header = useAxiosAuth()

    return useQuery({
        queryKey: ["coupon", reference],
        queryFn: () => getCoupon(reference, header),
        enabled: !!reference,
    })
}