"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Sparkles,
  LogIn,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { Session, User } from "next-auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Define the expected shape of the user in the session
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
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--mainRed)]/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--mainBlue)]/10 blur-[150px] rounded-full animate-pulse delay-700" />

      <div className="relative z-10 w-full max-w-lg">
        <Card className="bg-white/5 border-white/10 backdrop-blur-3xl shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="p-10 pb-4 text-center">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--mainRed)] to-[#FF8C8C] flex items-center justify-center mb-6 shadow-xl shadow-[var(--mainRed)]/30 transform hover:scale-110 transition-transform cursor-pointer">
              <span className="text-white text-4xl font-black italic tracking-tighter">
                S
              </span>
            </div>
            <CardTitle className="text-4xl font-bold text-white tracking-tight">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-400 text-lg mt-2 font-light">
              Sign in to manage your premium sherehe experience.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-10 pt-4">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Email Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-gray-300 ml-1 text-sm font-medium"
                >
                  Email Address
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--mainRed)] transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-white/10 border-white/10 text-white h-14 pl-12 focus:ring-[var(--mainRed)] focus:border-[var(--mainRed)] placeholder:text-gray-600 rounded-2xl transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <Label
                    htmlFor="password"
                    className="text-gray-300 text-sm font-medium"
                  >
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-gray-500 hover:text-[var(--mainRed)] transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--mainRed)] transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="bg-white/10 border-white/10 text-white h-14 pl-12 pr-12 focus:ring-[var(--mainRed)] focus:border-[var(--mainRed)] placeholder:text-gray-600 rounded-2xl transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[var(--mainRed)] hover:bg-[var(--mainRed)]/90 text-white font-bold rounded-2xl text-lg shadow-xl shadow-[var(--mainRed)]/20 transition-all active:scale-[0.98] group"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    <span>Sign In</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </div>
                )}
              </Button>

              {/* Create Account Link */}
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#0A0A0B]/50 px-2 text-gray-500 backdrop-blur-sm">
                      New to Sherehe?
                    </span>
                  </div>
                </div>

                <p className="text-gray-400 font-light">
                  Start your journey as an{" "}
                  <Link
                    href="/signup/organizer"
                    className="text-[var(--mainRed)] hover:underline font-medium transition-colors"
                  >
                    Organizer
                  </Link>{" "}
                  or{" "}
                  <Link
                    href="/events"
                    className="text-[#FF8C8C] hover:underline font-medium transition-colors"
                  >
                    Attendee
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer Copy */}
        <p className="mt-8 text-center text-xs text-gray-600 font-light tracking-widest uppercase">
          © 2025 Sherehe Platform · Powered by Corban Technologies
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
