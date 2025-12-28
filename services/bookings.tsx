/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";

const results: any[] = [];

interface makeBooking {
  ticket_type: string;
  quantity: number;
  name: string;
  email: string;
  phone: string;
}

interface Booking {
  name: string;
  email: string;
  phone: string;
  quantity: number;
  amount: number;
  status: string;
  booking_code: string;
  event: string;
  payment_status: string;
  payment_status_description: string;
  payment_method: string;
  confirmation_code: string;
  payment_account: string;
  currency: string;
  payment_date: string;
  mpesa_receipt_number: string;
  mpesa_phone_number: string;
  ticket_type: string;
  created_at: string;
  updated_at: string;
  reference: string;
  tickets: string[];
  ticket_type_info: {
    name: string;
    price: string;
    ticket_type_code: string;
  };
}

export const makeBooking = async (formData: makeBooking | FormData) => {
  await apiActions.post(`/api/v1/bookings/`, formData);
};

export const getBookings = async (): Promise<Booking[]> => {
  const response: AxiosResponse<Booking[]> = await apiActions.get(
    `/api/v1/bookings/`
  );
  return response.data.results || [];
};

export const getBooking = async (reference: string): Promise<Booking> => {
  const response: AxiosResponse<Booking> = await apiActions.get(
    `/api/v1/bookings/${reference}/`
  );
  return response.data;
};
