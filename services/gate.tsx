"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";

export interface ScanResult {
  status: "VALID" | "ALREADY_USED" | "INVALID_EVENT" | "NOT_FOUND" | "UNPAID" | "UNAUTHORIZED";
  message?: string;
  error?: string;
  attendee_name?: string;
  phone?: string;
  email?: string;
  ticket_type?: string;
  price?: string;
  booking_code?: string;
  ticket_code?: string;
  reference?: string;
  checked_in_at?: string;
  gate_station?: string;
  first_used_at?: string;
  first_gate_station?: string;
}

export interface GateStats {
  event_name: string;
  event_code: string;
  gate_passcode?: string;
  total_sold: number;
  total_checked_in: number;
  remaining: number;
  check_in_rate_percent: number;
  tier_breakdown: {
    ticket_type_code: string;
    name: string;
    price: string;
    sold: number;
    checked_in: number;
    remaining: number;
  }[];
  recent_logs: {
    status: string;
    scanned_code: string;
    gate_station: string;
    created_at: string;
    attendee_name: string | null;
    ticket_type: string | null;
  }[];
}

export interface AttendeeSearchResult {
  reference: string;
  ticket_code: string;
  is_used: boolean;
  used_at: string | null;
  gate_station: string;
  attendee_name: string;
  phone: string;
  email: string;
  ticket_type: string;
  booking_code: string;
  mpesa_receipt: string | null;
}

export const scanTicket = async (
  event_code: string,
  payload: { qr_data?: string; ticket_code?: string; gate_station?: string; gate_passcode?: string },
  headers?: any
): Promise<AxiosResponse<ScanResult>> => {
  return await apiActions.post(
    `/api/v1/events/${event_code}/scan/`,
    payload,
    headers ? { headers } : undefined
  );
};

export const fetchGateStats = async (
  event_code: string,
  gate_passcode?: string,
  headers?: any
): Promise<AxiosResponse<GateStats>> => {
  return await apiActions.get(`/api/v1/events/${event_code}/gate-stats/`, {
    headers,
    params: gate_passcode ? { gate_passcode } : undefined,
  });
};

export const searchGateAttendees = async (
  event_code: string,
  query: string,
  gate_passcode?: string,
  headers?: any
): Promise<AxiosResponse<{ results: AttendeeSearchResult[]; count: number }>> => {
  return await apiActions.get(`/api/v1/events/${event_code}/attendees/`, {
    headers,
    params: { q: query, gate_passcode },
  });
};

export const manualGateCheckIn = async (
  event_code: string,
  ticket_reference: string,
  gate_station: string = "Manual Desk",
  gate_passcode?: string,
  headers?: any
): Promise<AxiosResponse<ScanResult>> => {
  return await apiActions.post(
    `/api/v1/events/${event_code}/manual-checkin/`,
    { ticket_reference, gate_station, gate_passcode },
    headers ? { headers } : undefined
  );
};
