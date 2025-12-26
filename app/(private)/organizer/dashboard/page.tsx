"use client";

import { useFetchAccount } from "@/hooks/accounts/actions";
import { DashboardSkeleton } from "@/components/general/LoadingComponents";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, PartyPopper, Lock } from "lucide-react";

export default function OrganizerDashboardPage() {
    const { isLoading: isLoadingOrganizer, data: organizer } = useFetchAccount();

    if (isLoadingOrganizer) return <DashboardSkeleton />;

    if (!organizer) {
        return <div className="p-8 text-center">Unable to load dashboard.</div>;
    }

    const { first_name, is_premium, companies } = organizer;

    return (
        <div className="min-h-screen bg-background p-6 md:p-10">
            {/* Greeting */}
            <div className="mb-10">
                <h1 className="text-4xl font-bold text-foreground mb-2">
                    Welcome back, {first_name}! 🎉
                </h1>
                <p className="text-lg text-muted-foreground">
                    Manage your event companies and plan amazing sherehe.
                </p>
            </div>

            {/* Stats + CTA */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Badge variant={is_premium ? "default" : "secondary"}>
                        {is_premium ? "Premium" : "Free Plan"}
                    </Badge>
                    <span className="text-muted-foreground">
                        {companies.length} {companies.length === 1 ? "Company" : "Companies"}
                    </span>
                </div>

                <Button
                    size="lg"
                    disabled={!is_premium}
                    className="bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    New Company
                    {!is_premium && <Lock className="ml-2 h-4 w-4" />}
                </Button>
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {companies.map((company: any) => (
                    <Card
                        key={company.reference}
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => console.log("Select:", company.company_code)} // Replace with navigation later
                    >
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={company.logo || undefined} />
                                    <AvatarFallback>
                                        <Building2 className="h-6 w-6" />
                                    </AvatarFallback>
                                </Avatar>
                                <PartyPopper className="h-8 w-8 text-[var(--mainRed)] opacity-20" />
                            </div>
                            <CardTitle className="text-lg mt-4">{company.name}</CardTitle>
                            <CardDescription>{company.company_code}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full" size="sm">
                                View Events
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}