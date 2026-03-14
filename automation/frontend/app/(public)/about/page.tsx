"use client";
import Link from "next/link";
import { Zap, ArrowLeft, ArrowRight, Target, Eye, Heart } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Builder-first",
    description:
      "We build for people who ship things. Every feature is designed to reduce friction, not add it. If a workflow takes more than a few clicks to set up, we've done something wrong.",
  },
  {
    icon: Eye,
    title: "Transparent by default",
    description:
      "Every pipeline run is logged. Every action is auditable. We believe automation should be observable, not a black box. You should always know exactly what Orion did and why.",
  },
  {
    icon: Heart,
    title: "Simple over clever",
    description:
      "We prefer composable, understandable primitives over magic. A pipeline you can reason about is more valuable than one that \"just works\" until it doesn't.",
  },
];

const team = [
  {
    name: "Built by engineers",
    description:
      "Orion was started by a small team of engineers frustrated with the complexity of stitching together automation tools, cron jobs, and custom scripts for every new project.",
    initial: "E",
    color: "bg-indigo-600",
  },
  {
    name: "Designed for creators",
    description:
      "Whether you're a developer automating technical workflows, a content creator publishing at scale, or a researcher running notebooks — Orion adapts to your process.",
    initial: "C",
    color: "bg-violet-600",
  },
];

export default function AboutPage() {
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
      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            We're building the automation layer for the modern creator
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            Orion started as an internal tool to automate content pipelines — notebooks, social posts, GitHub syncs,
            and scheduled publishing. It worked so well we decided to open it up.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-5">
              <Target className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Our Mission</h2>
            <p className="text-slate-500 leading-relaxed">
              To make automation accessible to every builder — regardless of infrastructure expertise.
              We believe that the ability to automate repetitive work should be a superpower anyone can use,
              not a privilege reserved for large engineering teams.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center mb-5">
              <Eye className="w-5 h-5 text-violet-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Our Vision</h2>
            <p className="text-slate-500 leading-relaxed">
              A world where every creator, researcher, and small team can run reliable automation pipelines
              without managing servers, writing cron jobs from scratch, or stitching together a dozen third-party services.
              One platform, end-to-end.
            </p>
          </div>
        </div>
      </section>

      {/* Origin story */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-8 text-center">How Orion started</h2>
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <p>
              The problem was simple and frustratingly common: running a Jupyter notebook on a schedule,
              committing the output to GitHub, and posting the results to social media required no fewer than
              four separate tools, three cron jobs, and a weekend of integration work.
            </p>
            <p>
              We built an internal pipeline runner to handle this — something lightweight that could chain steps,
              retry on failure, and push outputs wherever they needed to go. Within a few months, it was handling
              hundreds of runs per day for multiple projects.
            </p>
            <p>
              Orion is that internal tool, refined, hardened, and made available to everyone. We're still a small team,
              we're still early, and we're building this alongside our users. If you have feedback, we want to hear it.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-12 text-center">What we believe</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-3">{value.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-12 text-center">Who builds with Orion</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {team.map((item) => (
              <div key={item.name} className="flex gap-5 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-lg">{item.initial}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">{item.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gradient-hero rounded-3xl p-12 text-center text-white shadow-2xl shadow-indigo-100">
            <h2 className="text-3xl font-extrabold mb-4">Come build with us</h2>
            <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
              Orion is free during our public beta. We'd love your feedback, feature requests, and bug reports.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-8 py-4 rounded-xl transition-colors shadow-lg"
            >
              Get started free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
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
