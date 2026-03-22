import React from 'react';
import Button from '@/shared/components/Button';
import { Heading, Text } from '@/shared/components/Typography';

const Hero: React.FC = () => {
  return (
    <section className="relative px-6 py-20 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-8 animate-slide-in-left">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              Now in Public Beta
            </div>
            <Heading variant="hero" as="h1">
              Give AI Access to Your App — <span className="text-primary">Safely</span>
            </Heading>
            <Text variant="lg" className="max-w-xl">
              Embedded Agent Controller is a policy-enforced action layer that converts natural language into structured application actions. AI proposes. Your system decides what runs.
            </Text>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="lg" href={`${process.env.NEXT_PUBLIC_WEB_APP_URL}/sign-up`}>
                Get Started Free
              </Button>
              <Button variant="white" size="lg" href="/docs">
                View Documentation
              </Button>
            </div>
          </div>
          <div className="relative rounded-2xl border border-white/10 bg-[#1e1e2e] p-8 shadow-2xl animate-slide-in-right animate-delay-200">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400">person</span>
                  <span className="text-sm font-medium italic text-slate-300">"Create an invoice for $500..."</span>
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-400">User Request</span>
              </div>
              <div className="flex justify-center text-slate-300"><span className="material-symbols-outlined">arrow_downward</span></div>
              <div className="flex items-center justify-center rounded-lg bg-primary/20 p-4 border border-primary/30 text-primary font-bold">
                LLM / AI Model
              </div>
              <div className="flex justify-center text-slate-300"><span className="material-symbols-outlined">arrow_downward</span></div>
              <div className="rounded-xl bg-primary p-6 text-white shadow-xl">
                <div className="mb-4 flex items-center justify-between border-b border-white/20 pb-2">
                  <span className="font-bold">EAC Controller</span>
                  <span className="rounded bg-white/20 px-2 py-0.5 text-[10px]">ENFORCEMENT LAYER</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded bg-white/10 p-2 border border-white/10 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">fact_check</span> Schema Validation
                  </div>
                  <div className="rounded bg-white/10 p-2 border border-white/10 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">lock</span> Permission Check
                  </div>
                  <div className="rounded bg-white/10 p-2 border border-white/10 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">policy</span> Policy Enforcement
                  </div>
                  <div className="rounded bg-white/10 p-2 border border-white/10 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">terminal</span> Execution Layer
                  </div>
                </div>
              </div>
              <div className="flex justify-center text-slate-300"><span className="material-symbols-outlined">arrow_downward</span></div>
              <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 p-4 border border-emerald-500/20 text-emerald-400 font-bold">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined">database</span>
                  <span>Application Backend</span>
                </div>
                <span className="material-symbols-outlined text-emerald-500">check_circle</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
