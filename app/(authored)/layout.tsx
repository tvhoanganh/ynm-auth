"use client";

import { NavBar } from "./_components/NavBar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-16 min-h-screen bg-slate-50 dark:bg-slate-950">
      <NavBar />
      <main>{children}</main>
    </div>
  );
}
