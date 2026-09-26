"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { soundFX } from "@/lib/audio";
import { scanTicket, fetchGateStats, searchGateAttendees, manualGateCheckIn, ScanResult, GateStats, AttendeeSearchResult } from "@/services/gate";
import {
  Camera,
  Volume2,
  VolumeX,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Zap,
  Users,
  Ticket,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Building,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import toast from "react-hot-toast";

interface GateScannerProps {
  eventCode: string;
  eventName?: string;
  gatePasscode?: string;
  authHeaders?: any;
  backHref?: string;
}

export default function GateScannerView({
  eventCode,
  eventName: initialEventName,
  gatePasscode: initialPasscode,
  authHeaders,
  backHref,
}: GateScannerProps) {
  const [gatePasscode, setGatePasscode] = useState(initialPasscode || "");
  const [gateStation, setGateStation] = useState("Main Gate");
  const [isMuted, setIsMuted] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [stats, setStats] = useState<GateStats | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  // Manual search state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AttendeeSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Scanner ref
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const autoResumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const res = await fetchGateStats(eventCode, gatePasscode, authHeaders);
      setStats(res.data);
    } catch {
      // Ignore stats error on first load
    }
  }, [eventCode, gatePasscode, authHeaders]);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 15000); // refresh stats every 15s
    return () => clearInterval(interval);
  }, [loadStats]);

  // Handle a detected QR code string
  const handleBarcodeDetected = useCallback(async (decodedText: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const response = await scanTicket(
        eventCode,
        {
          qr_data: decodedText,
          gate_station: gateStation,
          gate_passcode: gatePasscode,
        },
        authHeaders
      );

      const result = response.data;
      setScanResult(result);

      if (result.status === "VALID") {
        if (!isMuted) soundFX.playSuccess();
        toast.success(`Welcome, ${result.attendee_name || "Guest"}!`);
      }
      loadStats();
    } catch (err: any) {
      const errData = err.response?.data;
      if (err.response?.status === 409) {
        // Duplicate scan
        setScanResult(errData || { status: "ALREADY_USED", error: "Already scanned" });
        if (!isMuted) soundFX.playDuplicate();
        toast.error("⚠️ ALREADY SCANNED!");
      } else {
        // Invalid or other error
        setScanResult(
          errData || { status: "INVALID_EVENT", error: "Invalid ticket or wrong event" }
        );
        if (!isMuted) soundFX.playInvalid();
        toast.error(errData?.error || "Invalid ticket");
      }
    } finally {
      setIsProcessing(false);
      // Auto-resume scanner modal after 3 seconds for continuous throughput
      if (autoResumeTimerRef.current) clearTimeout(autoResumeTimerRef.current);
      autoResumeTimerRef.current = setTimeout(() => {
        setScanResult(null);
      }, 3200);
    }
  }, [eventCode, gateStation, gatePasscode, authHeaders, isMuted, isProcessing, loadStats]);

  // Start QR Scanner
  const startScanner = useCallback(async () => {
    try {
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch {}
      }

      const html5QrCode = new Html5Qrcode("gate-qr-reader", {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.EAN_13,
        ],
        verbose: false,
      });
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 15,
          qrbox: { width: 260, height: 260 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleBarcodeDetected(decodedText);
        },
        () => {
          // Frame without code — normal
        }
      );
      setIsScanning(true);
    } catch (err) {
      console.error("Camera start error:", err);
      toast.error("Could not access camera. Please allow camera permissions.");
      setIsScanning(false);
    }
  }, [handleBarcodeDetected]);

  // Stop QR Scanner
  const stopScanner = useCallback(async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.error("Stop scanner error:", err);
      }
    }
    setIsScanning(false);
  }, [isScanning]);

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
      if (autoResumeTimerRef.current) clearTimeout(autoResumeTimerRef.current);
    };
  }, []); // Run on mount

  // Manual Search Handler
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await searchGateAttendees(eventCode, searchQuery, gatePasscode, authHeaders);
      setSearchResults(res.data.results || []);
    } catch {
      toast.error("Failed to search attendees");
    } finally {
      setIsSearching(false);
    }
  };

  // Manual Check-in Click
  const handleManualCheckIn = async (ticketRef: string) => {
    try {
      const res = await manualGateCheckIn(eventCode, ticketRef, gateStation, gatePasscode, authHeaders);
      if (res.data.status === "VALID") {
        if (!isMuted) soundFX.playSuccess();
        toast.success(`Checked in ${res.data.attendee_name}`);
        // update local list
        setSearchResults((prev) =>
          prev.map((item) =>
            item.reference === ticketRef ? { ...item, is_used: true, used_at: new Date().toISOString() } : item
          )
        );
        loadStats();
      }
    } catch (err: any) {
      if (!isMuted) soundFX.playDuplicate();
      toast.error(err.response?.data?.error || "Check-in failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* Top Navigation & Live Telemetry Bar */}
      <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {backHref && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = backHref)}
              className="text-slate-400 hover:text-white px-2"
            >
              ← Back
            </Button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-sm font-bold tracking-tight text-white line-clamp-1">
                {stats?.event_name || initialEventName || "Gate Check-In"}
              </h1>
            </div>
            <p className="text-[11px] text-slate-400">
              Station: <span className="text-slate-200 font-medium">{gateStation}</span> • {eventCode}
            </p>
          </div>
        </div>

        {/* Controls: Audio Mute & Manual Search */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className="h-8 w-8 p-0 rounded-full border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
          </Button>

          <Button
            size="sm"
            onClick={() => setSearchModalOpen(true)}
            className="h-8 px-3 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg flex items-center gap-1.5"
          >
            <Search className="h-3.5 w-3.5 text-blue-400" />
            <span>Search</span>
          </Button>
        </div>
      </header>

      {/* Live Stats Pill Bar */}
      {stats && (
        <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-400">Checked In:</span>{" "}
              <span className="font-bold text-emerald-400">{stats.total_checked_in}</span>
              <span className="text-slate-500"> / {stats.total_sold}</span>
            </div>
            <div>
              <span className="text-slate-400">Attendance:</span>{" "}
              <span className="font-bold text-cyan-400">{stats.check_in_rate_percent}%</span>
            </div>
          </div>
          <button
            onClick={loadStats}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" /> Refresh
          </button>
        </div>
      )}

      {/* Camera Viewfinder Area */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-3 overflow-hidden">
        {/* Scanner Container */}
        <div className="relative w-full max-w-sm aspect-square bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl flex items-center justify-center">
          {/* HTML5 QR Container */}
          <div id="gate-qr-reader" className="w-full h-full object-cover" />

          {/* Animated Target Reticle Overlay */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-8">
            <div className="relative w-full h-full border-2 border-dashed border-emerald-400/40 rounded-2xl flex items-center justify-center">
              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />

              {/* Laser scanning beam */}
              <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-500 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-bounce" />
            </div>
          </div>

          {/* Scanning Status Badge */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-slate-300 border border-slate-700/60 flex items-center gap-1.5">
            <Camera className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span>Point camera at Ticket QR Code</span>
          </div>
        </div>

        {/* Action Controls below Camera */}
        <div className="w-full max-w-sm mt-4 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={isScanning ? stopScanner : startScanner}
            className="flex-1 bg-slate-900 border-slate-700 text-slate-300 hover:text-white text-xs h-10 rounded-xl"
          >
            {isScanning ? "Pause Camera" : "Resume Camera"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchModalOpen(true)}
            className="flex-1 bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600/30 text-xs h-10 rounded-xl flex items-center justify-center gap-1.5"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Manual Check-In</span>
          </Button>
        </div>

        {/* Quick Tiers Breakdown Pills */}
        {stats?.tier_breakdown && (
          <div className="w-full max-w-sm mt-4 flex flex-wrap gap-2 justify-center">
            {stats.tier_breakdown.map((tier) => (
              <div
                key={tier.ticket_type_code}
                className="bg-slate-900/80 border border-slate-800 rounded-xl px-2.5 py-1.5 text-center min-w-[90px]"
              >
                <div className="text-[10px] text-slate-400 font-medium truncate max-w-[80px]">{tier.name}</div>
                <div className="text-xs font-bold text-slate-200">
                  <span className="text-emerald-400">{tier.checked_in}</span>
                  <span className="text-slate-500 text-[10px]">/{tier.sold}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* SCAN RESULT OVERLAY MODAL (Full-Screen High-Impact Verification Banner)  */}
      {/* ========================================================================= */}
      {scanResult && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-all duration-200 ${
            scanResult.status === "VALID"
              ? "bg-emerald-950/90"
              : scanResult.status === "ALREADY_USED"
              ? "bg-rose-950/90"
              : "bg-amber-950/90"
          }`}
          onClick={() => setScanResult(null)}
        >
          <div
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Status Icon & Banner */}
            {scanResult.status === "VALID" ? (
              <div className="space-y-2">
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                  <CheckCircle2 className="h-12 w-12 animate-in zoom-in" />
                </div>
                <Badge className="bg-emerald-500 text-black font-extrabold text-sm px-4 py-1 uppercase tracking-wider">
                  ENTRY APPROVED
                </Badge>
              </div>
            ) : scanResult.status === "ALREADY_USED" ? (
              <div className="space-y-2">
                <div className="w-20 h-20 bg-rose-500/20 text-rose-400 border-2 border-rose-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(244,63,94,0.5)]">
                  <XCircle className="h-12 w-12 animate-pulse" />
                </div>
                <Badge className="bg-rose-600 text-white font-extrabold text-sm px-4 py-1 uppercase tracking-wider">
                  ⚠️ ALREADY USED!
                </Badge>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-20 h-20 bg-amber-500/20 text-amber-400 border-2 border-amber-500 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="h-12 w-12" />
                </div>
                <Badge className="bg-amber-600 text-white font-extrabold text-sm px-4 py-1 uppercase tracking-wider">
                  INVALID TICKET
                </Badge>
              </div>
            )}

            {/* Attendee Details Card */}
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 text-left space-y-2.5">
              {scanResult.attendee_name && (
                <div>
                  <div className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Attendee</div>
                  <div className="text-lg font-bold text-white">{scanResult.attendee_name}</div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-700/50 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Ticket Type</div>
                  <div className="font-bold text-cyan-300">{scanResult.ticket_type || "General"}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Ticket #</div>
                  <div className="font-mono text-slate-300 truncate">{scanResult.ticket_code}</div>
                </div>
              </div>

              {/* Already used details */}
              {scanResult.status === "ALREADY_USED" && scanResult.first_used_at && (
                <div className="bg-rose-950/60 border border-rose-800/80 p-2.5 rounded-xl text-rose-200 text-xs mt-2">
                  <div className="font-semibold text-rose-300">Duplicate Scan Alert</div>
                  <div>First scanned: {new Date(scanResult.first_used_at).toLocaleTimeString()}</div>
                  <div>Station: {scanResult.first_gate_station || "Gate 1"}</div>
                </div>
              )}

              {/* Error message */}
              {scanResult.error && scanResult.status !== "ALREADY_USED" && (
                <div className="bg-amber-950/60 border border-amber-800/80 p-2 rounded-lg text-amber-200 text-xs">
                  {scanResult.error}
                </div>
              )}
            </div>

            {/* Dismiss Button */}
            <Button
              onClick={() => setScanResult(null)}
              className={`w-full py-6 text-base font-bold rounded-2xl shadow-lg ${
                scanResult.status === "VALID"
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                  : "bg-slate-700 hover:bg-slate-600 text-white"
              }`}
            >
              Next Scan (Tap or wait 3s)
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MANUAL SEARCH & CHECK-IN MODAL                                           */}
      {/* ========================================================================= */}
      <Dialog open={searchModalOpen} onOpenChange={setSearchModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-lg max-h-[85vh] flex flex-col p-5 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
              <Search className="h-4 w-4 text-cyan-400" />
              Manual Attendee Search & Check-In
            </DialogTitle>
          </DialogHeader>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2 my-2">
            <Input
              placeholder="Search by name, phone, booking code, or M-Pesa ref..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-10 text-xs"
              autoFocus
            />
            <Button
              type="submit"
              disabled={isSearching}
              className="bg-cyan-600 hover:bg-cyan-500 text-white h-10 px-4 text-xs font-semibold"
            >
              {isSearching ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </form>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto space-y-2 mt-2 pr-1 max-h-[50vh]">
            {searchResults.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                {isSearching ? "Searching database..." : "Type attendee name, phone number, or M-Pesa receipt above."}
              </div>
            ) : (
              searchResults.map((item) => (
                <div
                  key={item.reference}
                  className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-white text-sm">{item.attendee_name}</div>
                    <div className="text-slate-400 text-[11px]">
                      {item.phone} • <span className="text-cyan-300 font-medium">{item.ticket_type}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Ref: {item.booking_code} {item.mpesa_receipt && `• M-Pesa: ${item.mpesa_receipt}`}
                    </div>
                  </div>

                  <div>
                    {item.is_used ? (
                      <Badge className="bg-slate-700 text-slate-300 border-slate-600 text-[10px]">
                        Checked In {item.used_at && new Date(item.used_at).toLocaleTimeString()}
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleManualCheckIn(item.reference)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-8 px-3 text-xs rounded-xl flex items-center gap-1"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        Check In
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
