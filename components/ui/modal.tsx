"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
    description?: string;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    className,
    description,
}: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 print:hidden">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div
                className={cn(
                    "relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col",
                    className
                )}
            >
                {(title || description) && (
                    <div className="flex items-center justify-between p-6 border-b shrink-0">
                        <div>
                            {title && <h2 className="text-2xl font-bold text-gray-900">{title}</h2>}
                            {description && <p className="text-muted-foreground mt-1">{description}</p>}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                )}

                <div className="p-8 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
