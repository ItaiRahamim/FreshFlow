'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useState } from 'react';

export default function Navbar() {
  const { user, token, setUser, setToken } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = !!token && !!user;
  const isPublicPage = pathname === '/' || pathname === '/login';

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    router.push('/');
  };

  const navLinks = [
    { href: '/dashboard', label: 'דשבורד', icon: '🏠', roles: ['OWNER', 'STAFF'] },
    { href: '/categories', label: 'קטגוריות', icon: '📁', roles: ['OWNER', 'STAFF'] },
    { href: '/rfq', label: 'RFQs', icon: '📋', roles: ['OWNER', 'STAFF'] },
    { href: '/quotes', label: 'הצעות מחיר', icon: '💼', roles: ['OWNER', 'STAFF'] },
    { href: '/po', label: 'הזמנות רכישה', icon: '🛒', roles: ['OWNER', 'STAFF'] },
    { href: '/invoices', label: 'חשבוניות', icon: '🧾', roles: ['OWNER', 'STAFF'] },
    { href: '/shipments', label: 'משלוחים', icon: '🚢', roles: ['OWNER', 'STAFF'] },
    { href: '/landed-cost', label: 'עלות סופית', icon: '💰', roles: ['OWNER', 'STAFF'] },
    { href: '/s', label: 'פורטל ספק', icon: '👤', roles: ['SUPPLIER'] },
  ];

  const visibleLinks = isAuthenticated
    ? navLinks.filter((link) => link.roles.includes(user?.role || ''))
    : [];

  if (isPublicPage && !isAuthenticated) {
    return (
      <nav className="bg-white/80 backdrop-blur-sm shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2 space-x-reverse">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                FreshFlow
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
              >
                התחברות
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2 space-x-reverse">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              FreshFlow
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {visibleLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="ml-1">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.name || user?.email}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'OWNER' ? 'בעלים' : user?.role === 'STAFF' ? 'צוות' : 'ספק'}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden md:block px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
            >
              התנתק
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col gap-2">
              {visibleLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                );
              })}
              <div className="border-t border-gray-200 mt-2 pt-2">
                <div className="px-4 py-2 mb-2">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.name || user?.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.role === 'OWNER' ? 'בעלים' : user?.role === 'STAFF' ? 'צוות' : 'ספק'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-right px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  התנתק
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

