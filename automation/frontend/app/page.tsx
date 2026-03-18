"use client";
import Link from "next/link";
import {
  Zap,
  Calendar,
  FolderOpen,
  GitBranch,
  Share2,
  Terminal,
  Menu,
  X,
  Activity,
} from "lucide-react";
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

const features = [
  {
    icon: Calendar,
    title: "Scheduled pipelines",
    description: "Set a cron expression or pick from daily, weekly, or hourly presets. Orion runs your pipeline on time, retries on failure, and emails you if something breaks.",
    roadmap: false,
  },
  {
    icon: GitBranch,
    title: "GitHub push",
    description: "Connect a repo and Orion commits notebook outputs or generated files after every run. Full git history means you can always see what changed and when.",
    roadmap: false,
  },
  {
    icon: Share2,
    title: "Content queue",
    description: "Draft content items inside Orion, attach them to a pipeline, and let the schedule handle publishing. One queue per project, no spreadsheets needed.",
    roadmap: false,
  },
  {
    icon: FolderOpen,
    title: "Project isolation",
    description: "Each project has its own pipelines, credentials, and content queue. Switch between client work and personal projects without any crossover.",
    roadmap: false,
  },
  {
    icon: Activity,
    title: "Live run logs",
    description: "Watch each pipeline step execute in real time. Logs are stored per run so you can go back and debug anything that failed, step by step.",
    roadmap: false,
  },
  {
    icon: Terminal,
    title: "Step-by-step builder",
    description: "Define each automation step once — fetch, run, transform, publish. Steps are reorderable and independently testable before you activate the full pipeline.",
    roadmap: true,
  },
];

const steps = [
  {
    number: "01",
    title: "Connect your repo",
    description: "Authenticate with GitHub, pick a repository, and Orion pulls in your notebooks and scripts. Takes about 60 seconds.",
  },
  {
    number: "02",
    title: "Define your pipeline",
    description: "Add steps in order: run a notebook, transform the output, push to GitHub, post to a channel. Each step is configured separately.",
  },
  {
    number: "03",
    title: "Watch it run",
    description: "Set a schedule or trigger manually. Orion executes every step, shows you live logs, and commits results to your repo.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* Hero */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-7">
            Now in public beta →
          </div>
          <h1 className="font-black text-5xl text-slate-900 tracking-tight leading-[1.1] mb-5 max-w-2xl mx-auto">
            Automate your content.<br />Ship on schedule.
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto mb-8">
            Orion connects your GitHub repos, schedules notebooks and scripts, and publishes content to social channels — without the DevOps.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
            <Link href="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
              Start for free
            </Link>
            <Link href="/features" className="border border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-900 font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
              See the demo
            </Link>
          </div>
          <p className="text-xs text-slate-400">No credit card required · Free during beta</p>

          {/* Terminal mockup */}
          <div className="mt-12 max-w-2xl mx-auto bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden text-left">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-700">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
              <span className="ml-3 text-slate-500 text-xs font-mono">orion · pipeline: content-weekly</span>
            </div>
            <div className="p-5 font-mono text-sm space-y-2.5">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
                <span className="text-slate-300">Starting pipeline <span className="text-indigo-400">content-weekly</span></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                <span className="text-slate-400">GitHub sync complete <span className="text-slate-600">— 12 notebooks fetched</span></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                <span className="text-slate-400">Notebook executed <span className="text-slate-600">— analysis.ipynb · 2.4s</span></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                <span className="text-slate-400">Output committed <span className="text-slate-600">— pushed to main</span></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                <span className="text-slate-400">Publishing to content queue...</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                <span className="text-slate-400">Done <span className="text-slate-600">— 3 steps · 0 errors · 4.1s</span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-10 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "250+", label: "notebooks run" },
              { value: "8", label: "pipeline types" },
              { value: "3", label: "output channels" },
              { value: "1 min", label: "to first run" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-black text-indigo-600 tracking-tight">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <h2 className="font-black text-4xl text-slate-900 tracking-tight mb-3">Everything your automation needs</h2>
            <p className="text-base text-slate-600 leading-relaxed max-w-lg">
              From scheduled runs to GitHub commits to content publishing — each piece works on its own and together as a pipeline.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-200 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-indigo-600" />
                    </div>
                    {feature.roadmap && (
                      <span className="text-xs text-slate-400 font-medium">Roadmap</span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-black text-4xl text-slate-900 tracking-tight mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number}>
                <p className="text-6xl font-black text-indigo-100 leading-none mb-4">{step.number}</p>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
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
            Connect a repo, define your pipeline, and Orion takes it from there. Free during beta, no credit card required.
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
