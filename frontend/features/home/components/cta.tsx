import React from 'react';
import Button from '@/shared/components/Button';
import { Heading, Text } from '@/shared/components/Typography';

const CTA: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#1e1e2e] border-y border-white/10 px-6 py-24 text-white">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      <div className="relative mx-auto max-w-4xl text-center animate-slide-in-up">
        <Heading variant="hero" as="h2" className="mb-6 lg:text-6xl">
          Build AI That Respects Your System Architecture
        </Heading>
        <Text variant="lg" className="mb-10 text-white/80">
          Turn natural language into safe, structured application actions with the Embedded Agent Controller.
        </Text>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button variant="primary" size="lg" className="w-full sm:w-auto">
            Start Building Now
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20">
            Schedule Technical Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
