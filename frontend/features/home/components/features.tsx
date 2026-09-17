import React from 'react';
import Card from '@/shared/components/Card';
import { Heading, Text } from '@/shared/components/Typography';

const Features: React.FC = () => {
  return (
    <section className="bg-[#111121] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center animate-slide-in-up">
          <Heading variant="section">AI Should Suggest. Your System Should Decide.</Heading>
          <Text variant="md" className="mx-auto mt-4 max-w-2xl">
            The missing bridge between non-deterministic AI outputs and mission-critical production systems.
          </Text>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card hoverable className="group animate-slide-in-up animate-delay-100">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
              <span className="material-symbols-outlined">code</span>
            </div>
            <Heading variant="card" as="h3" className="mb-3">Structured Actions</Heading>
            <Text variant="sm">
              Converts loose natural language prompts into validated, schema-compliant application commands ready for your API.
            </Text>
          </Card>
          <Card hoverable className="group animate-slide-in-up animate-delay-200">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
              <span className="material-symbols-outlined">shield</span>
            </div>
            <Heading variant="card" as="h3" className="mb-3">Policy Enforcement</Heading>
            <Text variant="sm">
              Define granular rules on what actions can be performed, by whom, and under what specific conditions.
            </Text>
          </Card>
          <Card hoverable className="group animate-slide-in-up animate-delay-300">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
              <span className="material-symbols-outlined">bolt</span>
            </div>
            <Heading variant="card" as="h3" className="mb-3">Deterministic Execution</Heading>
            <Text variant="sm">
              Eliminate AI "hallucinations" in your business logic by ensuring only pre-approved code paths are executed.
            </Text>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Features;
