"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Customers', href: '/admin/customers' },
  { label: 'Analytics', href: '/admin/analytics' },
  { label: 'Settings', href: '/admin/settings' },
  { label: 'Users', href: '/admin/users' },
];

export default function AdminNav() {
  const pathname = usePathname();

  const active = (href: string) => (pathname === href || pathname?.startsWith(`${href}/`));

  const currentLabel = () => {
    const found = navItems.find(n => active(n.href));
    return found?.label ?? 'Admin';
  };

  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <Link href="/admin" className="inline-flex items-center hover:text-apex-red">
          <Home className="h-4 w-4 mr-2" /> Admin
        </Link>
        <span className="mx-2">›</span>
        <span className="font-medium text-gray-900">{currentLabel()}</span>
      </div>

      {/* Tabs */}
      <nav className="flex flex-wrap gap-2">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
              active(item.href)
                ? 'bg-apex-red text-white border-apex-red'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-red-50 hover:border-apex-red/40'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}


