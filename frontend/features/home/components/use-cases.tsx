import React from 'react';
import Card from '@/shared/components/Card';
import { Heading, Text } from '@/shared/components/Typography';

const UseCases: React.FC = () => {
  return (
    <section className="bg-[#111121] px-6 py-24 border-y border-white/5">
      <div className="mx-auto max-w-7xl">
        <Heading variant="section" className="mb-16 text-center animate-slide-in-up">Where Developers Use EAC</Heading>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card hoverable className="px-6 py-8 animate-slide-in-up animate-delay-100">
            <span className="mb-4 inline-block text-primary">
              <span className="material-symbols-outlined text-3xl">smart_toy</span>
            </span>
            <Heading variant="card" as="h3" className="mb-2">AI Copilots</Heading>
            <Text variant="sm">
              Safely allow AI to navigate and modify complex user interfaces on behalf of the customer.
            </Text>
          </Card>
          <Card hoverable className="px-6 py-8 animate-slide-in-up animate-delay-200">
            <span className="mb-4 inline-block text-primary">
              <span className="material-symbols-outlined text-3xl">auto_mode</span>
            </span>
            <Heading variant="card" as="h3" className="mb-2">NL Automation</Heading>
            <Text variant="sm">
              Trigger complex workflows using plain English without worrying about injection attacks.
            </Text>
          </Card>
          <Card hoverable className="px-6 py-8 animate-slide-in-up animate-delay-300">
            <span className="mb-4 inline-block text-primary">
              <span className="material-symbols-outlined text-3xl">gavel</span>
            </span>
            <Heading variant="card" as="h3" className="mb-2">Safe AI Agents</Heading>
            <Text variant="sm">
              Deploy autonomous agents that respect financial limits and administrative constraints.
            </Text>
          </Card>
          <Card hoverable className="px-6 py-8 animate-slide-in-up animate-delay-500">
            <span className="mb-4 inline-block text-primary">
              <span className="material-symbols-outlined text-3xl">grid_view</span>
            </span>
            <Heading variant="card" as="h3" className="mb-2">Governed UI</Heading>
            <Text variant="sm">
              Dynamic product interfaces where AI can only interact with validated components.
            </Text>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
