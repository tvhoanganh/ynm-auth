"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
}

/**
 * Renders the hamburger menu icon for mobile navigation.
 */
function MenuIcon() {
  return (
    <svg
      className="w-6 h-6"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
        d="M5 7h14M5 12h14M5 17h14"
      />
    </svg>
  );
}

/**
 * Renders a single navigation link with active state styling.
 * @param item - Navigation item object
 * @param isActive - Whether the link matches current pathname
 * @param onClose - Callback to close mobile menu after navigation
 */
function NavLink({
  item,
  isActive,
  onClose,
}: {
  item: NavItem;
  isActive: boolean;
  onClose: () => void;
}) {
  return (
    <li>
      <Link
        href={item.href}
        onClick={onClose}
        className={`block py-2 px-3 rounded-md transition-colors ${
          isActive
            ? "text-white bg-blue-600 md:bg-transparent md:text-blue-600 md:p-0"
            : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-600 md:p-0"
        }`}
      >
        {item.label}
      </Link>
    </li>
  );
}

/**
 * Navigation layout for authenticated pages.
 * Displays a sticky top navbar with responsive mobile menu support.
 */
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { label: "Trang chủ", href: "/" },
    { label: "Thông tin cá nhân", href: "/profile" },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="pt-16">
      <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-lg font-semibold text-gray-900">Auth App</span>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-md md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label="Toggle navigation menu"
          >
            <MenuIcon />
          </button>

          {/* Navigation menu */}
          <div
            className={`${
              isMenuOpen ? "" : "hidden"
            } w-full md:block md:w-auto`}
          >
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-200 rounded-md bg-gray-100 md:flex-row md:space-x-2 md:mt-0 md:border-0 md:bg-white">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                  onClose={closeMenu}
                />
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main>{children}</main>
    </div>
  );
}
