
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
  { label: "PILLOW COVERS", href: "/pillow-covers" },
  { label: "PLAIN COMFORTER", href: "/comforter" },
  { label: "AC COMFORTER SET", href: "/ac-comforter-set" },
  { label: "COLLECTIONS", href: "/#collections" },
];

const announcements = [
  "FREE SHIPPING ON ORDERS ABOVE ₹999",
  "PREMIUM QUALITY HOME TEXTILES",
  "CUSTOMER SUPPORT AVAILABLE",
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
      <div className="announcement-bar overflow-hidden bg-[#303a32] py-[9px] text-white">
        <div className="announcement-track">
          {[1, 2].map((group) => (
            <div className="announcement-group" key={group}>
              {announcements.map((message, index) => (
                <span key={`${group}-${message}`}>
                  {message}
                  <span className="announcement-star">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="border-b border-[#d9ddd4]">
        <div className="mx-auto flex h-[66px] max-w-[1500px] items-center justify-between px-4 sm:h-[88px] sm:px-8">
          <Link
            href="/"
            className="shrink-0 transition duration-300 hover:opacity-75"
          >
            <img
              src="/velora-logo.png"
              alt="VELORA"
              className="h-auto w-[85px] brightness-[0.35] contrast-[1.3] sm:w-[125px] md:w-[145px]"
            />
          </Link>

          <div className="flex shrink-0 items-center gap-[12px] sm:gap-6">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center justify-center transition duration-300 hover:opacity-60"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
            </button>

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative flex items-center justify-center transition duration-300 hover:opacity-60"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
              className="flex items-center justify-center transition duration-300 hover:opacity-60"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
              </svg>
            </Link>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="flex items-center justify-center transition duration-300 hover:opacity-60"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-[#d9ddd4] bg-[#f4f5f0]">
        <nav className="mx-auto flex max-w-[1500px] items-center justify-start gap-5 overflow-x-auto px-4 py-3 scrollbar-hide sm:justify-center sm:gap-8 sm:px-8 sm:py-[15px] md:gap-10">
          {categories.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group relative shrink-0 whitespace-nowrap py-1 text-[11px] font-medium tracking-[0.08em] text-[#303a32] transition-colors duration-300 hover:text-[#84917e] sm:text-[13px] sm:tracking-[0.12em] md:text-[14px]"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#303a32] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>
      </div>

      {searchOpen && (
        <div className="absolute left-0 right-0 top-full z-[60] max-h-[75vh] overflow-y-auto border-b border-[#d9ddd4] bg-[#f4f5f0] px-4 py-5 shadow-lg sm:px-8 sm:py-6">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3 border-b border-[#b7beb2] pb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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

      <style jsx>{`
        .announcement-track {
          display: flex;
          width: max-content;
          animation: announcement-scroll 20s linear infinite;
        }

        .announcement-group {
          display: flex;
          flex-shrink: 0;
          align-items: center;
        }

        .announcement-group > span {
          display: inline-flex;
          align-items: center;
          gap: 45px;
          padding: 0 22px;
          white-space: nowrap;
          font-size: 10px;
          letter-spacing: 0.18em;
        }

        .announcement-star {
          color: #c6a36b;
          font-size: 13px;
        }

        .announcement-bar:hover .announcement-track {
          animation-play-state: paused;
        }

        @keyframes announcement-scroll {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }

        @media (max-width: 640px) {
          .announcement-group > span {
            gap: 25px;
            padding: 0 12px;
            font-size: 9px;
            letter-spacing: 0.12em;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .announcement-track {
            animation: none;
          }
        }
      `}</style>
    </header>
  );
}
