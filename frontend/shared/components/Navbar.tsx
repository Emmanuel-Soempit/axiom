'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from './Button';

const navLinks = [
    { label: 'Product', href: '#' },
    { label: 'Architecture', href: '#' },
    { label: 'Docs', href: '/docs' },
    { label: 'Examples', href: '#' },
    { label: 'GitHub', href: '#' },
];

const Navbar: React.FC = () => {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#111121]/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div className="flex items-center gap-2">
                    <img src={'/pngs/main-logo.png'} alt="EAC" className='h-10 ' />
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => {
                        const isActive = link.href !== '#' && pathname === link.href;
                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'text-primary border-b border-primary pb-0.5'
                                        : 'text-slate-400 hover:text-primary'
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="flex items-center gap-4">
                    <Button variant="primary" size="md" href="/auth/sign-up">
                        Start Building
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
