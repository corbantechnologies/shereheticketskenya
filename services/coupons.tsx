"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";

interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface Coupon {
    id: string;
    manager: string;
    event: string;
    ticket_type: string[];
    name: string;
    code: string;
    discount_value: string;
    discount_type: string;
    valid_from: string;
    valid_to: string;
    usage_limit: number;
    usage_count: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    reference: string;
    email: string | null;
    event_details: {
        company: string;
        event_code: string;
        name: string;
        start_date: string;
        end_date: string | null;
    };
    ticket_type_details: {
        ticket_type_code: string;
        name: string;
        price: string;
    }[];
}

interface createCoupon {
    event: string; // event_code
    ticket_type: string[]; // ticket_type_code, optional, can be more than one
    name: string; //optional
    discount_type: string;
    discount_value: string;
    valid_from: string;
    valid_to: string;
    usage_limit: number; //optional; leave blank for unlimited
    is_active: boolean;
}

interface updateCoupon {
    name: string; //optional
    discount_type: string;
    discount_value: string;
    valid_from: string;
    valid_to: string;
    usage_limit: number; //optional; leave blank for unlimited
    is_active: boolean;
}

interface validateCoupon {
    code: string;
    event_code: string;
    ticket_type_code: string; // optional
}

// Authenticated Views
export const createCoupon = async (
    formData: createCoupon | FormData,
    headers: { headers: { Authorization: string } }
): Promise<Coupon> => {
    const response: AxiosResponse<Coupon> = await apiActions.post(
        `/api/v1/coupons/`,
        formData,
        headers
    );
    return response.data;
};

export const updateCoupon = async (
    reference: string,
    formData: updateCoupon | FormData,
    headers: { headers: { Authorization: string } }
): Promise<Coupon> => {
    const response: AxiosResponse<Coupon> = await apiActions.patch(
        `/api/v1/coupons/${reference}/`,
        formData,
        headers
    );
    return response.data;
};

export const getCoupons = async (
    headers: { headers: { Authorization: string } }
): Promise<Coupon[]> => {
    const response: AxiosResponse<PaginatedResponse<Coupon>> =
        await apiActions.get(`/api/v1/coupons/`, headers);
    return response.data.results ?? [];
};

export const getCoupon = async (reference: string, headers: { headers: { Authorization: string } }): Promise<Coupon> => {
    const response: AxiosResponse<Coupon> = await apiActions.get(
        `/api/v1/coupons/${reference}/`,
        headers
    );
    return response.data;
};

// Public


export const validateCoupon = async (
    formData: validateCoupon | FormData,
): Promise<Coupon> => {
    const response: AxiosResponse<Coupon> = await apiActions.post(
        `/api/v1/coupons/validate/`,
        formData,
    );
    return response.data;
};

