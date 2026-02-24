"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface TicketType {
    event: string;
    name: string;
    price: string;
    quantity_available: number;
    is_limited: boolean;
    sales_start: string | null;
    sales_end: string | null;
    ticket_type_code: string;
    is_active: boolean;
    status: string; // readonly
    created_at: string;
    updated_at: string;
    reference: string;
    bookings: any[];
}

interface createTicketType {
    event: string; // Pick event code
    name: string;
    price: string;
    quantity_available: number; // Optional: if not given and is_limited is true, API automatically sets it to event capacity
    is_limited: boolean; // Optional
    sales_start: string | null; // Optional
    sales_end: string | null; // Optional
    is_active: boolean;
}

interface updateTicketType {
    event: string; // Pick event code
    name: string;
    price: string;
    quantity_available: number; // Optional: if not given and is_limited is true, API automatically sets it to event capacity
    is_limited: boolean; // Optional
    sales_start: string | null; // Optional
    sales_end: string | null; // Optional
    is_active: boolean;
}



export const getTicketTypes = async (): Promise<TicketType[]> => {
    const response: AxiosResponse<PaginatedResponse<TicketType>> =
        await apiActions.get(`/api/v1/tickettypes/`);
    return response.data.results ?? [];
};

export const getTicketType = async (ticket_type_code: string): Promise<TicketType> => {
    const response: AxiosResponse<TicketType> = await apiActions.get(
        `/api/v1/tickettypes/${ticket_type_code}/`
    );
    return response.data;
};

export const createTicketType = async (
    formData: createTicketType | FormData,
    headers: { headers: { Authorization: string } }
): Promise<TicketType> => {
    const response: AxiosResponse<TicketType> = await apiActions.post(
        `/api/v1/tickettypes/`,
        formData,
        headers
    );
    return response.data;
};

export const updateTicketType = async (
    ticket_type_code: string,
    formData: updateTicketType | FormData,
    headers: { headers: { Authorization: string } }
): Promise<TicketType> => {
    const response: AxiosResponse<TicketType> = await apiActions.patch(
        `/api/v1/tickettypes/${ticket_type_code}/`,
        formData,
        headers
    );
    return response.data;
};

export const closeTicketType = async (
    ticket_type_code: string,
    headers: { headers: { Authorization: string } }
): Promise<TicketType> => {
    const response: AxiosResponse<TicketType> = await apiActions.patch(
        `/api/v1/tickettypes/${ticket_type_code}/`,
        { is_closed: true },
        headers
    );
    return response.data;
};
