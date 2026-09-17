import React from 'react';
import { Heading, Text } from '@/shared/components/Typography';

const Architecture: React.FC = () => {
  return (
    <section className="bg-[#111121] px-6 py-24 border-y border-white/5">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1 animate-slide-in-left">
            <div className="flex flex-col gap-1 overflow-hidden rounded-xl border border-white/10 bg-[#1e1e2e] p-2 shadow-inner">
              <div className="rounded-lg border border-primary/10 p-6 text-center">
                <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">Client / LLM Layer</span>
                <div className="mt-2 font-bold text-slate-300">OpenAI / Anthropic / Custom Agent</div>
              </div>
              <div className="bg-primary rounded-lg p-8 text-center text-white shadow-lg">
                <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Security Core</span>
                <div className="mt-2 text-2xl font-black">EAC Controller</div>
              </div>
              <div className="bg-indigo-600 rounded-lg p-6 text-center text-white">
                <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Governance</span>
                <div className="mt-2 font-bold">Policy Engine & Validation</div>
              </div>
              <div className="bg-slate-900 rounded-lg p-6 text-center text-slate-400">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Internal Infrastructure</span>
                <div className="mt-2 font-bold text-slate-200">Your APIs & Databases</div>
              </div>
            </div>
          </div>
          <div className="order-1 flex flex-col gap-6 lg:order-2 animate-slide-in-right">
            <Heading variant="section">AI Control Infrastructure</Heading>
            <Text variant="lg">
              EAC sits between your AI model and your application code. It's the "operating system" for safe agentic behavior, providing the guardrails needed for production deployments.
            </Text>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined mt-1 text-primary">check_circle</span>
                <div>
                  <span className="font-bold text-white">Policy-First Design</span>
                  <p className="text-sm text-slate-400">Never let an AI model access an API directly. All requests pass through your defined policies.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined mt-1 text-primary">check_circle</span>
                <div>
                  <span className="font-bold text-white">Zero-Trust Agent Architecture</span>
                  <p className="text-sm text-slate-400">Treat AI suggestions as unverified input until validated by the EAC schema registry.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Architecture;
