"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems: { href: string; label: string }[] = [
  { href: '/admin/customers', label: 'Overview' },
  { href: '/admin/customers/analytics', label: 'Analytics' },
  { href: '/admin/customers/segments', label: 'Segments & Tags' },
  { href: '/admin/customers/import-export', label: 'Import / Export' },
];

const CustomerSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl p-4 bg-white border border-gray-200 shadow-sm">
      <nav className="space-y-1" aria-label="Customers navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-lg transition-colors outline-none focus:ring-2 focus:ring-[#e11d48]/40 focus:ring-offset-2 focus:ring-offset-white ${
                isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default CustomerSidebar;


