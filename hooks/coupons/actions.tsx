"use client"

import { useQuery } from "@tanstack/react-query"
import useAxiosAuth from "../authentication/useAxiosAuth"
import { getCoupons, getCoupon } from "@/services/coupons"

export function useFetchCoupons() {
    const header = useAxiosAuth()

    return useQuery({
        queryKey: ["coupons"],
        queryFn: () => getCoupons(header),
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