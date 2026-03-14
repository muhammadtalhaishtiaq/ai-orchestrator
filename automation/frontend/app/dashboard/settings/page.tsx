"use client";
import { useEffect, useState } from "react";
import { Settings, Key, Shield, Bell, User } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load check (no real data fetch yet — Sprint 2 feature)
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return (
    <div className="p-8 space-y-6">
      <div className="h-8 bg-slate-200 rounded w-48 animate-pulse" />
      <div className="h-4 bg-slate-200 rounded w-80 animate-pulse" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-slate-200 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="h-64 bg-slate-200 rounded-xl animate-pulse" />
    </div>
  );

  const sections = [
    {
      icon: User,
      title: "Account",
      description: "Manage your profile and authentication",
      sprint: "Sprint 2",
    },
    {
      icon: Key,
      title: "API Keys",
      description: "LLM provider keys and access tokens",
      sprint: "Sprint 2",
    },
    {
      icon: Shield,
      title: "Security",
      description: "Password, 2FA, and session management",
      sprint: "Sprint 2",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Pipeline alerts and digest emails",
      sprint: "Sprint 3",
    },
  ];

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Settings className="w-7 h-7 text-indigo-600" />
          Settings
        </h1>
        <p className="text-slate-600 mt-1">Manage your account, API keys, and platform settings</p>
      </div>

      {/* Coming soon section cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 opacity-70 select-none"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 text-sm">{section.title}</h3>
                    <span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full font-medium">
                      {section.sprint}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{section.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main placeholder card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col items-center text-center py-10">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5">
            <Key className="w-8 h-8 text-indigo-600" />
          </div>
          <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Coming in Sprint 2
          </span>
          <p className="text-slate-900 font-semibold text-lg mb-2">Settings Panel</p>
          <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
            LLM provider management, API key configuration, and account settings will be available in Sprint 2.
            Your current configuration is fully operational.
          </p>
        </div>
      </div>
    </div>
  );
}
