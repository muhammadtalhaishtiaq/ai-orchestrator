"use client";
import Link from "next/link";
import {
  Zap,
  GitBranch,
  Calendar,
  FolderOpen,
  Github,
  Video,
  Share2,
  ArrowLeft,
  ArrowRight,
  Bell,
  RefreshCw,
  Key,
  BarChart3,
  Shield,
  Terminal,
} from "lucide-react";

const featureSections = [
  {
    icon: GitBranch,
    title: "Pipeline Builder",
    tagline: "Visual automation for every workflow",
    description:
      "Design multi-step pipelines with a visual editor. Chain triggers, data transforms, AI operations, and publishing actions. Each step is configurable, re-orderable, and testable in isolation.",
    useCases: [
      "Auto-publish a blog post every time a Jupyter notebook is run",
      "Trigger a social media campaign when new content is merged to GitHub",
      "Schedule daily summaries from multiple data sources",
    ],
    color: "bg-indigo-50",
    iconColor: "text-indigo-600",
    badge: null,
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    tagline: "Run on your schedule, not manually",
    description:
      "Define cron expressions or choose from common presets (hourly, daily, weekly). Orion handles missed runs, retries on failure, and sends alerts when something goes wrong.",
    useCases: [
      "Publish LinkedIn posts every Tuesday at 9am",
      "Run notebook pipelines nightly and push results to GitHub",
      "Weekly digest emails from your content queue",
    ],
    color: "bg-violet-50",
    iconColor: "text-violet-600",
    badge: null,
  },
  {
    icon: FolderOpen,
    title: "Multi-Project Management",
    tagline: "One workspace for all your automations",
    description:
      "Create isolated projects for different clients, products, or use cases. Each project has its own pipelines, settings, credentials, and content queue. Switch contexts instantly.",
    useCases: [
      "Manage automation for multiple clients from one account",
      "Separate staging and production automation environments",
      "Organize by content type: newsletters, social, videos",
    ],
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
    badge: null,
  },
  {
    icon: Github,
    title: "GitHub Sync",
    tagline: "Your code, your content, in sync",
    description:
      "Connect your GitHub repositories and sync notebooks, scripts, and structured content. Pipeline outputs are committed and pushed automatically. Full audit trail via git history.",
    useCases: [
      "Auto-commit notebook outputs after each pipeline run",
      "Pull latest scripts from GitHub before running automation",
      "Track content versions with git diffs",
    ],
    color: "bg-slate-50",
    iconColor: "text-slate-700",
    badge: null,
  },
  {
    icon: Video,
    title: "Media Generation",
    tagline: "AI-powered visuals and narration",
    description:
      "Generate images, short video clips, and audio narration as part of your pipeline. Supports multiple AI model backends. Outputs are automatically attached to content queue items.",
    useCases: [
      "Generate cover images for every blog post automatically",
      "Create narrated video clips from notebook summaries",
      "Produce social media carousels from structured data",
    ],
    color: "bg-pink-50",
    iconColor: "text-pink-600",
    badge: "Coming Soon",
  },
  {
    icon: Share2,
    title: "Social Publishing",
    tagline: "One pipeline, every platform",
    description:
      "Connect LinkedIn, Twitter/X, Instagram, and YouTube. Define platform-specific post formats in your pipeline. Schedule, preview, and track performance — all from Orion.",
    useCases: [
      "Cross-post to LinkedIn and Twitter with a single pipeline step",
      "Schedule Instagram reels from generated video content",
      "Publish YouTube descriptions and thumbnails automatically",
    ],
    color: "bg-cyan-50",
    iconColor: "text-cyan-600",
    badge: "Coming Soon",
  },
];

const additionalFeatures = [
  { icon: Bell, title: "Failure Alerts", description: "Get notified via email when a pipeline run fails or exceeds runtime thresholds." },
  { icon: RefreshCw, title: "Retry Logic", description: "Configurable retry policies per pipeline step with exponential backoff." },
  { icon: Key, title: "Credential Vault", description: "Store API keys and tokens securely. Credentials are never exposed in logs." },
  { icon: BarChart3, title: "Run Analytics", description: "Track pipeline run history, success rates, and step-level timing." },
  { icon: Shield, title: "Access Control", description: "Role-based access per project. Invite collaborators with view or edit permissions." },
  { icon: Terminal, title: "CLI Access", description: "Trigger and inspect pipeline runs from the command line. CI/CD friendly." },
];

export default function FeaturesPage() {
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
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            <Link href="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            Feature overview
          </div>
          <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Built for builders who move fast
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            Every feature in Orion is designed to reduce manual work and give you reliable, repeatable automation — without the DevOps overhead.
          </p>
        </div>
      </section>

      {/* Feature sections */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {featureSections.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;
            return (
              <div
                key={feature.title}
                className={`grid md:grid-cols-2 gap-8 items-center ${isEven ? "" : "md:[&>*:first-child]:order-2"}`}
              >
                {/* Text */}
                <div>
                  <div className={`inline-flex items-center gap-2 ${feature.color} px-3 py-1.5 rounded-full mb-4`}>
                    <Icon className={`w-4 h-4 ${feature.iconColor}`} />
                    <span className={`text-xs font-semibold ${feature.iconColor}`}>{feature.title}</span>
                    {feature.badge && (
                      <span className="ml-1 bg-violet-100 text-violet-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{feature.tagline}</h2>
                  <p className="text-slate-500 leading-relaxed mb-6">{feature.description}</p>
                  <div className="space-y-2.5">
                    {feature.useCases.map((useCase) => (
                      <div key={useCase} className="flex items-start gap-2.5">
                        <ArrowRight className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600">{useCase}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual card */}
                <div className={`${feature.color} rounded-2xl p-8 border border-slate-100`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm`}>
                      <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{feature.title}</p>
                      <p className="text-xs text-slate-500">{feature.tagline}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {feature.useCases.map((useCase, i) => (
                      <div key={i} className="bg-white rounded-lg px-4 py-2.5 text-xs text-slate-600 shadow-sm border border-slate-100">
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

      {/* Additional features grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2 text-center">And a lot more</h2>
          <p className="text-slate-500 text-center mb-12">
            The details that make Orion a platform you can actually rely on in production.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {additionalFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Ready to try it yourself?</h2>
          <p className="text-slate-500 mb-8">
            Sign up for free and start building your first pipeline in minutes. No credit card required.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-indigo-100"
          >
            Start for free
            <ArrowRight className="w-4 h-4" />
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
