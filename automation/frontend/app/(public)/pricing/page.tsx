"use client";
import Link from "next/link";
import { Zap, Check, Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-900">Orion</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7">
            <Link href="/features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm text-slate-900 font-medium transition-colors">Pricing</Link>
            <Link href="/about" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">About</Link>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Sign in</Link>
            <Link href="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors">Get started</Link>
          </div>
          <button className="md:hidden p-1.5 rounded-md hover:bg-slate-100 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          <Link href="/features" className="block text-sm text-slate-700 py-2" onClick={() => setMenuOpen(false)}>Features</Link>
          <Link href="/pricing" className="block text-sm text-slate-700 py-2" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <Link href="/about" className="block text-sm text-slate-700 py-2" onClick={() => setMenuOpen(false)}>About</Link>
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/login" className="block text-sm text-slate-700 py-2" onClick={() => setMenuOpen(false)}>Sign in</Link>
            <Link href="/register" className="block bg-indigo-600 text-white text-sm font-semibold text-center px-4 py-2 rounded-lg" onClick={() => setMenuOpen(false)}>Get started</Link>
          </div>
        </div>
      )}
    </header>
  );
}

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For personal projects and getting started. No expiry, no trial period.",
    highlighted: true,
    launchingSoon: false,
    cta: "Get started",
    features: [
      "3 projects",
      "5 pipelines per project",
      "100 pipeline runs / month",
      "GitHub sync (1 repo)",
      "Content queue",
      "Live run logs",
      "Email notifications",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For teams shipping content and automation at scale.",
    highlighted: false,
    launchingSoon: true,
    cta: "Get started",
    features: [
      "Unlimited projects",
      "Unlimited pipelines",
      "10,000 pipeline runs / month",
      "GitHub sync (unlimited repos)",
      "Social publishing (LinkedIn, Twitter/X)",
      "Pipeline run history (90 days)",
      "Webhook triggers",
      "Priority email support",
    ],
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per month",
    description: "For organizations that need custom limits, SSO, and dedicated support.",
    highlighted: false,
    launchingSoon: true,
    cta: "Contact us",
    features: [
      "Everything in Pro",
      "Unlimited pipeline runs",
      "All social platforms",
      "Custom integrations",
      "SSO / SAML",
      "Dedicated Slack support",
      "99.9% uptime SLA",
      "Custom data retention",
      "On-premise option",
    ],
  },
];

const comparison = [
  { feature: "Projects", free: "3", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Pipelines per project", free: "5", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Monthly runs", free: "100", pro: "10,000", enterprise: "Unlimited" },
  { feature: "GitHub repos", free: "1", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Content queue", free: "Yes", pro: "Yes", enterprise: "Yes" },
  { feature: "Social publishing", free: "—", pro: "2 platforms", enterprise: "All platforms" },
  { feature: "Run history", free: "7 days", pro: "90 days", enterprise: "Custom" },
  { feature: "Webhooks", free: "—", pro: "Yes", enterprise: "Yes" },
  { feature: "SSO / SAML", free: "—", pro: "—", enterprise: "Yes" },
  { feature: "SLA", free: "—", pro: "—", enterprise: "99.9%" },
  { feature: "Support", free: "Community", pro: "Priority email", enterprise: "Dedicated Slack" },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Beta banner */}
      <div className="bg-indigo-600 text-white py-2.5 text-center text-sm">
        All plans are unlimited and free during beta.
      </div>

      <Navbar />

      {/* Heading */}
      <section className="py-16 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="font-black text-5xl text-slate-900 tracking-tight mb-3">Pricing</h1>
          <p className="text-base text-slate-500 leading-relaxed max-w-md">
            Simple and transparent. Scale as you need. All plans are free during the beta period.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-5 items-start">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border bg-white overflow-hidden ${
                  plan.highlighted
                    ? "border-indigo-400 ring-1 ring-indigo-400"
                    : "border-slate-200"
                }`}
              >
                <div className="px-6 py-5 border-b border-slate-100">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-slate-900">{plan.name}</h3>
                    {plan.launchingSoon && (
                      <span className="text-xs text-slate-400 font-medium border border-slate-200 px-2 py-0.5 rounded-md">Launching soon</span>
                    )}
                    {plan.highlighted && (
                      <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">Active now</span>
                    )}
                  </div>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">{plan.price}</span>
                    <span className="text-sm text-slate-500 mb-1">/ {plan.period}</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{plan.description}</p>
                </div>

                <div className="px-6 py-4 border-b border-slate-100">
                  <Link
                    href="/register"
                    className={`block text-center font-semibold py-2 px-4 rounded-lg text-sm transition-colors ${
                      plan.highlighted
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "border border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-900"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>

                <div className="px-6 py-5 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-black text-3xl text-slate-900 tracking-tight mb-8">Full comparison</h2>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200">
              <div className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Feature</div>
              <div className="px-5 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wide text-center">Free</div>
              <div className="px-5 py-3 text-xs font-semibold text-indigo-600 uppercase tracking-wide text-center">Pro</div>
              <div className="px-5 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wide text-center">Enterprise</div>
            </div>
            {comparison.map((row, index) => (
              <div
                key={row.feature}
                className={`grid grid-cols-4 border-b border-slate-100 ${index === comparison.length - 1 ? "border-b-0" : ""} ${index % 2 === 1 ? "bg-slate-50/50" : ""}`}
              >
                <div className="px-5 py-3 text-sm text-slate-700 font-medium">{row.feature}</div>
                <div className="px-5 py-3 text-sm text-slate-500 text-center">{row.free}</div>
                <div className="px-5 py-3 text-sm text-slate-700 text-center font-medium">{row.pro}</div>
                <div className="px-5 py-3 text-sm text-slate-700 text-center font-medium">{row.enterprise}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-black text-4xl text-white tracking-tight mb-4">Start automating in minutes.</h2>
          <p className="text-indigo-200 text-base mb-8 max-w-md mx-auto leading-relaxed">
            The Free plan is yours indefinitely. No credit card, no trial clock, no nag emails.
          </p>
          <Link href="/register" className="inline-block bg-white text-indigo-700 hover:bg-indigo-50 font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
            Get started free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm">Orion</span>
            <span className="text-slate-400 text-sm ml-2">Automation for engineers and creators.</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/features" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Pricing</Link>
            <Link href="/about" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">About</Link>
          </nav>
          <p className="text-sm text-slate-400">© 2026 Orion</p>
        </div>
      </footer>
    </div>
  );
}
