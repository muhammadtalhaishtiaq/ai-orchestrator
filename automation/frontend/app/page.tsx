"use client";
import Link from "next/link";
import {
  Zap,
  Calendar,
  FolderOpen,
  GitBranch,
  Share2,
  Video,
  ArrowRight,
  CheckCircle,
  Menu,
  X,
  Github,
  Twitter,
  Linkedin,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: GitBranch,
    title: "Pipeline Builder",
    description:
      "Drag-and-drop pipeline editor for defining multi-step automation workflows. Chain triggers, transformations, and publishing actions visually.",
    badge: null,
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description:
      "Define cron schedules or event-driven triggers. Orion runs your pipelines on time, every time — with retry logic and failure alerts.",
    badge: null,
  },
  {
    icon: FolderOpen,
    title: "Multi-Project",
    description:
      "Manage multiple independent automation projects from a single workspace. Isolate environments, pipelines, and credentials per project.",
    badge: null,
  },
  {
    icon: Github,
    title: "GitHub Sync",
    description:
      "Connect your repositories and sync notebooks, scripts, or content. Commit and push results automatically when a pipeline run completes.",
    badge: null,
  },
  {
    icon: Video,
    title: "Media Generation",
    description:
      "Generate AI-powered images, video clips, and audio narration from your content pipelines. Supports multiple model backends.",
    badge: "Coming Soon",
  },
  {
    icon: Share2,
    title: "Social Publishing",
    description:
      "Publish to LinkedIn, Twitter/X, Instagram, and YouTube directly from your pipeline. Schedule posts and track engagement metrics.",
    badge: "Coming Soon",
  },
];

const steps = [
  {
    number: "01",
    title: "Create a Project",
    description:
      "Set up a named project, connect your GitHub repository, and configure your automation credentials in minutes.",
  },
  {
    number: "02",
    title: "Build your Pipeline",
    description:
      "Use the visual pipeline builder to define each step — fetch data, run a notebook, generate media, or post to social.",
  },
  {
    number: "03",
    title: "Publish Automatically",
    description:
      "Set a schedule or trigger, activate the pipeline, and let Orion handle everything from execution to delivery.",
  },
];

const integrations = [
  { name: "GitHub", color: "text-slate-800" },
  { name: "OpenAI", color: "text-emerald-700" },
  { name: "YouTube", color: "text-red-600" },
  { name: "Instagram", color: "text-pink-600" },
  { name: "LinkedIn", color: "text-blue-700" },
  { name: "Jupyter", color: "text-orange-500" },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900 text-lg">Orion</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
                Pricing
              </Link>
              <Link href="/about" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
                About
              </Link>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="text-slate-600 hover:text-slate-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Get started free
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3">
            <Link href="/features" className="block text-slate-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Features</Link>
            <Link href="/pricing" className="block text-slate-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Pricing</Link>
            <Link href="/about" className="block text-slate-700 font-medium py-2" onClick={() => setMenuOpen(false)}>About</Link>
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" className="btn-secondary text-center">Login</Link>
              <Link href="/register" className="btn-primary text-center">Get started free</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="gradient-hero absolute inset-0 opacity-[0.06]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 lg:pt-32 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                Now in public beta — free for all users
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.08] tracking-tight mb-6">
                Automate Anything.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                  Publish Everywhere.
                </span>
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed mb-8 max-w-lg">
                Build powerful automation pipelines for content, notebooks, videos, and social
                media — on your schedule. No infrastructure required.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-indigo-200"
                >
                  Start for free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/features"
                  className="inline-flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-semibold px-6 py-3.5 rounded-xl transition-colors hover:bg-slate-50"
                >
                  See how it works
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6">
                {["No credit card required", "Unlimited pipelines in beta", "Deploy in minutes"].map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-sm text-slate-500">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Terminal mockup */}
            <div className="hidden lg:block">
              <div className="bg-slate-950 rounded-2xl shadow-2xl shadow-indigo-100 overflow-hidden border border-slate-800">
                {/* Terminal header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-3 text-slate-400 text-xs font-mono">orion — pipeline run</span>
                </div>
                {/* Terminal body */}
                <div className="p-5 font-mono text-sm space-y-2">
                  <div className="text-slate-400">
                    <span className="text-indigo-400">▶</span> Starting pipeline{" "}
                    <span className="text-violet-400">content-weekly</span>
                  </div>
                  <div className="text-slate-400">
                    <span className="text-emerald-400">✓</span> GitHub sync complete{" "}
                    <span className="text-slate-600">— 12 notebooks fetched</span>
                  </div>
                  <div className="text-slate-400">
                    <span className="text-emerald-400">✓</span> Notebook executed{" "}
                    <span className="text-slate-600">— 2.4s</span>
                  </div>
                  <div className="text-slate-400">
                    <span className="text-emerald-400">✓</span> Content generated{" "}
                    <span className="text-slate-600">— GPT-4o</span>
                  </div>
                  <div className="text-slate-400">
                    <span className="text-yellow-400">⟳</span> Publishing to LinkedIn...
                  </div>
                  <div className="text-slate-400">
                    <span className="text-emerald-400">✓</span> LinkedIn post published
                  </div>
                  <div className="text-slate-400">
                    <span className="text-yellow-400">⟳</span> Publishing to Twitter/X...
                  </div>
                  <div className="text-slate-400">
                    <span className="text-emerald-400">✓</span> Twitter post published
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800 text-slate-500">
                    Pipeline completed in{" "}
                    <span className="text-emerald-400 font-semibold">4.1s</span>
                    {" "}· 4 steps · 0 errors
                  </div>
                </div>
                {/* Stats bar */}
                <div className="px-5 py-4 bg-slate-900 border-t border-slate-800 grid grid-cols-3 gap-4">
                  {[
                    { label: "Runs today", value: "24" },
                    { label: "Success rate", value: "99.2%" },
                    { label: "Avg. duration", value: "3.8s" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-slate-400 text-xs">{stat.label}</p>
                      <p className="text-white font-bold text-lg">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations strip */}
      <section className="border-y border-slate-100 bg-slate-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-400 font-medium uppercase tracking-wider mb-6">
            Trusted integrations with
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {integrations.map((integration) => (
              <span key={integration.name} className={`font-bold text-lg ${integration.color} opacity-70 hover:opacity-100 transition-opacity`}>
                {integration.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
              Everything you need to automate at scale
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              From building pipelines to publishing content, Orion handles the full workflow so you can focus on what matters.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="relative gradient-card rounded-2xl border border-slate-200 p-6 hover:border-indigo-200 hover:shadow-md transition-all group"
                >
                  {feature.badge && (
                    <span className="absolute top-4 right-4 bg-violet-100 text-violet-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {feature.badge}
                    </span>
                  )}
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                    <Icon className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">How it works</h2>
            <p className="text-xl text-slate-500 max-w-xl mx-auto">
              Get from zero to fully automated in three simple steps.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-indigo-200 to-transparent z-0 -translate-x-8" />
                )}
                <div className="relative bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-5xl font-black text-indigo-100 mb-4 leading-none">{step.number}</div>
                  <h3 className="font-bold text-slate-900 text-lg mb-3">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
            >
              Start building your first pipeline
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gradient-hero rounded-3xl p-12 text-center text-white shadow-2xl shadow-indigo-200">
            <h2 className="text-4xl font-extrabold mb-4">
              Ready to automate your workflow?
            </h2>
            <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
              Join hundreds of builders already using Orion to save hours every week. Free during our public beta.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-8 py-4 rounded-xl transition-colors shadow-lg"
            >
              Get started free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="mt-4 text-indigo-200 text-sm">No credit card required. Free forever during beta.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-slate-900 text-lg">Orion</span>
              </Link>
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                The automation platform for builders. Pipelines, publishing, and everything in between.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-4">Product</h4>
              <ul className="space-y-2.5">
                {["Features", "Pricing", "About", "Blog"].map((link) => (
                  <li key={link}>
                    <Link
                      href={`/${link.toLowerCase()}`}
                      className="text-slate-500 hover:text-slate-900 text-sm transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-4">Follow us</h4>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 rounded-lg bg-slate-200 hover:bg-indigo-100 flex items-center justify-center transition-colors group">
                  <Twitter className="w-4 h-4 text-slate-600 group-hover:text-indigo-600" />
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-slate-200 hover:bg-indigo-100 flex items-center justify-center transition-colors group">
                  <Github className="w-4 h-4 text-slate-600 group-hover:text-indigo-600" />
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-slate-200 hover:bg-indigo-100 flex items-center justify-center transition-colors group">
                  <Linkedin className="w-4 h-4 text-slate-600 group-hover:text-indigo-600" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-slate-400 text-sm">© 2026 Orion. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-slate-600 text-sm transition-colors">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-slate-600 text-sm transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
