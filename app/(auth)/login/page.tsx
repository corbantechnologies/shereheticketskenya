"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { Session, User } from "next-auth";

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
        <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-purple-600 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">S</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome to Sherehe
                        </h1>
                        <p className="text-gray-600">
                            Kenya's Premier Event Management Platform
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium text-gray-700"
                            >
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="pl-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium text-gray-700"
                            >
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Login Button */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-5 w-5" />
                                    <span>Sign In to Sherehe</span>
                                </div>
                            )}
                        </Button>

                        {/* Create Account */}
                        <p className="text-sm text-gray-600 text-center">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/signup"
                                className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                            >
                                Sign up here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;