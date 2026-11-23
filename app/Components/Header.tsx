
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

const categories = [
  { label: "HOME", href: "/" },
  { label: "BEDSHEET", href: "/bedsheet" },
  { label: "PILLOW COVERS", href: "/#collections" },
  { label: "PLAIN COMFORTER", href: "/comforter" },
  { label: "AC COMFORTER SET", href: "/#collections" },
  { label: "DUVET COVER", href: "/#collections" },
  { label: "COLLECTIONS", href: "/#collections" },
];

export default function Header() {
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

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchTerm("");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f4f5f0] text-[#303a32]">
      <div className="bg-[#303a32] px-3 py-2 text-center text-[9px] tracking-[0.22em] text-white sm:text-[10px]">
        FREE SHIPPING ON ORDERS ABOVE ₹999
      </div>

      <div className="border-b border-[#d9ddd4]">
        <div className="relative mx-auto flex h-[76px] max-w-[1500px] items-center justify-center px-4 sm:h-[92px] sm:px-8">
          <Link
            href="/"
            className="group absolute left-1/2 -translate-x-1/2 transition duration-300 hover:opacity-75"
          >
            <img
              src="/velora-logo.png"
              alt="VELORA"
              className="h-auto w-[125px] brightness-[0.35] contrast-[1.3] sm:w-[155px] md:w-[175px]"
            />
          </Link>

          <div className="absolute right-4 flex items-center gap-4 sm:right-8 sm:gap-6">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(!searchOpen)}
              className="transition duration-300 hover:-translate-y-0.5 hover:opacity-60"
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
            </button>

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative transition duration-300 hover:-translate-y-0.5 hover:opacity-60"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 8h14l1 13H4L5 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#303a32] px-1 text-[9px] text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/account"
              aria-label="Profile"
              className="transition duration-300 hover:-translate-y-0.5 hover:opacity-60"
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
              </svg>
            </Link>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="transition duration-300 hover:-translate-y-0.5 hover:opacity-60"
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-[#d9ddd4] bg-[#f4f5f0]">
        <nav className="mx-auto flex max-w-[1500px] items-center justify-center gap-6 overflow-x-auto px-4 py-[15px] scrollbar-hide sm:gap-8 sm:px-8 md:gap-10">
          {categories.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group relative shrink-0 whitespace-nowrap py-1 text-[12px] font-medium tracking-[0.10em] text-[#303a32] transition-colors duration-300 hover:text-[#84917e] sm:text-[13px] sm:tracking-[0.12em] md:text-[14px]"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#303a32] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>
      </div>

      {searchOpen && (
        <div className="absolute left-0 right-0 top-full z-[60] border-b border-[#d9ddd4] bg-[#f4f5f0] px-4 py-6 shadow-lg sm:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3 border-b border-[#b7beb2] pb-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
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
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#92998e] sm:text-base"
              />

              <button
                type="button"
                onClick={closeSearch}
                aria-label="Close search"
                className="text-2xl text-[#60685e] transition hover:text-black"
              >
                ×
              </button>
            </div>

            <div className="mt-5">
              {searchTerm.trim().length < 2 ? (
                <p className="text-sm text-[#7b8378]">
                  Type at least 2 letters to search products.
                </p>
              ) : searchLoading ? (
                <p className="text-sm text-[#7b8378]">
                  Searching products...
                </p>
              ) : searchResults.length === 0 ? (
                <p className="text-sm text-[#7b8378]">
                  No matching products found.
                </p>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={closeSearch}
                      className="flex items-center gap-4 border-b border-[#dfe3db] pb-3 transition hover:opacity-70"
                    >
                      <div className="h-16 w-14 shrink-0 overflow-hidden bg-[#e7e9e2]">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="mt-1 text-sm text-[#687064]">
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
    </header>
  );
}
