"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { TicketType } from "./tickettypes";

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
  description: string;
  image: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  company: string;
  created_at: string;
  updated_at: string;
  cancellation_policy: string;
  capacity: number;
  is_published: boolean;
  is_closed: boolean;
  ticket_types: TicketType[];
}

interface createEvent {
  name: string;
  description: string;
  start_date: string;
  start_time: string; // Optional
  end_date: string; // Optional
  end_time: string; // Optional
  venue: string;
  company: string; // Pick company code
  image: File;
  is_published: boolean;
  cancellation_policy: string;
}

interface updateEvent {
  name: string;
  description: string;
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
  cancellation_policy: string;
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
