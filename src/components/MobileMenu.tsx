
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

const links = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="mobile-menu">
      <button
        type="button"
        className={`mobile-menu-toggle ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={
          isOpen ? "Close navigation menu" : "Open navigation menu"
        }
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-panel"
      >
        {isOpen ? <X size={23} /> : <Menu size={23} />}
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            className="mobile-menu-backdrop"
            aria-label="Close navigation menu"
            onClick={() => setIsOpen(false)}
          />

          <nav
            id="mobile-navigation-panel"
            className="mobile-menu-panel"
            aria-label="Mobile navigation"
          >
            <div className="mobile-menu-heading">
              <div>
                <span>ADIGUN TELECOM</span>
                <small>Explore our website</small>
              </div>

              <span className="mobile-menu-indicator">
                MENU
              </span>
            </div>

            <div className="mobile-menu-links">
              {links.map((link, index) => {
                const isActive =
                  link.href === "/#home"
                    ? pathname === "/"
                    : pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={isActive ? "active" : ""}
                  >
                    <span className="mobile-link-number">
                      0{index + 1}
                    </span>

                    <span className="mobile-link-label">
                      {link.label}
                    </span>

                    <ArrowRight size={17} />
                  </Link>
                );
              })}
            </div>

            <div className="mobile-menu-footer">
              <p>Have a project in mind?</p>

              <a
                href="https://wa.me/2347042723692"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
              >
                <MessageCircle size={18} />
                Let's Talk on WhatsApp
                <ArrowRight size={17} />
              </a>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
