/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useFetchAccount } from "@/hooks/accounts/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Building2,
  ChevronDown,
  Check,
  Plus,
  Sparkles,
  Lock,
} from "lucide-react";
import Modal from "@/components/ui/modal";
import CreateCompany from "@/forms/company/CreateCompany";

interface CompanySwitcherProps {
  collapsed?: boolean;
}

export default function CompanySwitcher({ collapsed = false }: CompanySwitcherProps) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const { data: account, refetch } = useFetchAccount();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const companies = account?.companies || [];
  const activeCompanyRef = (params?.reference as string) || companies[0]?.reference;
  const activeCompany = companies.find((c: any) => c.reference === activeCompanyRef) || companies[0];

  const handleSelectCompany = (companyRef: string) => {
    // If user is inside an event or subpage, route to the selected company's events hub
    router.push(`/company/${companyRef}/events`);
  };

  if (!activeCompany && companies.length === 0) {
    return (
      <div className="px-2 py-3">
        <Button
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full h-9 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Organization</span>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="px-2 py-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={`w-full flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 text-left transition select-none ${
                collapsed ? "justify-center px-1.5" : ""
              }`}
            >
              <Avatar className="h-8 w-8 rounded-lg shrink-0 border border-slate-700 bg-slate-800">
                <AvatarImage src={activeCompany?.logo || undefined} />
                <AvatarFallback className="bg-gradient-to-tr from-cyan-600 to-blue-600 text-white text-xs font-bold rounded-lg">
                  {activeCompany?.name?.[0] || "S"}
                </AvatarFallback>
              </Avatar>

              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    {activeCompany?.name || "Select Organization"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">
                    {activeCompany?.company_code || "SH-ORG"}
                  </p>
                </div>
              )}

              {!collapsed && <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            sideOffset={6}
            className="w-64 bg-slate-900 border-slate-800 text-slate-100 shadow-2xl rounded-2xl p-1.5"
          >
            <DropdownMenuLabel className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
              Your Organizations
            </DropdownMenuLabel>

            {companies.map((company: any) => {
              const isSelected = company.reference === activeCompany?.reference;
              return (
                <DropdownMenuItem
                  key={company.reference}
                  onClick={() => handleSelectCompany(company.reference)}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer hover:bg-slate-800 transition ${
                    isSelected ? "bg-slate-800/80 font-bold text-white" : "text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar className="h-6 w-6 rounded-md shrink-0 border border-slate-700">
                      <AvatarImage src={company.logo || undefined} />
                      <AvatarFallback className="bg-slate-800 text-cyan-400 text-[10px] font-bold">
                        {company.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{company.name}</span>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0 ml-2" />}
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator className="bg-slate-800 my-1" />

            <DropdownMenuItem
              onClick={() => setIsCreateModalOpen(true)}
              disabled={!account?.is_premium && companies.length >= 1}
              className="flex items-center gap-2 p-2 rounded-xl text-xs cursor-pointer text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 font-semibold transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create New Organization</span>
              {!account?.is_premium && companies.length >= 1 && (
                <Lock className="h-3 w-3 text-slate-500 ml-auto" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Organization"
        description="Register a brand to organize live events, sell tickets, and manage M-Pesa payouts."
      >
        <div className="p-6">
          <CreateCompany
            refetch={refetch}
            closeDialog={() => setIsCreateModalOpen(false)}
          />
        </div>
      </Modal>
    </>
  );
}
