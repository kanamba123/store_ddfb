// components/Navbar.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Utilisateurs', href: '/dashboard/users' },
  { label: 'Paramètres', href: '/dashboard/settings' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b shadow-sm px-4 py-3 flex justify-between items-center">
      <div className="text-xl font-bold text-blue-600">MonDashboard</div>
      <ul className="flex gap-6">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`text-sm font-medium hover:text-blue-600 transition ${
                pathname === link.href ? 'text-blue-600 underline' : 'text-gray-600'
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
