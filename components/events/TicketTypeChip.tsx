// components/events/TicketTypeChip.tsx
"use client";

import React from "react";

interface TicketTypeChipProps {
  ticketType: {
    price: string;
    name: string;
    quantity_available?: number | null;
  };
  isLowestPrice: boolean;
}

export default function TicketTypeChip({
  ticketType,
  isLowestPrice,
}: TicketTypeChipProps) {
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return numPrice.toLocaleString("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <div
      className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium border ${
        isLowestPrice
          ? "bg-red-100 text-red-800 border-red-200"
          : "bg-muted text-muted-foreground border-border"
      }`}
    >
      <span className="font-bold">{formatPrice(ticketType.price)}</span>
      <span className="ml-2 text-xs opacity-75">{ticketType.name}</span>
      {ticketType.quantity_available !== undefined &&
        ticketType.quantity_available !== null &&
        ticketType.quantity_available <= 10 && (
          <span className="ml-3 text-xs px-2.5 py-0.5 bg-orange-100 text-orange-700 rounded-full font-semibold">
            {ticketType.quantity_available} left
          </span>
        )}
    </div>
  );
}
