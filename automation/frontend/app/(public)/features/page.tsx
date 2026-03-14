"use client";
import Link from "next/link";
import {
  Zap,
  Calendar,
  FolderOpen,
  GitBranch,
  Share2,
  Terminal,
  Activity,
  Menu,
  X,
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
            <Link href="/features" className="text-sm text-slate-900 font-medium transition-colors">Features</Link>
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

const featureSections = [
  {
    icon: Calendar,
    title: "Scheduled Runs",
    description:
      "Set a cron expression or pick from built-in presets — hourly, daily, weekly. Orion tracks every scheduled run, retries failed steps up to three times, and sends you an email if a pipeline stops completing. You set it once and it runs indefinitely without you touching it again.",
    useCases: [
      "Run a data analysis notebook every night at midnight and push results to GitHub",
      "Pull fresh content from an API every Monday and populate a draft queue",
      "Generate weekly summaries from pipeline outputs and email them to yourself",
    ],
    roadmap: false,
  },
  {
    icon: GitBranch,
    title: "GitHub Push",
    description:
      "Connect any GitHub repository and Orion will commit notebook outputs, generated files, or transformed data after every successful run. Authentication is stored per-project, and every push includes a commit message with the pipeline name and run ID. The full audit trail lives in your git history.",
    useCases: [
      "Commit notebook output cells to a repo after each scheduled execution",
      "Push generated markdown files to a content repo on every pipeline run",
      "Keep a versioned log of pipeline outputs as plain files in a dedicated branch",
    ],
    roadmap: false,
  },
  {
    icon: Share2,
    title: "Content Queue",
    description:
      "Draft content items inside Orion, attach media, and assign them to a project. When a pipeline runs, it can pull from the queue in order or match items by tag. No external spreadsheet or CMS required — the queue is part of the pipeline, not a separate tool you have to keep in sync.",
    useCases: [
      "Queue up 30 posts and have the pipeline publish one per day on schedule",
      "Attach generated images to queue items before they go out",
      "Tag queue items by topic so different pipelines only pick up their assigned content",
    ],
    roadmap: false,
  },
  {
    icon: FolderOpen,
    title: "Project Isolation",
    description:
      "Each project is a fully isolated environment with its own pipelines, credentials, content queue, and run history. You can work on a client project and a personal project in the same account without any shared state. Credentials stored in one project are invisible to all others.",
    useCases: [
      "Keep separate GitHub credentials and queues for different client accounts",
      "Run staging and production pipelines from separate projects with different schedules",
      "Archive a completed project without affecting active pipelines in other projects",
    ],
    roadmap: false,
  },
  {
    icon: Activity,
    title: "Live Logs",
    description:
      "Every pipeline run produces a structured log — one entry per step, with timestamps, outputs, and error details. Logs stream in real time while the pipeline is running and are stored permanently per run. When something fails, you can see exactly which step broke and why without digging through system logs.",
    useCases: [
      "Watch a new pipeline run in real time to verify each step before scheduling it",
      "Go back to a failed run from last Tuesday and see the exact error message from step 3",
      "Compare run durations across two weeks to spot regressions after a config change",
    ],
    roadmap: false,
  },
  {
    icon: Terminal,
    title: "Pipeline Builder",
    description:
      "Define each automation step once in a structured editor — choose the step type, configure inputs, and set the order. Steps are reorderable without losing config, and you can run any individual step in isolation to test it before activating the full pipeline. Every step config is stored as plain JSON you can inspect.",
    useCases: [
      "Build a pipeline with a GitHub fetch step, a notebook run step, and a queue push step",
      "Test a single transformation step against sample data before wiring it into a live pipeline",
      "Reorder steps without reconfiguring them when your workflow changes",
    ],
    roadmap: true,
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* Hero */}
      <section className="py-16 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="font-black text-5xl text-slate-900 tracking-tight leading-[1.1] mb-4 max-w-xl">
            What Orion can do
          </h1>
          <p className="text-base text-slate-500 leading-relaxed max-w-lg">
            Six building blocks that cover the full loop from data to published output. Use one or chain them all.
          </p>
        </div>
      </section>

      {/* Feature sections */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-20">
          {featureSections.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;
            return (
              <div
                key={feature.title}
                className={`grid md:grid-cols-2 gap-12 items-start ${!isEven ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                {/* Text side */}
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="font-bold text-slate-900">{feature.title}</span>
                    {feature.roadmap && (
                      <span className="text-xs text-slate-400 font-medium border border-slate-200 px-2 py-0.5 rounded-md">Roadmap</span>
                    )}
                  </div>
                  <p className="text-base text-slate-600 leading-relaxed mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.useCases.map((useCase) => (
                      <li key={useCase} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0 mt-2" />
                        <span className="text-sm text-slate-600 leading-relaxed">{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual side */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{feature.title}</p>
                      {feature.roadmap && (
                        <p className="text-xs text-slate-400">Coming in a future release</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {feature.useCases.map((useCase, i) => (
                      <div key={i} className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-xs text-slate-600 leading-relaxed">
                        {useCase}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
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
