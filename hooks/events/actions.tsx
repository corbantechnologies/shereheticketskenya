"use client";

import { getEvents, getEvent } from "@/services/events";
import { useQuery } from "@tanstack/react-query";

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
