/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(private)/company/[reference]/events/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useFetchCompany } from "@/hooks/company/actions";
import { DashboardSkeleton } from "@/components/general/LoadingComponents";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Calendar, ChevronDown, AlignJustify, LayoutGrid } from "lucide-react";
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
    return <div className="p-8 text-center text-gray-500">Company not found.</div>;
  }

  const events = company.company_events || [];

  const hasRequiredDetails =
    company.country && company.city && company.address && company.phone;

  const handleEventCreated = () => {
    refetchCompany();
  };

  // Derived Stats
  const totalEvents = events.length;
  const now = new Date();
  const completedEvents = events.filter((e: any) => new Date(e.start_date) < now || e.is_closed).length;
  const inProcessEvents = events.filter((e: any) => new Date(e.start_date) >= now && !e.is_closed).length;

  const filteredEvents = useMemo(() => {
    if (activeTab === "all") return events;
    if (activeTab === "published") return events.filter((e: any) => !e.is_closed);
    if (activeTab === "draft") return events.filter((e: any) => e.is_closed);
    return events;
  }, [events, activeTab]);

  return (
    <>
      <div className="min-h-screen bg-[#F4F7FC] pb-12 font-sans">
        {/* Header Area */}
        <div className="bg-white sticky top-0 z-30 shadow-sm border-b border-gray-100">
          <div className="max-w-[1600px] mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-blue-900">Events</h1>

              <Button
                onClick={() => setIsCreateModalOpen(true)}
                disabled={!hasRequiredDetails}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md px-6 py-5 shadow-lg shadow-blue-200 transition-all uppercase tracking-wide"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Event
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto p-8 space-y-8">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Total Events */}
            <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
              <CardContent className="p-0 flex h-24">
                <div className="w-1.5 h-full bg-blue-600"></div>
                <div className="flex-1 p-6 flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-800 tracking-tight">{totalEvents.toLocaleString()}</div>
                    <div className="text-sm font-medium text-gray-400 mt-1">Total Events</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completed Events */}
            <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
              <CardContent className="p-0 flex h-24">
                <div className="w-1.5 h-full bg-green-500"></div>
                <div className="flex-1 p-6 flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-800 tracking-tight">{completedEvents.toLocaleString()}</div>
                    <div className="text-sm font-medium text-gray-400 mt-1">Completed events</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* In Process */}
            <Card className="shadow-sm border-none bg-white rounded-lg overflow-hidden">
              <CardContent className="p-0 flex h-24">
                <div className="w-1.5 h-full bg-yellow-500"></div>
                <div className="flex-1 p-6 flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-800 tracking-tight">{inProcessEvents.toLocaleString()}</div>
                    <div className="text-sm font-medium text-gray-400 mt-1">In Process</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col min-h-[600px]">

            {/* Toolbar */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">

              {/* Tabs - Pill style or Underline style? Screenshot looked like Tabs. */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                <TabsList className="bg-transparent p-0 space-x-6">
                  <TabsTrigger
                    value="all"
                    className="bg-transparent border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-900 text-gray-500 font-bold text-sm uppercase tracking-wide px-1 py-3 rounded-none shadow-none transition-all"
                  >
                    ALL
                  </TabsTrigger>
                  <TabsTrigger
                    value="published"
                    className="bg-transparent border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-900 text-gray-500 font-bold text-sm uppercase tracking-wide px-1 py-3 rounded-none shadow-none transition-all"
                  >
                    Published
                  </TabsTrigger>
                  <TabsTrigger
                    value="draft"
                    className="bg-transparent border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-900 text-gray-500 font-bold text-sm uppercase tracking-wide px-1 py-3 rounded-none shadow-none transition-all"
                  >
                    Draft
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-200 text-gray-600 text-xs font-semibold uppercase tracking-wide px-4 py-2 h-10 hover:bg-gray-50 hover:text-gray-900">
                      Today: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      <ChevronDown className="ml-2 h-3 w-3 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>Today</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Yesterday</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Last 7 Days</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Last 30 Days</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* View Toggles (Visual only) */}
                <div className="hidden md:flex border-l pl-4 space-x-1">
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-blue-600 bg-blue-50">
                    <AlignJustify className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-gray-600">
                    <LayoutGrid className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1">
              {filteredEvents.length > 0 ? (
                <CompanyEventsTable
                  events={filteredEvents}
                  companyReference={company.reference}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No events found</h3>
                  <p className="text-gray-500 mb-6 max-w-sm">
                    We couldn&apos;t find any events matching your current filters.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("all")}
                    className="border-gray-300 text-gray-700"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="p-6 border-t border-gray-100 flex items-center justify-end">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 mr-4">Showing 1 to {filteredEvents.length} of {filteredEvents.length} entries</span>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200 text-gray-500" disabled>
                  &lt;
                </Button>
                <Button variant="default" size="sm" className="h-8 w-8 p-0 bg-blue-600 text-white font-semibold">
                  1
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-200 text-gray-500" disabled>
                  &gt;
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Full-Screen Create Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          <CreateEvent
            companyCode={company.company_code}
            closeModal={() => setIsCreateModalOpen(false)}
            refetchEvents={handleEventCreated}
          />
        </div>
      )}
    </>
  );
}
