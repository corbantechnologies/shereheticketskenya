"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit3, Trash } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface Event {
    reference: string;
    event_code: string;
    name: string;
    start_date: string;
    venue: string | null;
    start_time?: string | null;
    end_time?: string | null;
    is_closed: boolean;
}

interface CompanyEventsTableProps {
    events: Event[];
    companyReference: string;
}

export default function CompanyEventsTable({
    events,
    companyReference,
}: CompanyEventsTableProps) {
    const router = useRouter();

    const handleRowClick = (eventCode: string) => {
        router.push(`/company/${companyReference}/events/${eventCode}`);
    };

    const formatTime = (time?: string | null) => {
        if (!time) return "00:00am";
        // Assuming time is in HH:mm:ss format
        const [hours, minutes] = time.split(":");
        const date = new Date();
        date.setHours(parseInt(hours));
        date.setMinutes(parseInt(minutes));
        return format(date, "hh:mma");
    };

    return (
        <div className="bg-white">
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-gray-100 hover:bg-transparent">
                        <TableHead className="w-[50px] pl-6 py-4">
                            <Checkbox className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-[4px]" />
                        </TableHead>
                        <TableHead className="w-[60px] font-bold text-gray-400 text-xs uppercase tracking-wider py-4">#</TableHead>
                        <TableHead className="font-bold text-gray-400 text-xs uppercase tracking-wider py-4">
                            Event Name <span className="ml-1 text-[10px] text-gray-300">▲</span>
                        </TableHead>
                        <TableHead className="font-bold text-gray-400 text-xs uppercase tracking-wider py-4">
                            Location <span className="ml-1 text-[10px] text-gray-300">▲</span>
                        </TableHead>
                        <TableHead className="font-bold text-gray-400 text-xs uppercase tracking-wider py-4">
                            Hours <span className="ml-1 text-[10px] text-gray-300">▲</span>
                        </TableHead>
                        <TableHead className="font-bold text-gray-400 text-xs uppercase tracking-wider text-right pr-12 py-4">
                            Date <span className="ml-1 text-[10px] text-gray-300">▲</span>
                        </TableHead>
                        <TableHead className="w-[50px] py-4"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {events.length > 0 ? (
                        events.map((event, index) => (
                            <TableRow
                                key={event.reference}
                                className="hover:bg-blue-50/30 cursor-pointer border-b border-gray-50 transition-colors group"
                                onClick={() => handleRowClick(event.event_code)}
                            >
                                <TableCell className="pl-6 py-4" onClick={(e) => e.stopPropagation()}>
                                    <Checkbox className="border-gray-200 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-[4px]" />
                                </TableCell>
                                <TableCell className="font-medium text-gray-900 py-4">{index + 1}</TableCell>
                                <TableCell className="py-4">
                                    <span className="font-bold text-gray-700 text-sm group-hover:text-blue-600 transition-colors">
                                        {event.name}
                                    </span>
                                </TableCell>
                                <TableCell className="text-gray-500 text-sm py-4 font-medium">
                                    {event.venue || "Online / TBA"}
                                </TableCell>
                                <TableCell className="text-gray-500 text-sm font-medium py-4">
                                    {event.start_time ? formatTime(event.start_time) : "00:00am"} -{" "}
                                    {event.end_time ? formatTime(event.end_time) : "00:00pm"}
                                </TableCell>
                                <TableCell className="text-right pr-12 text-gray-500 text-sm font-medium py-4">
                                    {format(new Date(event.start_date), "dd.MM.yyyy")}
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()} className="py-4">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[160px]">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={() => handleRowClick(event.event_code)}
                                                >
                                                    <Edit3 className="mr-2 h-3.5 w-3.5" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash className="mr-2 h-3.5 w-3.5" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="h-32 text-center text-gray-400">
                                No events found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
