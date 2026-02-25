"use client";

import { getEvents, getEvent, getCompanyEvents, getCompanyEvent } from "@/services/events";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";

export function useFetchEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => getEvents(),
  });
}

export function useFetchEvent(event_code: string) {
  return useQuery({
    queryKey: ["event", event_code],
    queryFn: () => getEvent(event_code),
    enabled: !!event_code,
  });
}


export function useFetchCompanyEvents() {
  const token = useAxiosAuth();
  return useQuery({
    queryKey: ["company-events"],
    queryFn: () => getCompanyEvents(token),
  });
}

export function useFetchCompanyEvent(event_code: string) {
  const token = useAxiosAuth();
  return useQuery({
    queryKey: ["company-event", event_code],
    queryFn: () => getCompanyEvent(event_code, token),
    enabled: !!event_code,
  });
}


