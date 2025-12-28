"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";

interface Event {
  reference: string;
  event_code: string;
  name: string;
  description: string;
  image: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  company: string;
  poster: string;
  created_at: string;
  updated_at: string;
  cancellation_policy: string;
  capacity: number;
  is_closed: boolean;

  ticket_types: {
    name: string;
    price: string;
    quantity_available: number;
    is_limited: boolean;
    ticket_type_code: string;
    reference: string;
    bookings: string[];
  }[];
}

interface createEvent {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  venue: string;
  company: string;
  poster: File;
}

interface updateEvent {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  venue: string;
  company: string;
  poster: File;
  is_closed: boolean;
}

export const getEvents = async (): Promise<Event[]> => {
  const response: AxiosResponse<Event[]> = await apiActions.get(
    `/api/v1/events/`
  );
  return response.data.results || [];
};

export const getEvent = async (event_code: string): Promise<Event> => {
  const response: AxiosResponse<Event> = await apiActions.get(
    `/api/v1/events/${event_code}/`
  );
  return response.data;
};

// Authenticated
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
