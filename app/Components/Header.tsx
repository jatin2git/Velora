
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { supabase } from "../lib/supabase";

type SearchProduct = {
  id: number;
  name: string;
  image: string | null;
  price: number;
};

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    if (!searchOpen || searchTerm.trim().length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    let cancelled = false;

    const searchProducts = async () => {
      setSearchLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("id, name, image, price")
        .eq("is_active", true)
        .ilike("name", `%${searchTerm.trim()}%`)
        .limit(6);

      if (!cancelled) {
        if (error) {
          console.error("Search error:", error.message);
          setSearchResults([]);
        } else {
          setSearchResults(data || []);
        }

        setSearchLoading(false);
      }
    };

    searchProducts();

    return () => {
      cancelled = true;
    };
  }, [searchTerm, searchOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="relative z-50">
      <div className="bg-[#24211e] px-3 py-2 text-center text-[8px] tracking-[0.18em] text-white sm:px-4 sm:text-[10px] sm:tracking-[0.25em]">
        FREE SHIPPING ON ORDERS ABOVE ₹999
      </div>

      <nav className="relative border-b border-[#ddd8d0] bg-[#f8f6f2] px-4 py-5 sm:px-6 md:px-10">
        <div className="mx-auto flex min-h-[58px] max-w-[1400px] items-center gap-6">
          <Link
            href="/"
            onClick={closeMenu}
            className="shrink-0 transition duration-300 hover:opacity-60"
          >
            <img
              src="/velora-logo.png"
              alt="VELORA"
              className="h-auto w-[105px] brightness-50 contrast-125 sm:w-[120px] md:w-[135px] lg:w-[145px]"
            />
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {[
              { label: "HOME", href: "/" },
              { label: "BEDSHEETS", href: "/bedsheet" },
              { label: "COMFORTERS", href: "/comforter" },
              { label: "COLLECTIONS", href: "/#collections" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group relative py-1 text-[12px] font-medium tracking-[0.19em] transition-colors duration-300 hover:text-[#8a8178]"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 h-px w-0 bg-[#24211e] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-4 sm:gap-5">
            <button
              type="button"
              aria-label="Search"
              onClick={() => {
                setSearchOpen(!searchOpen);
                setSearchTerm("");
              }}
              className="transition duration-300 hover:-translate-y-0.5 hover:opacity-60"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
            </button>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="hidden transition duration-300 hover:-translate-y-0.5 hover:opacity-60 sm:block"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
              </svg>
            </Link>

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative transition duration-300 hover:-translate-y-0.5 hover:opacity-60"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 8h14l1 13H4L5 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#24211e] px-1 text-[9px] text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              aria-label="Menu"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-[23px] transition duration-300 hover:opacity-60 lg:hidden"
            >
              {menuOpen ? "×" : "☰"}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="absolute left-0 right-0 top-full z-50 border-b border-[#ddd8d0] bg-[#f8f6f2] px-5 py-6 shadow-lg sm:px-8">
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center gap-3 border-b border-[#aaa39b] pb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

                <input
                  autoFocus
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search bedsheets, comforters..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#aaa39b] sm:text-base"
                />

                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchTerm("");
                  }}
                  className="text-2xl text-[#716b64] hover:text-black"
                  aria-label="Close search"
                >
                  ×
                </button>
              </div>

              <div className="mt-5">
                {searchTerm.trim().length < 2 ? (
                  <p className="text-sm text-[#8a8178]">
                    Type at least 2 letters to search products.
                  </p>
                ) : searchLoading ? (
                  <p className="text-sm text-[#8a8178]">
                    Searching products...
                  </p>
                ) : searchResults.length === 0 ? (
                  <p className="text-sm text-[#8a8178]">
                    No matching products found.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchTerm("");
                        }}
                        className="flex items-center gap-4 border-b border-[#e5e0d9] pb-3 transition hover:opacity-70"
                      >
                        <div className="h-16 w-14 shrink-0 overflow-hidden bg-[#e3ddd4]">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-medium">
                            {product.name}
                          </p>
                          <p className="mt-1 text-sm text-[#716b64]">
                            ₹{Number(product.price).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div
          className={`overflow-hidden transition-all duration-300 lg:hidden ${
            menuOpen ? "max-h-[320px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-[#ddd8d0] pb-4 pt-5">
            <div className="flex flex-col">
              {[
                { label: "HOME", href: "/" },
                { label: "BEDSHEETS", href: "/bedsheet" },
                { label: "COMFORTERS", href: "/comforter" },
                { label: "COLLECTIONS", href: "/#collections" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  className="border-b border-[#e3ded7] py-4 text-xs font-medium tracking-[0.25em] transition duration-300 hover:pl-2 hover:opacity-60"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
