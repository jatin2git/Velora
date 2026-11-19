"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartContext";
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <header>
      <div className="bg-[#24211e] px-3 py-2 text-center text-[8px] tracking-[0.18em] text-white sm:px-4 sm:text-[10px] sm:tracking-[0.25em]">
        FREE SHIPPING ON ORDERS ABOVE ₹999
      </div>

      <nav className="relative border-b border-[#ddd8d0] bg-[#f8f6f2] px-4 py-5 sm:px-6 md:px-10">
        <div className="mx-auto flex min-h-[58px] max-w-[1400px] items-center gap-6">

          <a
            href="/"
            className="shrink-0 transition duration-300 hover:opacity-60"
          >
            <img
              src="/velora-logo.png"
              alt="VELORA"
              className="h-auto w-[105px] brightness-50 contrast-125 sm:w-[120px] md:w-[135px] lg:w-[145px]"
            />
          </a>

          <div className="hidden items-center gap-7 lg:flex">
            <a
              href="/"
              className="group relative py-1 text-[11px] font-medium tracking-[0.22em]"
            >
              HOME
              <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#24211e] transition-all duration-300 group-hover:w-full" />
            </a>

            <a
              href="/bedsheet"
              className="group relative py-1 text-[11px] font-medium tracking-[0.22em]"
            >
              BEDSHEETS
              <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#24211e] transition-all duration-300 group-hover:w-full" />
            </a>

            <a
              href="/comforter"
              className="group relative py-1 text-[11px] font-medium tracking-[0.22em]"
            >
              COMFORTERS
              <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#24211e] transition-all duration-300 group-hover:w-full" />
            </a>

            <a
              href="/#collections"
              className="group relative py-1 text-[11px] font-medium tracking-[0.22em]"
            >
              COLLECTIONS
              <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#24211e] transition-all duration-300 group-hover:w-full" />
            </a>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-5">
            <button
              type="button"
              aria-label="Search"
              className="cursor-pointer text-[18px] transition duration-300 hover:-translate-y-[2px] hover:scale-105 hover:opacity-60 sm:text-[21px]"
            >
              🔍
            </button>

            <button
              type="button"
              aria-label="Wishlist"
              className="hidden cursor-pointer text-[19px] transition duration-300 hover:-translate-y-[2px] hover:scale-105 hover:opacity-60 sm:block sm:text-[21px]"
            >
              ❤️
            </button>

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative cursor-pointer text-[18px] transition duration-300 hover:-translate-y-[2px] hover:scale-105 hover:opacity-60 sm:text-[21px]"
            >
              🛒

  {cartCount > 0 && (
    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#24211e] px-1 text-[8px] text-white">
      {cartCount}
    </span>
  )}
</Link>

            <button
              type="button"
              aria-label="Menu"
              onClick={() => setMenuOpen(!menuOpen)}
              className="cursor-pointer text-[22px] transition duration-300 hover:scale-110 hover:opacity-60 lg:hidden"
            >
              {menuOpen ? "×" : "☰"}
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 lg:hidden ${
            menuOpen ? "max-h-[320px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-[#ddd8d0] pb-4 pt-5">
            <div className="flex flex-col">
              <a
                href="/"
                onClick={() => setMenuOpen(false)}
                className="border-b border-[#e3ded7] py-4 text-[11px] font-medium tracking-[0.25em] transition duration-300 hover:pl-2 hover:opacity-60"
              >
                HOME
              </a>

              <a
                href="/bedsheet"
                onClick={() => setMenuOpen(false)}
                className="border-b border-[#e3ded7] py-4 text-[11px] font-medium tracking-[0.25em] transition duration-300 hover:pl-2 hover:opacity-60"
              >
                BEDSHEETS
              </a>

              <a
                href="/comforter"
                onClick={() => setMenuOpen(false)}
                className="border-b border-[#e3ded7] py-4 text-[11px] font-medium tracking-[0.25em] transition duration-300 hover:pl-2 hover:opacity-60"
              >
                COMFORTERS
              </a>

              <a
                href="/#collections"
                onClick={() => setMenuOpen(false)}
                className="py-4 text-[11px] font-medium tracking-[0.25em] transition duration-300 hover:pl-2 hover:opacity-60"
              >
                COLLECTIONS
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}