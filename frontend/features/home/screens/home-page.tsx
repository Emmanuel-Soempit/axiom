import React from 'react';
import Navbar from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';
import { 
  Hero, 
  Features, 
  Architecture, 
  CodeSection, 
  UseCases, 
  CTA 
} from '../components';

const HomePage: React.FC = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#111121]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Architecture />
        <CodeSection />
        <UseCases />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
