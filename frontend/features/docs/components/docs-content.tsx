import React from 'react';
import Card from '@/shared/components/Card';
import { Heading, Text } from '@/shared/components/Typography';

const DocsContent: React.FC = () => {
    return (
        <div className="lg:col-span-8 space-y-20">

            {/* Introduction */}
            <section id="introduction">
                <div className="flex items-center gap-2 text-primary mb-4 font-semibold tracking-wide uppercase text-xs">
                    <span className="material-symbols-outlined text-sm">rocket_launch</span>
                    <span>Getting Started</span>
                </div>
                <Heading as="h1" variant="hero" className="text-4xl md:text-5xl mb-6">
                    Embedded Agent Controller
                </Heading>
                <Text variant="lg" className="leading-relaxed">
                    EAC is a policy-enforced action layer between AI and apps. It provides a secure, low-latency
                    bridge that ensures every autonomous decision made by an AI model is validated against your
                    organization's security protocols before execution.
                </Text>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card hoverable className="bg-white/5 border-white/10 p-5">
                        <h3 className="text-white font-semibold mb-2">Real-time Policy Enforcement</h3>
                        <Text variant="sm">Validate actions against custom OPA rules in under 15ms.</Text>
                    </Card>
                    <Card hoverable className="bg-white/5 border-white/10 p-5">
                        <h3 className="text-white font-semibold mb-2">Audit-Ready Logging</h3>
                        <Text variant="sm">Cryptographically signed logs of every AI interaction and decision.</Text>
                    </Card>
                </div>
            </section>

            {/* Core Concepts */}
            <section id="concepts">
                <Heading as="h2" variant="section" className="text-2xl mb-8 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">psychology</span>
                    Core Concepts
                </Heading>
                <div className="space-y-6">
                    {[
                        {
                            label: 'Actions',
                            desc: 'Primitive operations that the EAC can perform on downstream systems. Each action is typed, versioned, and requires specific permissions.',
                            active: true,
                        },
                        {
                            label: 'Engine',
                            desc: 'The orchestration core that receives model intent, maps it to Actions, and checks the Security layer for authorization.',
                        },
                        {
                            label: 'Security',
                            desc: 'A multi-tenant policy engine where you define "who" (which model) can do "what" (which action) on "what" (which resource).',
                        },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className={`border-l-2 pl-6 py-2 ${item.active ? 'border-primary/50' : 'border-white/10'}`}
                        >
                            <h3 className="text-lg font-semibold text-white mb-2">{item.label}</h3>
                            <Text variant="sm">{item.desc}</Text>
                        </div>
                    ))}
                </div>
            </section>

            {/* API Reference */}
            <section id="api">
                <Heading as="h2" variant="section" className="text-2xl mb-8 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">sensors</span>
                    API Reference
                </Heading>
                <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
                    <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-primary text-[10px] font-bold rounded text-white">POST</span>
                            <code className="text-xs text-slate-300 font-mono">/api/v1/core/engine/process</code>
                        </div>
                        <button className="text-slate-500 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-sm">content_copy</span>
                        </button>
                    </div>
                    <div className="p-6 overflow-x-auto">
                        <pre className="text-sm text-primary font-mono leading-relaxed">
{`{
  "intent": "provision_instance",
  "parameters": {
    "provider": "aws",
    "region": "us-east-1",
    "type": "t3.medium"
  },
  "context": {
    "agent_id": "agent_x_04",
    "session_id": "sess_9921"
  }
}`}
                        </pre>
                    </div>
                </div>
            </section>

            {/* Code Example */}
            <section id="example">
                <Heading as="h2" variant="section" className="text-2xl mb-8 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">build</span>
                    Implementation Response
                </Heading>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-700"></div>
                    <div className="relative bg-[#0a0e1a] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                        {/* Window chrome */}
                        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40"></div>
                            </div>
                            <div className="ml-4 text-[11px] text-slate-500 font-mono">response_payload.json</div>
                        </div>
                        {/* Code body */}
                        <div className="p-6 font-mono text-sm leading-loose">
                            {([
                                <span className="text-slate-300">{'{'}</span>,
                                <span><span className="text-primary">"status"</span><span className="text-slate-300">: </span><span className="text-secondary">"success"</span><span className="text-slate-300">,</span></span>,
                                <span><span className="text-primary">"trace_id"</span><span className="text-slate-300">: </span><span className="text-secondary">"tr_01HJ8Z..."</span><span className="text-slate-300">,</span></span>,
                                <span><span className="text-primary">"policy_check"</span><span className="text-slate-300">{': {'}</span></span>,
                                <span className="pl-8"><span className="text-primary">"result"</span><span className="text-slate-300">: </span><span className="text-secondary">"ALLOW"</span><span className="text-slate-300">,</span></span>,
                                <span className="pl-8"><span className="text-primary">"eval_ms"</span><span className="text-slate-300">: </span><span className="text-amber-400">12.4</span></span>,
                                <span className="text-slate-300">{'}'}<span className="text-slate-300">,</span></span>,
                                <span><span className="text-primary">"action_output"</span><span className="text-slate-300">{': { ... }'}</span></span>,
                                <span className="text-slate-300">{'}'}</span>,
                            ] as React.ReactNode[]).map((line, i) => (
                                <div key={i} className="flex gap-4 items-baseline">
                                    <span className="text-slate-600 select-none w-4 text-right shrink-0">{i + 1}</span>
                                    <span>{line}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DocsContent;
