/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { apiActions } from "@/tools/axios";
import { LoadingSpinner } from "@/components/general/LoadingComponents";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldAlert,
  DollarSign,
  Calendar,
  Ticket,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Building,
  ExternalLink,
  Loader2,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { format } from "date-fns";

interface AdminStats {
  total_events: number;
  published_events: number;
  closed_events: number;
  total_tickets_sold: number;
  total_gross_revenue: number;
  platform_fee_earned: number;
  disbursed_payouts: number;
  pending_payouts: number;
  pending_payouts_count: number;
  recent_payouts: PayoutItem[];
}

interface PayoutItem {
  reference: string;
  event_name: string;
  company_name: string;
  requested_by: string;
  amount_requested: number;
  net_payout_amount: number;
  payout_phone: string;
  status: "PENDING" | "APPROVED" | "DISBURSED" | "REJECTED";
  mpesa_transaction_id?: string;
  notes?: string;
  created_at: string;
  disbursed_at?: string;
}

export default function AdminDashboardPage() {
  const authHeaders = useAxiosAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [mpesaCodes, setMpesaCodes] = useState<{ [key: string]: string }>({});

  const fetchStats = async () => {
    if (!authHeaders?.headers?.Authorization) return;
    try {
      setLoading(true);
      const res = await apiActions.get("/api/v1/events/platform-stats/", authHeaders);
      setStats(res.data);
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || "Failed to load platform administrator metrics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authHeaders?.headers?.Authorization) {
      fetchStats();
    }
  }, [authHeaders?.headers?.Authorization]);

  const handlePayoutAction = async (
    reference: string,
    action: "APPROVE" | "DISBURSE" | "REJECT"
  ) => {
    setActionLoading(reference);
    try {
      const payload: any = { action };
      if (action === "DISBURSE") {
        const code = mpesaCodes[reference]?.trim();
        if (code) {
          payload.mpesa_transaction_id = code;
        }
      }

      await apiActions.patch(
        `/api/v1/events/payouts/${reference}/`,
        payload,
        authHeaders
      );

      toast.success(`Payout successfully marked as ${action}`);
      fetchStats();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update payout status.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Platform Administration</h1>
            <Badge className="bg-rose-500 text-white text-[10px] font-bold">SUPERUSER</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Global telemetry, revenue commissions, and organizer payout settlement approvals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            className="text-xs h-9 border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
          >
            <Link href="/admin/events">All Platform Events</Link>
          </Button>
          <Button
            asChild
            className="text-xs h-9 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold"
          >
            <a href="http://localhost:8000/admin/" target="_blank" rel="noopener noreferrer">
              Django Admin <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </a>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Gross Marketplace GMV</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-2">
              KES {stats?.total_gross_revenue.toLocaleString() ?? "0"}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Total attendee payments processed</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Platform 3.5% Fees</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-cyan-400 mt-2">
              KES {stats?.platform_fee_earned.toLocaleString() ?? "0"}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Net platform commissions</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Pending Payouts</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-amber-400 mt-2">
              KES {stats?.pending_payouts.toLocaleString() ?? "0"}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {stats?.pending_payouts_count ?? 0} requests awaiting review
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Events & Tickets</span>
              <Ticket className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-white mt-2">
              {stats?.total_tickets_sold.toLocaleString() ?? 0}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Across {stats?.total_events ?? 0} events ({stats?.published_events ?? 0} live)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payout Management Section */}
      <Card className="bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              Organizer Payout Settlement Console
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review and disburse withdrawable balances requested by event managers.
            </p>
          </div>
          <Badge variant="outline" className="text-xs border-slate-700 text-slate-300">
            {stats?.recent_payouts.length ?? 0} Recent Records
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="px-4 py-3">Event & Organizer</th>
                <th className="px-4 py-3">Requested Net</th>
                <th className="px-4 py-3">M-Pesa Phone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">M-Pesa Ref</th>
                <th className="px-4 py-3 text-right">Disbursement Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stats?.recent_payouts && stats.recent_payouts.length > 0 ? (
                stats.recent_payouts.map((payout) => {
                  const isPending = payout.status === "PENDING";
                  const isApproved = payout.status === "APPROVED";
                  const isDisbursed = payout.status === "DISBURSED";

                  return (
                    <tr key={payout.reference} className="hover:bg-slate-800/30 transition">
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-white text-xs">{payout.event_name}</p>
                        <p className="text-[11px] text-slate-400">{payout.company_name} · {payout.requested_by}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {format(new Date(payout.created_at), "dd MMM yyyy, HH:mm")}
                        </p>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-extrabold text-sm text-emerald-400">
                          KES {payout.net_payout_amount.toLocaleString()}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-mono text-cyan-400 font-semibold">{payout.payout_phone}</span>
                      </td>

                      <td className="px-4 py-3.5">
                        <Badge
                          className={`text-[10px] font-bold ${
                            isDisbursed
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : isPending
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : isApproved
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {payout.status}
                        </Badge>
                      </td>

                      <td className="px-4 py-3.5">
                        {isDisbursed ? (
                          <span className="font-mono text-slate-300 font-semibold">
                            {payout.mpesa_transaction_id || "N/A"}
                          </span>
                        ) : (
                          <Input
                            placeholder="M-Pesa Receipt ID"
                            value={mpesaCodes[payout.reference] || ""}
                            onChange={(e) =>
                              setMpesaCodes({
                                ...mpesaCodes,
                                [payout.reference]: e.target.value.toUpperCase(),
                              })
                            }
                            className="h-8 text-xs bg-slate-950 border-slate-700 font-mono uppercase w-36"
                          />
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        {isDisbursed ? (
                          <span className="text-emerald-400 font-semibold text-xs inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Disbursed
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            {isPending && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePayoutAction(payout.reference, "APPROVE")}
                                disabled={actionLoading === payout.reference}
                                className="h-7 text-[11px] border-blue-500/40 text-blue-400 hover:bg-blue-500/10"
                              >
                                Approve
                              </Button>
                            )}

                            <Button
                              size="sm"
                              onClick={() => handlePayoutAction(payout.reference, "DISBURSE")}
                              disabled={actionLoading === payout.reference}
                              className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                            >
                              {actionLoading === payout.reference ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                "Mark Disbursed"
                              )}
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handlePayoutAction(payout.reference, "REJECT")}
                              disabled={actionLoading === payout.reference}
                              className="h-7 text-[11px] text-rose-400 hover:bg-rose-500/10"
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No payout settlement requests on file.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}