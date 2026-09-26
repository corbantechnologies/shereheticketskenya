/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
// app/(private)/company/[reference]/events/[event_code]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useFetchCompanyEvent } from "@/hooks/events/actions";
import {
  closeEvent,
  publishEvent,
  unpublishEvent,
  getEventSettlement,
  requestEventPayout,
  EventSettlementData,
} from "@/services/events";
import { manualGateCheckIn, searchGateAttendees } from "@/services/gate";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { DashboardSkeleton } from "@/components/general/LoadingComponents";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Plus,
  Edit3,
  Ticket,
  Calendar,
  XCircle,
  Globe,
  MapPin,
  Users,
  Eye,
  Clock,
  Tag,
  EyeOff,
  Menu,
  ChevronDown,
  ChevronRight,
  Info,
  QrCode,
  Copy,
  TrendingUp,
  DollarSign,
  CreditCard,
  Search,
  Download,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import CreateTicketType from "@/forms/tickettypes/CreateTicketType";
import EditTicketType from "@/forms/tickettypes/EditTicketType";
import CreateCoupon from "@/forms/coupons/CreateCoupon";
import UpdateCoupon from "@/forms/coupons/UpdateCoupon";
import Modal from "@/components/ui/modal";
import RichTextDisplay from "@/components/ui/RichTextDisplay";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function EventDetailPage() {
  const router = useRouter();
  const { reference, event_code } = useParams<{ reference: string; event_code: string }>();
  const { isLoading, data: event, refetch } = useFetchCompanyEvent(event_code);
  const authHeaders = useAxiosAuth();

  // Modals state
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [isEditTicketModalOpen, setIsEditTicketModalOpen] = useState(false);
  const [isCreateCouponModalOpen, setIsCreateCouponModalOpen] = useState(false);
  const [isEditCouponModalOpen, setIsEditCouponModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState<any>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [expandedCouponId, setExpandedCouponId] = useState<string | null>(null);

  // Settlement & Payouts state
  const [settlement, setSettlement] = useState<EventSettlementData | null>(null);
  const [isLoadingSettlement, setIsLoadingSettlement] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<string>("");
  const [payoutPhone, setPayoutPhone] = useState<string>("");
  const [payoutNotes, setPayoutNotes] = useState<string>("");
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);

  // Attendee CRM state
  const [attendeeSearchQuery, setAttendeeSearchQuery] = useState("");
  const [crmFilter, setCrmFilter] = useState<"ALL" | "CHECKED_IN" | "NOT_CHECKED_IN">("ALL");
  const [checkingInCode, setCheckingInCode] = useState<string | null>(null);

  // Status transitions
  const [isClosing, setIsClosing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);

  // Fetch Settlement Data
  const loadSettlement = async () => {
    if (!authHeaders?.headers?.Authorization || !event_code) return;
    try {
      setIsLoadingSettlement(true);
      const data = await getEventSettlement(event_code, authHeaders);
      setSettlement(data);
    } catch {
      // Non-blocking
    } finally {
      setIsLoadingSettlement(false);
    }
  };

  useEffect(() => {
    if (event_code && authHeaders?.headers?.Authorization) {
      loadSettlement();
    }
  }, [event_code, authHeaders?.headers?.Authorization]);

  if (isLoading) return <DashboardSkeleton />;

  if (!event) {
    return <div className="p-8 text-center text-sm text-muted-foreground">Event not found.</div>;
  }

  const coupons = event.coupons || [];
  const ticketTypes = event.ticket_types || [];
  const totalTicketsSold = event.tickets_sold ?? settlement?.total_tickets_sold ?? 0;

  const allBookings = ticketTypes
    .flatMap((type: any) =>
      (type.bookings || []).map((booking: any) => ({
        ...booking,
        ticket_type_info: {
          name: type.name,
          price: type.price,
          ticket_type_code: type.ticket_type_code,
        },
      }))
    )
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Attendee CRM Filtering
  const filteredBookings = allBookings.filter((b: any) => {
    const query = attendeeSearchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      b.name?.toLowerCase().includes(query) ||
      b.phone?.includes(query) ||
      b.email?.toLowerCase().includes(query) ||
      b.reference?.toLowerCase().includes(query) ||
      (b.tickets || []).some((t: any) => t.ticket_code?.toLowerCase().includes(query));

    const isCheckedIn = (b.tickets || []).some((t: any) => t.is_used);
    if (crmFilter === "CHECKED_IN") return matchesQuery && isCheckedIn;
    if (crmFilter === "NOT_CHECKED_IN") return matchesQuery && !isCheckedIn;
    return matchesQuery;
  });

  const handleManualCheckIn = async (ticketCode: string) => {
    try {
      setCheckingInCode(ticketCode);
      const res = await manualGateCheckIn(event_code, ticketCode, "Organizer Desk", undefined, authHeaders?.headers);
      toast.success(res.data?.message || "Attendee checked in successfully!");
      await refetch();
      await loadSettlement();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to check in attendee.");
    } finally {
      setCheckingInCode(null);
    }
  };

  const handleExportCSV = () => {
    if (allBookings.length === 0) {
      toast.error("No attendees to export.");
      return;
    }

    const headers = ["Booking Reference", "Name", "Phone", "Email", "Ticket Tier", "Quantity", "Amount (KES)", "Payment Status", "Checked In", "Booked At"];
    const rows = allBookings.map((b: any) => [
      b.reference,
      `"${b.name || ""}"`,
      b.phone,
      b.email || "",
      `"${b.ticket_type_info?.name || ""}"`,
      b.quantity,
      b.amount,
      b.payment_status,
      (b.tickets || []).some((t: any) => t.is_used) ? "YES" : "NO",
      format(new Date(b.created_at), "yyyy-MM-dd HH:mm"),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r: any) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendees-${event_code}-${format(new Date(), "yyyyMMdd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Attendee list exported to CSV!");
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutAmount || Number(payoutAmount) <= 0) {
      toast.error("Please enter a valid payout amount.");
      return;
    }
    if (!payoutPhone) {
      toast.error("Please enter a recipient M-Pesa phone number.");
      return;
    }

    setIsSubmittingPayout(true);
    try {
      const res = await requestEventPayout(
        event_code,
        {
          amount: Number(payoutAmount),
          phone_number: payoutPhone,
          notes: payoutNotes,
        },
        authHeaders
      );
      toast.success(res.message || "Payout request submitted!");
      setIsPayoutModalOpen(false);
      setPayoutAmount("");
      setPayoutNotes("");
      await loadSettlement();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to submit payout request.");
    } finally {
      setIsSubmittingPayout(false);
    }
  };

  const handleCloseEvent = async () => {
    try {
      setIsClosing(true);
      await closeEvent(event_code, authHeaders);
      await refetch();
      toast.success("Event closed successfully.");
    } catch {
      toast.error("Failed to close event.");
    } finally {
      setIsClosing(false);
    }
  };

  const handlePublishEvent = async () => {
    try {
      setIsPublishing(true);
      await publishEvent(event_code, authHeaders);
      await refetch();
      toast.success("Event published successfully.");
    } catch {
      toast.error("Failed to publish event.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublishEvent = async () => {
    try {
      setIsUnpublishing(true);
      await unpublishEvent(event_code, authHeaders);
      await refetch();
      toast.success("Event unpublished successfully.");
    } catch {
      toast.error("Failed to unpublish event.");
    } finally {
      setIsUnpublishing(false);
    }
  };

  const copyGatePIN = () => {
    const pin = event.gate_passcode || settlement?.gate_passcode;
    if (pin) {
      navigator.clipboard.writeText(pin);
      toast.success(`Gate PIN (${pin}) copied!`);
    }
  };

  const copyGateLink = () => {
    const url = `${window.location.origin}/gate/${event_code}`;
    navigator.clipboard.writeText(url);
    toast.success("Gate bouncer URL copied to clipboard!");
  };

  const statusLabel = event.is_closed ? "Closed" : event.is_published ? "Published" : "Draft";
  const statusClass = event.is_closed
    ? "bg-gray-100 text-gray-500 border-gray-200"
    : event.is_published
    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : "bg-amber-100 text-amber-700 border-amber-200";

  return (
    <>
      <div className="mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ── 1. Top Event Header Card ── */}
        <Card className="border border-slate-800 shadow-2xl bg-slate-900/90 backdrop-blur-xl overflow-hidden rounded-2xl">
          {/* Top Strip: Breadcrumb + Action Menu */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 bg-slate-950/70 border-b border-slate-800">
            <button
              onClick={() => router.push(`/company/${reference}/events`)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to events
            </button>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`/events/${event.event_code}`, "_blank")}
                className="h-8 text-xs gap-1.5 border-slate-700 bg-slate-800/60 text-slate-200 hover:bg-slate-800 hover:text-white"
              >
                <Eye className="h-3.5 w-3.5" /> Public Page
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-800 text-slate-300 hover:text-white">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-slate-900 text-slate-100 shadow-2xl border-slate-800">
                  {!event.is_closed && (
                    <DropdownMenuItem
                      onClick={() => router.push(`/company/${reference}/events/${event_code}/edit`)}
                      className="text-xs cursor-pointer hover:bg-slate-800 text-slate-200"
                    >
                      <Edit3 className="h-3.5 w-3.5 mr-2" /> Edit Event Details
                    </DropdownMenuItem>
                  )}

                  {!event.is_closed && (
                    <>
                      {!event.is_published ? (
                        <DropdownMenuItem onClick={handlePublishEvent} className="text-xs cursor-pointer hover:bg-slate-800 text-emerald-400 font-medium">
                          <Globe className="h-3.5 w-3.5 mr-2" /> Publish Event
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={handleUnpublishEvent} className="text-xs cursor-pointer hover:bg-slate-800 text-amber-400 font-medium">
                          <EyeOff className="h-3.5 w-3.5 mr-2" /> Unpublish Event
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={handleCloseEvent} className="text-xs cursor-pointer hover:bg-slate-800 text-rose-400 font-medium">
                        <XCircle className="h-3.5 w-3.5 mr-2" /> Close Event
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Event Identity & Metadata */}
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{event.name}</h1>
                  <Badge className={`text-xs px-2.5 py-0.5 border font-semibold ${statusClass}`}>
                    {statusLabel}
                  </Badge>
                  <Badge variant="outline" className="text-xs text-slate-300 border-slate-700 bg-slate-800/40">
                    {event.category || "Concert"}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                    {format(new Date(event.start_date), "dd MMM yyyy")}
                    {event.end_date && ` → ${format(new Date(event.end_date), "dd MMM yyyy")}`}
                  </span>
                  {(event.start_time || event.end_time) && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {event.start_time || "TBA"} – {event.end_time || "TBA"}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-rose-400" />
                    {event.venue || "Venue TBA"}
                  </span>
                </div>
              </div>

              {/* Quick Gate Launch Button */}
              <div className="flex items-center gap-2.5 bg-slate-950 text-white p-3 rounded-xl shadow-lg border border-slate-800">
                <div className="pr-3 border-r border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Gate PIN</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="font-mono text-sm font-bold text-emerald-400">
                      {event.gate_passcode || settlement?.gate_passcode || "SH-GATE"}
                    </span>
                    <button
                      onClick={copyGatePIN}
                      title="Copy Gate PIN"
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => router.push(`/company/${reference}/events/${event_code}/scan`)}
                    className="h-8 text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold gap-1.5"
                  >
                    <QrCode className="h-3.5 w-3.5" />
                    Launch Scanner
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyGateLink}
                    title="Copy Standalone Link for Bouncers"
                    className="h-8 text-xs border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white"
                  >
                    Bouncer URL
                  </Button>
                </div>
              </div>
            </div>

            {/* KPI Banner */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-inner">
                <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                  <Users className="h-3.5 w-3.5 text-blue-400" /> Tickets Sold
                </p>
                <p className="text-2xl font-extrabold text-white mt-1">{totalTicketsSold}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">of {event.capacity ? event.capacity : "unlimited"} capacity</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-inner">
                <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-400" /> Gross Revenue
                </p>
                <p className="text-2xl font-extrabold text-emerald-400 mt-1">
                  KES {settlement ? settlement.gross_sales.toLocaleString() : "..."}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{allBookings.length} total orders</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-inner">
                <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                  <CreditCard className="h-3.5 w-3.5 text-purple-400" /> Withdrawable Balance
                </p>
                <p className="text-2xl font-extrabold text-white mt-1">
                  KES {settlement ? settlement.withdrawable_balance.toLocaleString() : "..."}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Net of 3.5% commission</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-inner">
                <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                  <Tag className="h-3.5 w-3.5 text-amber-400" /> Active Tiers
                </p>
                <p className="text-2xl font-extrabold text-white mt-1">{ticketTypes.length}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{coupons.length} coupon campaigns</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── 2. Navigation Tabs ── */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="h-11 bg-slate-900 p-1 w-full grid grid-cols-5 rounded-xl border border-slate-800 shadow-md">
            <TabsTrigger
              value="overview"
              className="h-9 text-xs font-semibold data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 rounded-lg text-slate-300 transition"
            >
              Overview &amp; Velocity
            </TabsTrigger>
            <TabsTrigger
              value="financials"
              className="h-9 text-xs font-semibold data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 rounded-lg text-slate-300 transition"
            >
              Financials &amp; Payouts
            </TabsTrigger>
            <TabsTrigger
              value="crm"
              className="h-9 text-xs font-semibold data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 rounded-lg text-slate-300 transition"
            >
              Attendee CRM ({allBookings.length})
            </TabsTrigger>
            <TabsTrigger
              value="tickets"
              className="h-9 text-xs font-semibold data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 rounded-lg text-slate-300 transition"
            >
              Ticket Tiers ({ticketTypes.length})
            </TabsTrigger>
            <TabsTrigger
              value="coupons"
              className="h-9 text-xs font-semibold data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 rounded-lg text-slate-300 transition"
            >
              Coupons ({coupons.length})
            </TabsTrigger>
          </TabsList>

          {/* ── TAB 1: OVERVIEW & RECHARTS SALES VELOCITY ── */}
          <TabsContent value="overview" className="mt-4 space-y-4">
            {/* Sales Velocity Chart Card */}
            <Card className="border border-slate-800 shadow-2xl bg-slate-900/90 backdrop-blur-xl rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                      Sales Velocity (Last 14 Days)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Daily revenue stream generated from confirmed M-Pesa bookings.
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                    Live Telemetry
                  </Badge>
                </div>

                <div className="h-64 w-full">
                  {settlement?.sales_velocity && settlement.sales_velocity.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={settlement.sales_velocity}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                        <XAxis
                          dataKey="date"
                          stroke="#64748b"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#64748b"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(val) => `KSh ${val.toLocaleString()}`}
                        />
                        <Tooltip
                          formatter={(value: any) => [`KSh ${Number(value).toLocaleString()}`, "Revenue"]}
                          labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
                          contentStyle={{
                            backgroundColor: "#090d16",
                            borderColor: "#334155",
                            borderRadius: "12px",
                            color: "#ffffff",
                            fontSize: "12px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#10b981"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#colorRev)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-slate-400">
                      No sales velocity records recorded yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Event Description & Agenda */}
            <Card className="border border-slate-800 shadow-2xl bg-slate-900/90 backdrop-blur-xl rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Event Overview &amp; Content</h3>
                {event.description && (
                  <p className="text-sm text-slate-300 leading-relaxed">{event.description}</p>
                )}
                <div className="text-slate-300">
                  <RichTextDisplay content={event.content} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── TAB 2: FINANCIALS & PAYOUTS ── */}
          <TabsContent value="financials" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Withdrawable Balance Action Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 text-white shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                      Available for Withdrawal
                    </span>
                    <CreditCard className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-extrabold mt-3 tracking-tight">
                    KES {settlement ? settlement.withdrawable_balance.toLocaleString() : "0.00"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Instant disbursement directly to your Safaricom M-Pesa line.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Gross Sales:</span>
                    <span className="text-white font-medium">KES {settlement?.gross_sales.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Platform Fee ({settlement?.platform_fee_percent || 3.5}%):</span>
                    <span className="text-rose-400 font-medium">- KES {settlement?.platform_fee_amount.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Disbursed so far:</span>
                    <span className="text-slate-300 font-medium">KES {settlement?.disbursed_amount.toLocaleString() || "0"}</span>
                  </div>
                  {settlement && settlement.pending_amount > 0 && (
                    <div className="flex justify-between text-xs text-amber-400 font-medium">
                      <span>Pending review:</span>
                      <span>KES {settlement.pending_amount.toLocaleString()}</span>
                    </div>
                  )}

                  <Button
                    onClick={() => setIsPayoutModalOpen(true)}
                    disabled={!settlement || settlement.withdrawable_balance <= 0}
                    className="w-full mt-4 h-11 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 text-xs gap-2"
                  >
                    <Smartphone className="w-4 h-4" />
                    Request Payout via M-Pesa
                  </Button>
                </div>
              </div>

              {/* Payout Requests History */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Recent Payout Requests
                  </h3>
                  <Badge variant="outline" className="text-xs border-slate-700 text-slate-300">
                    {settlement?.recent_payouts?.length || 0} requests
                  </Badge>
                </div>

                {settlement?.recent_payouts && settlement.recent_payouts.length > 0 ? (
                  <div className="rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-950/70 text-slate-400 font-semibold border-b border-slate-800">
                        <tr>
                          <th className="text-left px-4 py-3">Reference</th>
                          <th className="text-left px-4 py-3">Amount</th>
                          <th className="text-left px-4 py-3">M-Pesa Phone</th>
                          <th className="text-left px-4 py-3">Status</th>
                          <th className="text-right px-4 py-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70">
                        {settlement.recent_payouts.map((p) => (
                          <tr key={p.reference} className="hover:bg-slate-800/40">
                            <td className="px-4 py-3 font-mono font-bold text-slate-200">
                              {p.reference}
                            </td>
                            <td className="px-4 py-3 font-semibold text-emerald-400">
                              KES {p.amount_requested.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-400">
                              {p.payout_phone}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  p.status === "DISBURSED"
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : p.status === "PENDING"
                                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                    : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                }`}
                              >
                                {p.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right text-slate-400">
                              {format(new Date(p.created_at), "dd MMM, HH:mm")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    No payout requests submitted for this event yet.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ── TAB 3: ATTENDEE CRM ── */}
          <TabsContent value="crm" className="mt-4">
            <Card className="border border-slate-800 shadow-2xl bg-slate-900/90 backdrop-blur-xl rounded-2xl overflow-hidden">
              <CardContent className="p-5 sm:p-6 space-y-4">
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={attendeeSearchQuery}
                      onChange={(e) => setAttendeeSearchQuery(e.target.value)}
                      placeholder="Search by attendee name, phone, email, ticket code or ref..."
                      className="w-full pl-10 pr-4 py-2 text-xs border border-slate-700 rounded-xl bg-slate-950/80 text-white placeholder:text-slate-500 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs">
                      <button
                        onClick={() => setCrmFilter("ALL")}
                        className={`px-3 py-1 rounded-lg font-medium transition ${
                          crmFilter === "ALL" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400"
                        }`}
                      >
                        All ({allBookings.length})
                      </button>
                      <button
                        onClick={() => setCrmFilter("CHECKED_IN")}
                        className={`px-3 py-1 rounded-lg font-medium transition ${
                          crmFilter === "CHECKED_IN" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400"
                        }`}
                      >
                        Checked In
                      </button>
                      <button
                        onClick={() => setCrmFilter("NOT_CHECKED_IN")}
                        className={`px-3 py-1 rounded-lg font-medium transition ${
                          crmFilter === "NOT_CHECKED_IN" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400"
                        }`}
                      >
                        Not Checked
                      </button>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleExportCSV}
                      className="h-9 text-xs gap-1.5 border-slate-700 bg-slate-800/60 text-slate-200 hover:bg-slate-800 hover:text-white"
                    >
                      <Download className="w-3.5 h-3.5" /> Export CSV
                    </Button>
                  </div>
                </div>

                {/* Attendee Table */}
                {filteredBookings.length > 0 ? (
                  <div className="rounded-xl border border-slate-800 overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-950/70 text-slate-400 font-semibold border-b border-slate-800">
                        <tr>
                          <th className="text-left px-4 py-3">Attendee</th>
                          <th className="text-left px-4 py-3">Tier</th>
                          <th className="text-left px-4 py-3">Qty / Amount</th>
                          <th className="text-left px-4 py-3">Booking Ref</th>
                          <th className="text-left px-4 py-3">Gate Status</th>
                          <th className="text-right px-4 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70">
                        {filteredBookings.map((booking: any) => {
                          const isCheckedIn = (booking.tickets || []).some((t: any) => t.is_used);
                          const firstTicket = (booking.tickets || [])[0];

                          return (
                            <tr key={booking.reference} className="hover:bg-slate-800/40 transition">
                              <td className="px-4 py-3">
                                <p className="font-semibold text-white text-sm">{booking.name}</p>
                                <p className="text-slate-400 font-mono text-[11px]">{booking.phone}</p>
                              </td>
                              <td className="px-4 py-3">
                                <span className="font-medium text-slate-200">
                                  {booking.ticket_type_info?.name || "Regular"}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <p className="font-bold text-white">{booking.quantity} tickets</p>
                                <p className="text-emerald-400 font-medium">KES {Number(booking.amount).toLocaleString()}</p>
                              </td>
                              <td className="px-4 py-3">
                                <span className="font-mono text-slate-400">{booking.reference}</span>
                              </td>
                              <td className="px-4 py-3">
                                {isCheckedIn ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                    <CheckCircle2 className="w-3 h-3" /> Checked In
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-full">
                                    Not Scanned
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {!isCheckedIn && firstTicket && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleManualCheckIn(firstTicket.ticket_code)}
                                    disabled={checkingInCode === firstTicket.ticket_code}
                                    className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-2.5"
                                  >
                                    {checkingInCode === firstTicket.ticket_code ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      "Check In"
                                    )}
                                  </Button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No attendees match your search query.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── TAB 4: TICKET TIERS ── */}
          <TabsContent value="tickets" className="mt-4">
            <Card className="border border-slate-800 shadow-2xl bg-slate-900/90 backdrop-blur-xl rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Ticket Tiers</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Manage pricing, quota caps, and VIP access levels.</p>
                  </div>
                  {!event.is_closed && (
                    <Button
                      size="sm"
                      onClick={() => setIsCreateTicketModalOpen(true)}
                      className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Ticket Tier
                    </Button>
                  )}
                </div>

                {ticketTypes.length > 0 ? (
                  <div className="rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-950/70 text-slate-400 font-semibold border-b border-slate-800">
                        <tr>
                          <th className="text-left px-4 py-3">Tier Name</th>
                          <th className="text-left px-4 py-3">Price</th>
                          <th className="text-left px-4 py-3">Available</th>
                          <th className="text-left px-4 py-3">Sold</th>
                          <th className="text-right px-4 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70">
                        {ticketTypes.map((type: any) => (
                          <tr key={type.ticket_type_code} className="hover:bg-slate-800/40">
                            <td className="px-4 py-3">
                              <p className="font-semibold text-white text-sm">{type.name}</p>
                              <p className="text-slate-400 font-mono text-[10px]">{type.ticket_type_code}</p>
                            </td>
                            <td className="px-4 py-3 font-semibold text-white">
                              KES {Number(type.price).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-slate-400">
                              {type.is_limited ? `${type.quantity_available?.toLocaleString()} left` : "Unlimited"}
                            </td>
                            <td className="px-4 py-3 font-bold text-emerald-400">
                              {type.tickets_sold ?? 0}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {!event.is_closed && (
                                <button
                                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
                                  onClick={() => {
                                    setSelectedTicketType(type);
                                    setIsEditTicketModalOpen(true);
                                  }}
                                >
                                  <Edit3 className="h-3 w-3" /> Edit
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No ticket tiers created yet. Add tiers so attendees can purchase passes.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── TAB 5: COUPONS ── */}
          <TabsContent value="coupons" className="mt-4">
            <Card className="border border-slate-800 shadow-2xl bg-slate-900/90 backdrop-blur-xl rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Promoter &amp; Discount Coupons</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Track coupon redemption and affiliate promoter sales.</p>
                  </div>
                  {!event.is_closed && (
                    <Button
                      size="sm"
                      onClick={() => setIsCreateCouponModalOpen(true)}
                      className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Coupon
                    </Button>
                  )}
                </div>

                {coupons.length > 0 ? (
                  <div className="rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-950/70 text-slate-400 font-semibold border-b border-slate-800">
                        <tr>
                          <th className="w-8 px-4 py-3"></th>
                          <th className="text-left px-4 py-3">Code</th>
                          <th className="text-left px-4 py-3">Discount</th>
                          <th className="text-left px-4 py-3">Usage</th>
                          <th className="text-left px-4 py-3">Status</th>
                          <th className="text-right px-4 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70">
                        {coupons.map((coupon: any) => {
                          const isExpanded = expandedCouponId === coupon.id;
                          return (
                            <React.Fragment key={coupon.id}>
                              <tr
                                className="hover:bg-slate-800/40 cursor-pointer"
                                onClick={() => setExpandedCouponId(isExpanded ? null : coupon.id)}
                              >
                                <td className="px-4 py-3">
                                  {isExpanded ? (
                                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                                  ) : (
                                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  <span className="font-mono font-bold text-white text-sm">{coupon.code}</span>
                                  <p className="text-[10px] text-slate-400">{coupon.name}</p>
                                </td>
                                <td className="px-4 py-3 font-semibold text-slate-200">
                                  {coupon.discount_type === "FIXED"
                                    ? `KES ${Number(coupon.discount_value).toLocaleString()} OFF`
                                    : `${coupon.discount_value}% OFF`}
                                </td>
                                <td className="px-4 py-3 text-slate-400">
                                  {coupon.usage_count} / {coupon.usage_limit ?? "∞"}
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      coupon.is_active
                                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                        : "bg-slate-800 text-slate-400"
                                    }`}
                                  >
                                    {coupon.is_active ? "Active" : "Inactive"}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  {!event.is_closed && (
                                    <button
                                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedCoupon(coupon);
                                        setIsEditCouponModalOpen(true);
                                      }}
                                    >
                                      <Edit3 className="h-3 w-3" /> Edit
                                    </button>
                                  )}
                                </td>
                              </tr>
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No discount coupons created yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── MODALS ── */}
      {/* 1. Request Payout Modal */}
      <Modal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        title="Request M-Pesa Payout"
      >
        <form onSubmit={handleRequestPayout} className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs space-y-1">
            <span className="text-slate-400">Available Balance</span>
            <p className="text-xl font-extrabold text-emerald-400">
              KES {settlement ? settlement.withdrawable_balance.toLocaleString() : "0.00"}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payout Amount (KES) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
              placeholder="e.g. 50000"
              max={settlement?.withdrawable_balance}
              min={100}
              required
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              M-Pesa Safaricom Line <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={payoutPhone}
              onChange={(e) => setPayoutPhone(e.target.value)}
              placeholder="2547XXXXXXXX"
              required
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes / Reference (Optional)
            </label>
            <textarea
              value={payoutNotes}
              onChange={(e) => setPayoutNotes(e.target.value)}
              placeholder="e.g. Stage production advance"
              rows={2}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPayoutModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmittingPayout}
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-1.5"
            >
              {isSubmittingPayout ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Payout Request"
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. Create Ticket Modal */}
      <Modal
        isOpen={isCreateTicketModalOpen}
        onClose={() => setIsCreateTicketModalOpen(false)}
        title="Add Ticket Type"
      >
        <CreateTicketType
          event={event}
          closeModal={() => setIsCreateTicketModalOpen(false)}
          refetch={refetch}
        />
      </Modal>

      {/* 3. Edit Ticket Modal */}
      <Modal
        isOpen={isEditTicketModalOpen && !!selectedTicketType}
        onClose={() => setIsEditTicketModalOpen(false)}
        title="Edit Ticket Type"
      >
        {selectedTicketType && (
          <EditTicketType
            ticketType={selectedTicketType}
            event={event}
            closeModal={() => setIsEditTicketModalOpen(false)}
            refetch={refetch}
          />
        )}
      </Modal>

      {/* 4. Create Coupon Modal */}
      <Modal
        isOpen={isCreateCouponModalOpen}
        onClose={() => setIsCreateCouponModalOpen(false)}
        title="Add Coupon"
      >
        <CreateCoupon
          event={event}
          closeModal={() => setIsCreateCouponModalOpen(false)}
          refetch={refetch}
        />
      </Modal>

      {/* 5. Edit Coupon Modal */}
      <Modal
        isOpen={isEditCouponModalOpen && !!selectedCoupon}
        onClose={() => setIsEditCouponModalOpen(false)}
        title="Edit Coupon"
      >
        {selectedCoupon && (
          <UpdateCoupon
            coupon={selectedCoupon}
            event={event}
            closeModal={() => setIsEditCouponModalOpen(false)}
            refetch={refetch}
          />
        )}
      </Modal>
    </>
  );
}
