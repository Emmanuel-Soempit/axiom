import React from 'react';
import { Heading, Text } from '@/shared/components/Typography';

const CodeSection: React.FC = () => {
  return (
    <section className="bg-slate-900 px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-6 animate-slide-in-left">
            <Heading variant="section">Validation at the Edge</Heading>
            <Text variant="md" className="text-slate-400">
              AI proposes an action. EAC validates it against your schema and active policies. Your system executes only if everything matches.
            </Text>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 rounded-lg bg-white/5 p-4 border border-white/10">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                  <span className="material-symbols-outlined text-sm">check</span>
                </span>
                <span className="text-sm font-medium">Auto-corrects minor formatting errors from LLM</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-white/5 p-4 border border-white/10">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                  <span className="material-symbols-outlined text-sm">check</span>
                </span>
                <span className="text-sm font-medium">Rejects unauthorized parameter ranges</span>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl bg-[#0d0d1a] border border-white/10 shadow-2xl animate-slide-in-right animate-delay-200">
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/50"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500/50"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-500/50"></div>
              </div>
              <span className="ml-4 text-xs font-mono text-slate-500">axiom-response.json</span>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed">
              <div className="text-slate-500">// AI Proposal {"->"} EAC Validation Result</div>
              <div className="text-pink-400 mt-2">{"{"}</div>
              <div className="pl-4">
                <span className="text-indigo-400">"status"</span>: <span className="text-emerald-400">"approved"</span>,
                <br />
                <span className="text-indigo-400">"action"</span>: <span className="text-emerald-400">"create_invoice"</span>,
                <br />
                <span className="text-indigo-400">"parameters"</span>: <span className="text-pink-400">{"{"}</span>
                <div className="pl-4">
                  <span className="text-indigo-400">"amount"</span>: <span className="text-orange-300">500.00</span>,
                  <br />
                  <span className="text-indigo-400">"currency"</span>: <span className="text-emerald-400">"USD"</span>,
                  <br />
                  <span className="text-indigo-400">"customer_id"</span>: <span className="text-emerald-400">"cust_9872"</span>
                </div>
                <span className="text-pink-400">{"}"}</span>,
                <br />
                <span className="text-indigo-400">"validated"</span>: <span className="text-orange-300">true</span>,
                <br />
                <span className="text-indigo-400">"policy_check"</span>: <span className="text-emerald-400">"PASS: Amount within range"</span>
              </div>
              <div className="text-pink-400">{"}"}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeSection;
