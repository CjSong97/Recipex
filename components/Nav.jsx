"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlan } from "@/app/providers";

const LINKS = [
  { href: "/", label: "Discover", icon: "🔍" },
  { href: "/flavors", label: "Flavor Lab", icon: "🧪" },
  { href: "/plan", label: "My Week", icon: "📅" },
  { href: "/list", label: "List", icon: "🛒" },
];

export default function Nav() {
  const pathname = usePathname();
  const { plan } = usePlan();

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="logo">
            <span className="logo-mark">🍳</span>
            Recipex
          </Link>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link${pathname === l.href ? " active" : ""}`}
            >
              {l.label}
              {l.href === "/plan" && plan.length > 0 && (
                <span className="nav-badge" key={plan.length}>
                  {plan.length}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="bottom-nav" aria-label="Primary">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`bottom-link${pathname === l.href ? " active" : ""}`}
          >
            <span className="bottom-icon">{l.icon}</span>
            <span>{l.label}</span>
            {l.href === "/plan" && plan.length > 0 && (
              <span className="nav-badge bottom-badge" key={plan.length}>
                {plan.length}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </>
  );
}
