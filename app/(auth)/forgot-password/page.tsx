/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/services/accounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-[#d5d5d5] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <span className="text-xl font-semibold tracking-tight">
              Sherehe <span className="text-[var(--mainRed)]">Tickets</span>
            </span>
          </Link>
          <h1 className="text-lg font-semibold text-foreground mt-4">Forgot your password?</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your email and we&apos;ll send you a reset code.
          </p>
        </div>

        <Card className="py-0 border-none shadow-lg bg-white">
          <CardContent className="p-6">
            <Formik
              initialValues={{ email: "" }}
              validationSchema={forgotPasswordSchema}
              onSubmit={async (values) => {
                setLoading(true);
                try {
                  await forgotPassword(values);
                  toast.success("Reset code sent to your email!");
                  router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
                } catch (error: any) {
                  toast.error(
                    error.response?.data?.detail || "Failed to send reset code. Please try again."
                  );
                } finally {
                  setLoading(false);
                }
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm text-foreground/80">
                      Email address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Field
                        name="email"
                        as={Input}
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-9 h-10 text-sm"
                      />
                    </div>
                    {errors.email && touched.email && (
                      <p className="text-red-500 text-xs">{errors.email}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="w-full h-10 bg-[var(--mainBlue)] hover:bg-[var(--mainBlue)]/90 text-white text-sm"
                  >
                    {isSubmitting || loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <Send className="h-4 w-4" />
                        <span>Send reset code</span>
                      </div>
                    )}
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>

        <div className="mt-5 text-center text-sm text-muted-foreground">
          <Link href="/login" className="inline-flex items-center gap-1 text-[var(--mainBlue)] hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </Link>
        </div>

      </div>
    </div>
  );
}
