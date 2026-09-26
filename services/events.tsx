"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { TicketType } from "./tickettypes";
import { Coupon } from "./coupons";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface Event {
  reference: string;
  event_code: string;
  name: string;
  description: string; // a short detail about the event
  content: any; // a long detail about the event
  image: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  company: string;
  created_at: string;
  updated_at: string;
  refund_policy: any;
  capacity: number;
  is_published: boolean;
  is_closed: boolean;
  category?: string;
  gate_passcode?: string;
  platform_fee_percent?: number;
  ticket_types: TicketType[];
  coupons: Coupon[];
  tickets_sold: number;
}

interface createEvent {
  name: string;
  description: string; // short description about the event
  content: any; // long description about the event - this is rich text
  start_date: string;
  start_time: string; // Optional
  end_date: string; // Optional
  end_time: string; // Optional
  venue: string;
  company: string; // Pick company code
  image: File;
  is_published: boolean;
  refund_policy: any; // rich text
}

interface updateEvent {
  name: string;
  description: string; // short description about the event
  content: any; // long description about the event - this is rich text
  start_date: string;
  start_time: string; // Optional
  end_date: string; // Optional
  end_time: string; // Optional
  venue: string;
  capacity: number; // Optional
  company: string; // Pick company code
  image: File;
  is_published: boolean;
  is_closed: boolean;
  refund_policy: any; // rich text
}

export const getEvents = async (): Promise<Event[]> => {
  const response: AxiosResponse<PaginatedResponse<Event>> =
    await apiActions.get(`/api/v1/events/`);
  return response.data.results ?? [];
};

export const getEvent = async (event_code: string): Promise<Event> => {
  const response: AxiosResponse<Event> = await apiActions.get(
    `/api/v1/events/${event_code}/`
  );
  return response.data;
};

// Authenticated
export const getCompanyEvents = async (
  headers: { headers: { Authorization: string } }
): Promise<Event[]> => {
  const response: AxiosResponse<PaginatedResponse<Event>> =
    await apiActions.get(`/api/v1/events/`, headers);
  return response.data.results ?? [];
};

export const getCompanyEvent = async (
  event_code: string,
  headers: { headers: { Authorization: string } }
): Promise<Event> => {
  const response: AxiosResponse<Event> = await apiActions.get(
    `/api/v1/events/${event_code}/`,
    headers
  );
  return response.data;
};


export const createEvent = async (
  formData: createEvent | FormData,
  headers: { headers: { Authorization: string } }
): Promise<Event> => {
  const response: AxiosResponse<Event> = await apiActions.post(
    `/api/v1/events/`,
    formData,
    headers
  );
  return response.data;
};

export const updateEvent = async (
  event_code: string,
  formData: updateEvent | FormData,
  headers: { headers: { Authorization: string } }
): Promise<Event> => {
  const response: AxiosResponse<Event> = await apiActions.patch(
    `/api/v1/events/${event_code}/`,
    formData,
    headers
  );
  return response.data;
};

export const publishEvent = async (
  event_code: string,
  headers: { headers: { Authorization: string } }
): Promise<Event> => {
  const response: AxiosResponse<Event> = await apiActions.patch(
    `/api/v1/events/${event_code}/`,
    { is_published: true },
    headers
  );
  return response.data;
};

export const unpublishEvent = async (
  event_code: string,
  headers: { headers: { Authorization: string } }
): Promise<Event> => {
  const response: AxiosResponse<Event> = await apiActions.patch(
    `/api/v1/events/${event_code}/`,
    { is_published: false },
    headers
  );
  return response.data;
};

export const closeEvent = async (
  event_code: string,
  headers: { headers: { Authorization: string } }
): Promise<Event> => {
  const response: AxiosResponse<Event> = await apiActions.patch(
    `/api/v1/events/${event_code}/`,
    { is_closed: true },
    headers
  );
  return response.data;
};

export interface EventSettlementData {
  event_code: string;
  event_name: string;
  gate_passcode?: string;
  total_tickets_sold: number;
  gross_sales: number;
  platform_fee_percent: number;
  platform_fee_amount: number;
  net_event_revenue: number;
  disbursed_amount: number;
  pending_amount: number;
  withdrawable_balance: number;
  sales_velocity: { date: string; revenue: number; tickets: number }[];
  recent_payouts: {
    reference: string;
    amount_requested: number;
    platform_fee_deducted: number;
    net_payout_amount: number;
    payout_phone: string;
    status: string;
    mpesa_transaction_id?: string;
    notes?: string;
    created_at: string;
    disbursed_at?: string;
  }[];
}

export const getEventSettlement = async (
  event_code: string,
  headers: { headers: { Authorization: string } }
): Promise<EventSettlementData> => {
  const response: AxiosResponse<EventSettlementData> = await apiActions.get(
    `/api/v1/events/${event_code}/settlement/`,
    headers
  );
  return response.data;
};

export const requestEventPayout = async (
  event_code: string,
  data: { amount: number; phone_number: string; notes?: string },
  headers: { headers: { Authorization: string } }
) => {
  const response = await apiActions.post(
    `/api/v1/events/${event_code}/payout-request/`,
    data,
    headers
  );
  return response.data;
};
