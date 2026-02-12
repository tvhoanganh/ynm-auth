"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
}

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
        className={`block py-2 px-3 rounded-xl transition-colors ${
          isActive
            ? "text-white bg-emerald-600 md:bg-emerald-500/15 md:text-emerald-600 dark:md:text-emerald-400 md:p-2 md:px-4"
            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hover:bg-transparent md:hover:text-emerald-600 dark:md:hover:text-emerald-400 md:p-2 md:px-4"
        }`}
      >
        {item.label}
      </Link>
    </li>
  );
}

const NAV_ITEMS: NavItem[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Thông tin cá nhân", href: "/profile" },
];

export function NavBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md fixed w-full z-20 top-0 start-0 border-b border-slate-200/60 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto px-4 sm:px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold bg-linear-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
            Account ID
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-xl md:hidden hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-700 dark:text-slate-300"
          aria-label="Toggle navigation menu"
        >
          <MenuIcon />
        </button>

        <div
          className={`${isMenuOpen ? "" : "hidden"} w-full md:block md:w-auto`}
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 md:flex-row md:gap-1 md:mt-0 md:border-0 md:bg-transparent">
            {NAV_ITEMS.map((item) => (
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
  );
}
