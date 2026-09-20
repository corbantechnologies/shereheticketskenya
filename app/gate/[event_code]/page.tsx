// app/gate/[event_code]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import GateScannerView from "@/components/gate/GateScannerView";
import { fetchGateStats } from "@/services/gate";
import { Shield, KeyRound, ArrowRight, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function StandaloneGatePage() {
  const { event_code } = useParams<{ event_code: string }>();
  const searchParams = useSearchParams();
  const initialPin = searchParams.get("pin") || "";

  const [enteredPasscode, setEnteredPasscode] = useState(initialPin);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [eventName, setEventName] = useState<string>("");

  useEffect(() => {
    if (initialPin) {
      handleValidate(initialPin);
    }
  }, [initialPin]);

  const handleValidate = async (pinToTest?: string) => {
    const pin = (pinToTest || enteredPasscode).trim();
    if (!pin) {
      toast.error("Please enter the Event Gate PIN");
      return;
    }

    setIsValidating(true);
    try {
      const res = await fetchGateStats(event_code, pin);
      setIsUnlocked(true);
      setEventName(res.data.event_name);
      toast.success(`Gate unlocked for ${res.data.event_name}`);
    } catch {
      toast.error("Invalid Gate PIN for this event");
      setIsUnlocked(false);
    } finally {
      setIsValidating(false);
    }
  };

  if (isUnlocked) {
    return (
      <GateScannerView
        eventCode={event_code}
        eventName={eventName}
        gatePasscode={enteredPasscode.trim()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
          <Shield className="h-8 w-8 text-white" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Gate Access</h1>
          <p className="text-xs text-slate-400 mt-1">
            Event Code: <span className="font-mono text-cyan-400 font-semibold">{event_code}</span>
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Enter the 6-character Gate Passcode provided by the event organizer to start scanning tickets.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleValidate();
          }}
          className="space-y-3"
        >
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="e.g. SH-4821"
              value={enteredPasscode}
              onChange={(e) => setEnteredPasscode(e.target.value.toUpperCase())}
              className="bg-slate-800/90 border-slate-700 pl-10 text-center font-mono tracking-widest text-lg font-bold text-white uppercase h-12 rounded-xl focus:border-cyan-500"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={isValidating}
            className="w-full h-12 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
          >
            <span>{isValidating ? "Validating..." : "Unlock Scanner"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-center gap-1">
          <Lock className="h-3 w-3" />
          <span>Secured by Sherehe Events Platform</span>
        </div>
      </div>
    </div>
  );
}
