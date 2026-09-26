/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { LoadingSpinner } from "@/components/general/LoadingComponents";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Building2,
  Plus,
  Lock,
  ChevronRight,
  Calendar,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Settings,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import Modal from "@/components/ui/modal";
import CreateCompany from "@/forms/company/CreateCompany";
import OrganizerGuides from "@/components/organizer/OrganizerGuides";

export default function OrganizerDashboardPage() {
  const router = useRouter();
  const { isLoading, data: organizer, refetch } = useFetchAccount();
  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!organizer) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-400">Unable to load organizer dashboard.</p>
      </div>
    );
  }

  const { first_name, last_name, email, is_premium, companies = [] } = organizer;
  const totalEvents = companies.reduce(
    (acc: number, c: any) => acc + (c.company_events?.length || 0),
    0
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Welcome Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Organizer Portal
            </h1>
            <Badge
              className={`text-[10px] px-2 py-0.5 font-bold ${
                is_premium
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              {is_premium ? "PRO SUBSCRIBER" : "FREE PLAN"}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Welcome back, <span className="text-slate-900 font-semibold">{first_name}</span>. Manage your brands, live events, gate checkpoints, and M-Pesa settlements.
          </p>
        </div>

        <Button
          disabled={!is_premium && companies.length >= 1}
          onClick={() => setIsCreateCompanyOpen(true)}
          className="h-10 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Organization</span>
          {!is_premium && companies.length >= 1 && <Lock className="h-3 w-3 ml-1 text-slate-300" />}
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm rounded-2xl">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Your Organizations</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{companies.length}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {is_premium ? "Unlimited Organizations unlocked" : "1 of 1 free organization in use"}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Building2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm rounded-2xl">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Live Events</p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">{totalEvents}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Across all registered companies</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Calendar className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm rounded-2xl">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Ticketing &amp; Gate Speed</p>
              <p className="text-2xl font-extrabold text-blue-600 mt-1">100%</p>
              <p className="text-[11px] text-slate-400 mt-0.5">M-Pesa STK Push &amp; QR scanning online</p>
            </div>
            <div className="p-3 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100">
              <Sparkles className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organizations Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            Your Event Brands ({companies.length})
          </h2>
        </div>

        {companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company: any) => {
              const eventCount = company.company_events?.length || 0;
              return (
                <Card
                  key={company.reference}
                  className="bg-white border-slate-200 text-slate-900 shadow-sm rounded-2xl overflow-hidden hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between group"
                >
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 rounded-xl border border-slate-200 bg-slate-50">
                          <AvatarImage src={company.logo || undefined} />
                          <AvatarFallback className="bg-blue-600 text-white font-bold rounded-xl text-base">
                            {company.name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition">
                            {company.name}
                          </h3>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {company.company_code}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-slate-100 border-slate-200 text-slate-700 text-[10px] font-semibold">
                        {company.city || "Kenya"}
                      </Badge>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-4 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        {eventCount} {eventCount === 1 ? "Event" : "Events"}
                      </span>
                      {company.email && (
                        <span className="truncate max-w-[140px] text-slate-400">
                          {company.email}
                        </span>
                      )}
                    </div>
                  </CardContent>

                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => router.push(`/company/${company.reference}`)}
                      className="text-xs text-slate-600 hover:text-slate-900 h-8 px-2.5"
                    >
                      <Settings className="w-3.5 h-3.5 mr-1.5" /> Brand Profile
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => router.push(`/company/${company.reference}/events`)}
                      className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold h-8 rounded-lg"
                    >
                      <span>Events Hub</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-white border-slate-200 text-slate-900 shadow-sm rounded-2xl p-8 text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-900">No organizations created yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create your organization to start publishing events and selling verified tickets.
            </p>
            <Button
              onClick={() => setIsCreateCompanyOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-9 font-semibold"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Create Organization
            </Button>
          </Card>
        )}
      </div>

      {/* Interactive Organizer Knowledge Base */}
      <OrganizerGuides />

      {/* Create Company Modal */}
      <Modal
        isOpen={isCreateCompanyOpen}
        onClose={() => setIsCreateCompanyOpen(false)}
        title="Create New Organization"
        description="Register a secondary company/brand to organize and host events."
      >
        <div className="p-6">
          <CreateCompany
            refetch={refetch}
            closeDialog={() => setIsCreateCompanyOpen(false)}
          />
        </div>
      </Modal>
    </div>
  );
}
