"use client";
import Link from "next/link";
import { Zap, Menu, X } from "lucide-react";
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
            <Link href="/pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Pricing</Link>
            <Link href="/about" className="text-sm text-slate-900 font-medium transition-colors">About</Link>
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

const values = [
  {
    title: "Automation should be boring",
    description:
      "A pipeline that runs at 3am, pushes to GitHub, and puts a post in a queue shouldn't require a ceremony. Orion treats automation as infrastructure — it should just work, log what it did, and stay out of your way until something actually breaks.",
  },
  {
    title: "Local-first mindset",
    description:
      "Your notebooks, scripts, and content live in your GitHub repos — not locked inside Orion's database. We read from and write to your existing files. If you ever leave, nothing is trapped behind an export button.",
  },
  {
    title: "Built in public",
    description:
      "We're in public beta and shipping fast. The roadmap is visible, feedback from real users shapes what we build next, and we tell you directly when something isn't done yet instead of hiding it behind a feature flag.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* Hero */}
      <section className="py-20 border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-black text-5xl text-slate-900 tracking-tight leading-[1.1] mb-6">
            We're building the automation layer for creators and engineers.
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Orion started as an internal tool. Running a Jupyter notebook on a schedule, committing the output to GitHub, and putting the result in a content queue required four separate tools and a weekend of duct-tape integration work. We built one thing that does the full loop — fetch, run, transform, push, publish — and made it reliable enough to stop thinking about. That tool is Orion. We opened it up when the same setup started solving problems for other engineers and creators we knew. We're a small team, still early, and building this alongside people who use it every day.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-black text-3xl text-slate-900 tracking-tight mb-10">What we believe</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {values.map((value) => (
              <div key={value.title} className="bg-white border border-slate-200 rounded-xl p-6 hover:border-indigo-200 transition-colors">
                <div className="w-6 h-6 bg-indigo-600 rounded-md mb-4" />
                <h3 className="font-bold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{value.description}</p>
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
            Free during beta. We'd rather you try it and tell us what's broken than read about it.
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
