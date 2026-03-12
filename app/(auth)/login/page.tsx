"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { Session, User } from "next-auth";
import { Card, CardContent } from "@/components/ui/card";

interface CustomUser extends User {
  is_admin?: boolean;
  is_event_manager?: boolean;
  is_staff?: boolean;
}

interface CustomSession extends Session {
  user?: CustomUser;
}

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const response = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    const session = (await getSession()) as CustomSession | null;
    setLoading(false);

    if (response?.error) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Login successful! Redirecting...");
      if (session?.user?.is_staff === true) {
        router.push("/admin/dashboard");
      } else if (session?.user?.is_event_manager === true) {
        router.push("/organizer/dashboard");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#d5d5d5] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo / brand */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <span className="text-xl font-semibold tracking-tight">
              Sherehe <span className="text-[var(--mainRed)]">Tickets</span>
            </span>
          </Link>
          <h1 className="text-lg font-semibold text-foreground mt-4">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
        </div>

        {/* Form card */}
        <Card className="py-0 border-none shadow-lg bg-white">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm text-foreground/80">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-9 h-10 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-sm text-foreground/80">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-[var(--mainBlue)] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 pr-10 h-10 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-[var(--mainBlue)] hover:bg-[var(--mainBlue)]/90 text-white text-sm mt-2"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <LogIn className="h-4 w-4" />
                    <span>Sign in</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>

            </form>
          </CardContent>
        </Card>

        {/* Sign up links */}
        <div className="mt-5 text-center text-sm text-muted-foreground space-y-1">
          <p>
            New here? Join as an{" "}
            <Link href="/signup/organizer" className="text-[var(--mainBlue)] hover:underline font-medium">
              Organizer
            </Link>{" "}
            or browse{" "}
            <Link href="/events" className="text-[var(--mainRed)] hover:underline font-medium">
              Events
            </Link>
          </p>
          <p className="text-xs text-muted-foreground/60 mt-4">
            © {new Date().getFullYear()} Sherehe · Corban Technologies
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginForm;
