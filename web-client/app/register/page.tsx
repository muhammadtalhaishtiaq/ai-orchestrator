"use client";

import React from "react"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const passwordRequirements = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(formData.password) },
    { label: "Contains number", met: /[0-9]/.test(formData.password) },
    { label: "Contains special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) },
  ];

  const passwordsMatch =
    formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate registration
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0a0a1a] py-8">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0f1029] to-[#0a0a1a]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo/Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 mb-4">
            <Sparkles className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            PROJECT NEBULA
          </h1>
          <p className="text-gray-400 text-sm mt-1">Hybrid AI Orchestrator</p>
        </div>

        {/* Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white">Create your account</h2>
            <p className="text-gray-400 text-sm mt-1">Start your AI journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-300 text-sm">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 h-11"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 text-sm">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 h-11"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 text-sm">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 h-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Requirements */}
              {formData.password.length > 0 && (
                <div className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-gray-400 mb-2">Password requirements:</p>
                  <div className="grid grid-cols-1 gap-1">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {req.met ? (
                          <Check className="w-3.5 h-3.5 text-cyan-400" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-gray-500" />
                        )}
                        <span
                          className={`text-xs ${req.met ? "text-cyan-400" : "text-gray-500"}`}
                        >
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300 text-sm">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 h-11 ${
                    formData.confirmPassword.length > 0
                      ? passwordsMatch
                        ? "border-cyan-500/50"
                        : "border-red-500/50"
                      : ""
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formData.confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-red-400">Passwords do not match</p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, agreeTerms: checked as boolean })
                }
                className="border-white/20 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 mt-0.5"
              />
              <Label htmlFor="terms" className="text-sm text-gray-400 cursor-pointer leading-tight">
                I agree to the{" "}
                <Link href="/terms" className="text-cyan-400 hover:text-cyan-300">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !formData.agreeTerms || !passwordsMatch}
              className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[#0f1029] text-gray-500">or sign up with</span>
            </div>
          </div>

          {/* Social Signup */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </Button>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Features */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { icon: "AI-Powered", label: "Smart AI" },
            { icon: "Secure", label: "Enterprise" },
            { icon: "Fast", label: "Real-time" },
          ].map((feature, index) => (
            <div
              key={index}
              className="text-center p-3 rounded-xl bg-white/5 border border-white/10"
            >
              <p className="text-xs text-cyan-400 font-medium">{feature.icon}</p>
              <p className="text-xs text-gray-500 mt-1">{feature.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
