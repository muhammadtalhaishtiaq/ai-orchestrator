"use client";
import Link from "next/link";
import { Zap, Check, Lock, ArrowLeft } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for personal projects and getting started with automation.",
    color: "border-slate-200",
    headerBg: "bg-slate-50",
    badgeText: null,
    cta: "Get started",
    features: [
      "3 projects",
      "5 pipelines per project",
      "100 pipeline runs / month",
      "GitHub sync (1 repo)",
      "Content queue",
      "Email notifications",
      "Community support",
    ],
    comingSoon: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For creators and teams who need more power and integrations.",
    color: "border-indigo-300 ring-2 ring-indigo-600",
    headerBg: "bg-indigo-600",
    badgeText: "Most Popular",
    cta: "Get started",
    features: [
      "Unlimited projects",
      "Unlimited pipelines",
      "10,000 pipeline runs / month",
      "GitHub sync (unlimited repos)",
      "Social publishing (LinkedIn, Twitter)",
      "Media generation (100 credits/mo)",
      "Priority email support",
      "Pipeline run history (90 days)",
      "Webhook triggers",
    ],
    comingSoon: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per month",
    description: "For teams and organizations with advanced needs and SLA requirements.",
    color: "border-slate-200",
    headerBg: "bg-slate-900",
    badgeText: null,
    cta: "Contact us",
    features: [
      "Everything in Pro",
      "Unlimited pipeline runs",
      "Media generation (unlimited)",
      "All social platforms",
      "Custom integrations",
      "SSO / SAML",
      "Dedicated Slack support",
      "99.9% uptime SLA",
      "Custom data retention",
      "On-premise option",
    ],
    comingSoon: true,
  },
];

const comparison = [
  { feature: "Projects", free: "3", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Pipelines", free: "5 / project", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Monthly runs", free: "100", pro: "10,000", enterprise: "Unlimited" },
  { feature: "GitHub sync", free: "1 repo", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Social publishing", free: "—", pro: "2 platforms", enterprise: "All platforms" },
  { feature: "Media generation", free: "—", pro: "100 credits/mo", enterprise: "Unlimited" },
  { feature: "Pipeline history", free: "7 days", pro: "90 days", enterprise: "Custom" },
  { feature: "Webhooks", free: "—", pro: "✓", enterprise: "✓" },
  { feature: "SSO / SAML", free: "—", pro: "—", enterprise: "✓" },
  { feature: "SLA", free: "—", pro: "—", enterprise: "99.9%" },
  { feature: "Support", free: "Community", pro: "Priority email", enterprise: "Dedicated Slack" },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">Orion</span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </header>

      {/* Beta banner */}
      <div className="bg-indigo-600 text-white py-3 px-4 text-center">
        <p className="text-sm font-semibold">
          All plans are FREE during beta — unlimited access for early users.{" "}
          <Link href="/register" className="underline underline-offset-2 hover:text-indigo-100 transition-colors">
            Sign up now →
          </Link>
        </p>
      </div>

      {/* Header */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-slate-500">
            Start for free and scale as you grow. No surprises, no hidden fees.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {plans.map((plan) => (
              <div key={plan.name} className={`relative rounded-2xl border ${plan.color} overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow`}>
                {/* Coming soon overlay */}
                {plan.comingSoon && (
                  <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[1px] flex flex-col items-center justify-center rounded-2xl">
                    <div className="bg-slate-900 text-white px-5 py-3 rounded-xl flex items-center gap-2.5 shadow-lg">
                      <Lock className="w-4 h-4 text-indigo-400" />
                      <span className="font-semibold text-sm">Coming Soon</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-3 text-center px-6">
                      Available after beta. Use Free plan with full access now.
                    </p>
                  </div>
                )}

                {/* Header */}
                <div className={`${plan.headerBg} px-6 py-6`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className={`font-bold text-lg ${plan.headerBg === "bg-indigo-600" || plan.headerBg === "bg-slate-900" ? "text-white" : "text-slate-900"}`}>
                      {plan.name}
                    </h3>
                    {plan.badgeText && (
                      <span className="bg-white text-indigo-600 text-xs font-bold px-2.5 py-1 rounded-full">
                        {plan.badgeText}
                      </span>
                    )}
                  </div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className={`text-4xl font-extrabold ${plan.headerBg === "bg-indigo-600" || plan.headerBg === "bg-slate-900" ? "text-white" : "text-slate-900"}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm mb-1.5 ${plan.headerBg === "bg-indigo-600" || plan.headerBg === "bg-slate-900" ? "text-indigo-100" : "text-slate-500"}`}>
                      / {plan.period}
                    </span>
                  </div>
                  <p className={`text-sm ${plan.headerBg === "bg-indigo-600" || plan.headerBg === "bg-slate-900" ? "text-indigo-100" : "text-slate-500"}`}>
                    {plan.description}
                  </p>
                </div>

                {/* CTA */}
                <div className="px-6 py-4 border-b border-slate-100">
                  <Link
                    href="/register"
                    className={`block text-center font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors ${
                      plan.name === "Pro"
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>

                {/* Features */}
                <div className="px-6 py-5 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-12 text-center">Full feature comparison</h2>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Table header */}
            <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200">
              <div className="px-6 py-4 text-sm font-semibold text-slate-600">Feature</div>
              <div className="px-6 py-4 text-sm font-semibold text-slate-700 text-center">Free</div>
              <div className="px-6 py-4 text-sm font-bold text-indigo-600 text-center">Pro</div>
              <div className="px-6 py-4 text-sm font-semibold text-slate-700 text-center">Enterprise</div>
            </div>
            {/* Rows */}
            {comparison.map((row, index) => (
              <div
                key={row.feature}
                className={`grid grid-cols-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${index === comparison.length - 1 ? "border-b-0" : ""}`}
              >
                <div className="px-6 py-3.5 text-sm text-slate-700 font-medium">{row.feature}</div>
                <div className="px-6 py-3.5 text-sm text-slate-500 text-center">{row.free}</div>
                <div className="px-6 py-3.5 text-sm text-slate-700 text-center font-medium">{row.pro}</div>
                <div className="px-6 py-3.5 text-sm text-slate-700 text-center font-medium">{row.enterprise}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Start building for free today</h2>
          <p className="text-slate-500 mb-8">All plans are free during our public beta. Upgrade when we launch paid tiers.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-indigo-100"
          >
            Get started free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-slate-900">Orion</span>
          </Link>
          <p className="text-slate-400 text-sm">© 2026 Orion. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
