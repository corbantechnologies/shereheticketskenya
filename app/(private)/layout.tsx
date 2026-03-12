// app/(private)/layout.tsx
import { User } from "lucide-react";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#d5d5d5]">
      <main className="flex-1">{children}</main>
      <footer className="py-4 text-center text-xs text-muted-foreground/60">
        <User className="inline h-3 w-3 mr-1" />
        Sherehe Organizer Portal · Corban Technologies
      </footer>
    </div>
  );
}
