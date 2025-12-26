"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";

interface Event {
  reference: string;
  event_code: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  venue: string;
  company: string;
  poster: string;
  created_at: string;
  updated_at: string;
  ticket_types: {
    name: string;
    price: string;
    quantity_available: number;
    is_limited: boolean;
  }[];
  is_closed: boolean;
}

interface createEvent {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  venue: string;
  company: string;
  poster: string;
}

interface updateEvent {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  venue: string;
  company: string;
  poster: string;
  is_closed: boolean;
}

export const getEvents = async (): Promise<Event[]> => {
  const response: AxiosResponse<Event[]> = await apiActions.get(
    `/api/v1/event/`
  );
  return response.data;
};

export const getEvent = async (event_code: string): Promise<Event> => {
  const response: AxiosResponse<Event> = await apiActions.get(
    `/api/v1/event/${event_code}/`
  );
  return response.data;
};

// Authenticated
export const createEvent = async (
  data: createEvent,
  headers: { headers: { Authorization: string } }
): Promise<Event> => {
  const response: AxiosResponse<Event> = await apiActions.post(
    `/api/v1/event/`,
    data,
    headers
  );
  return response.data;
};

export const updateEvent = async (
  event_code: string,
  data: updateEvent,
  headers: { headers: { Authorization: string } }
): Promise<Event> => {
  const response: AxiosResponse<Event> = await apiActions.patch(
    `/api/v1/event/${event_code}/`,
    data,
    headers
  );
  return response.data;
};

export const closeEvent = async (
  event_code: string,
  headers: { headers: { Authorization: string } }
): Promise<Event> => {
  const response: AxiosResponse<Event> = await apiActions.patch(
    `/api/v1/event/${event_code}/`,
    { is_closed: true },
    headers
  );
  return response.data;
};
