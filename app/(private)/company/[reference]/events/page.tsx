/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(private)/company/[reference]/events/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useFetchCompany } from "@/hooks/company/actions";
import { DashboardSkeleton } from "@/components/general/LoadingComponents";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Calendar, ChevronDown } from "lucide-react";
import CreateEvent from "@/forms/events/CreateEvent";
import { useState, useMemo } from "react";
import CompanyEventsTable from "@/components/events/CompanyEventsTable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Modal from "@/components/ui/modal";

export default function CompanyEventsPage() {
  const { reference } = useParams<{ reference: string }>();
  const {
    isLoading,
    data: company,
    refetch: refetchCompany,
  } = useFetchCompany(reference);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  if (isLoading) return <DashboardSkeleton />;

  if (!company) {
    return <div className="p-8 text-center text-sm text-muted-foreground">Company not found.</div>;
  }

  const events = company.company_events || [];
  const hasRequiredDetails =
    company.country && company.city && company.address && company.phone;

  const now = new Date();
  const totalEvents = events.length;
  const completedEvents = events.filter(
    (e: any) => new Date(e.start_date) < now || e.is_closed
  ).length;
  const inProcessEvents = events.filter(
    (e: any) => new Date(e.start_date) >= now && !e.is_closed
  ).length;

  const filteredEvents = useMemo(() => {
    if (activeTab === "published") return events.filter((e: any) => !e.is_closed);
    if (activeTab === "draft") return events.filter((e: any) => e.is_closed);
    return events;
  }, [events, activeTab]);

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 py-6 space-y-4">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Events</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {totalEvents} {totalEvents === 1 ? "event" : "events"} under {company.name}
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            disabled={!hasRequiredDetails}
            className="h-8 text-xs bg-[var(--mainBlue)] hover:bg-[var(--mainBlue)]/90 text-white"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            New event
          </Button>
        </div>

        {/* KPI strip */}
        <Card className="py-0 border-none shadow-lg bg-white">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 divide-x divide-gray-100">
              <div className="pr-4">
                <p className="text-xs text-muted-foreground">Total events</p>
                <p className="text-2xl font-semibold text-foreground mt-0.5">{totalEvents}</p>
              </div>
              <div className="px-4">
                <p className="text-xs text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-semibold text-foreground mt-0.5">{inProcessEvents}</p>
              </div>
              <div className="pl-4">
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-2xl font-semibold text-foreground mt-0.5">{completedEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events card with toolbar + table */}
        <Card className="py-0 border-none shadow-lg bg-white overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 pt-4 pb-3 border-b border-gray-100">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-8 bg-muted/40 p-0.5">
                <TabsTrigger value="all" className="h-7 text-xs px-3">All</TabsTrigger>
                <TabsTrigger value="published" className="h-7 text-xs px-3">Published</TabsTrigger>
                <TabsTrigger value="draft" className="h-7 text-xs px-3">Draft</TabsTrigger>
              </TabsList>
            </Tabs>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border-gray-200 bg-white hover:bg-gray-50 px-3"
                >
                  <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  <ChevronDown className="h-3 w-3 ml-1.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-xs">Filter by date</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked className="text-xs">Today</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem className="text-xs">Yesterday</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem className="text-xs">Last 7 days</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem className="text-xs">Last 30 days</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table */}
          <CardContent className="p-0">
            {filteredEvents.length > 0 ? (
              <CompanyEventsTable
                events={filteredEvents}
                companyReference={company.reference}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">No events found</p>
                <p className="text-xs text-muted-foreground mb-4 max-w-xs">
                  No events match your current filter.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("all")}
                  className="h-8 text-xs border-gray-200"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </CardContent>

          {/* Pagination footer */}
          {filteredEvents.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"}
              </span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-gray-200 text-xs" disabled>&lt;</Button>
                <Button size="sm" className="h-7 w-7 p-0 bg-[var(--mainBlue)] text-white text-xs">1</Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-gray-200 text-xs" disabled>&gt;</Button>
              </div>
            </div>
          )}
        </Card>

      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <CreateEvent
          companyCode={company.company_code}
          closeModal={() => setIsCreateModalOpen(false)}
          refetchEvents={refetchCompany}
        />
      </Modal>
    </>
  );
}