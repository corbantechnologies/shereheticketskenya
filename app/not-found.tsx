import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Illustration / Icon Area */}
        <div className="relative mx-auto w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center mb-8 animate-pulse">
          <Search className="h-24 w-24 text-gray-400" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="text-8xl font-bold text-[#045e32] opacity-20">
              404
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Page not found
          </h1>
          <p className="text-lg text-gray-600">
            Sorry, we couldn&apos;t find the page you&lsquo;re looking for. It might have
            been removed, renamed, or doesn&lsquo;t exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button
            asChild
            variant="default"
            className="bg-[#045e32] hover:bg-[#034625] h-12 px-8"
          >
            <Link href="/" className="gap-2 flex items-center">
              <Home className="h-4 w-4" />
              Go to Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-12 px-8 border-gray-300"
          >
            <Link href="/events" className="gap-2 flex items-center">
              <Search className="h-4 w-4" />
              Browse Events
            </Link>
          </Button>
        </div>

        <div className="pt-12 border-t border-gray-200 mt-12 text-sm text-gray-500">
          <p>
            Need help?{" "}
            <a
              href="mailto:support@sherehetickets.co.ke"
              className="text-[#045e32] hover:underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
