
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../Components/Header";
import ProductCard from "../Components/productcard";
import { Product } from "../data/products";
import { supabase } from "../lib/supabase";

const categories = [
  { name: "Bedsheets", href: "/bedsheet" },
  { name: "Pillow Covers", href: "/pillow-covers" },
  { name: "Plain Comforter", href: "/comforter" },
  { name: "AC Comforter Set", href: "/ac-comforter-set" },
];

export default function BedsheetPage() {
  const [bedsheets, setBedsheets] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBedsheets() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "bedsheet")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Bedsheets loading error:", error.message);
      } else {
        const formattedProducts: Product[] = (data || []).map((item) => ({
          id: Number(item.id),
          name: item.name,
          category: item.category,
          image: item.image || item.images?.[0] || "",
          images: item.images || (item.image ? [item.image] : []),
          price: Number(item.price || 0),
          mrp: item.mrp ? Number(item.mrp) : null,
          fabric: item.fabric || "",
          size: item.size || "",
          color: item.color || "",
          description: item.description || "",
          stock: Number(item.stock || 0),
        }));

        setBedsheets(formattedProducts);
      }

      setLoading(false);
    }

    loadBedsheets();
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f3ed] text-[#292820]">
      <Header />

      <section className="border-b border-[#e5ded1] bg-[#ebe9e1] px-6 py-16 sm:px-8 sm:py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-[9px] tracking-[0.35em] text-[#a17a43] sm:text-[10px] sm:tracking-[0.4em]">
            VELORA COLLECTION
          </p>

          <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
            Bedsheets
          </h1>

          <div className="mt-7 h-px w-14 bg-[#b88d50]" />

          <p className="mt-7 max-w-xl text-sm leading-7 text-[#716b60]">
            Thoughtfully selected bedsheets designed to bring softness,
            comfort and timeless elegance to your bedroom.
          </p>
        </div>
      </section>

     

      {/* BEDSHEET PRODUCTS */}

      <section className="border-b border-[#e5ded1] bg-[#faf8f3] px-5 py-12 sm:px-8 sm:py-16 md:px-12 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
            <div>
              <p className="text-[9px] tracking-[0.35em] text-[#a17a43] sm:text-[10px] sm:tracking-[0.4em]">
                EXPLORE VELORA
              </p>

              <h2 className="mt-3 font-serif text-3xl text-[#292820] sm:text-4xl">
                Our Bedsheets
              </h2>
            </div>

            <p className="text-[9px] tracking-[0.2em] text-[#81786d]">
              {bedsheets.length} PRODUCTS
            </p>
          </div>

          {loading ? (
            <p className="py-12 text-center text-sm text-[#81786d]">
              Loading bedsheets...
            </p>
          ) : bedsheets.length === 0 ? (
            <p className="py-12 text-center text-sm text-[#81786d]">
              Our bedsheet collection is coming soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {bedsheets.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  compact
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}

      <footer className="border-t border-[#494438] bg-[#292820] text-[#f5f3ed]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 md:px-12">
          <div className="grid gap-10 sm:gap-12 md:grid-cols-4">
            <div className="md:col-span-2">
              <Link
                href="/"
                className="inline-block font-serif text-3xl font-semibold tracking-[0.2em] transition duration-300 hover:opacity-70"
              >
                VELORA
              </Link>

              <p className="mt-2 text-[8px] tracking-[0.4em] text-[#d0c5b2]">
                THE ART OF TEXTILES
              </p>

              <p className="mt-6 max-w-md text-sm leading-7 text-[#ded8cc]">
                Thoughtfully selected home textiles designed to bring comfort,
                softness and timeless elegance into everyday living.
              </p>
            </div>

            <div>
              <p className="text-[9px] tracking-[0.3em] text-[#d0c5b2]">
                EXPLORE
              </p>

              <div className="mt-5 space-y-3 text-sm text-[#e0ddd5]">
                <Link href="/" className="block transition hover:translate-x-1 hover:text-white">
                  Home
                </Link>
                <Link href="/bedsheet" className="block transition hover:translate-x-1 hover:text-white">
                  Bedsheets
                </Link>
                <Link href="/pillow-covers" className="block transition hover:translate-x-1 hover:text-white">
                  Pillow Covers
                </Link>
                <Link href="/comforter" className="block transition hover:translate-x-1 hover:text-white">
                  Plain Comforter
                </Link>
                <Link href="/ac-comforter-set" className="block transition hover:translate-x-1 hover:text-white">
                  AC Comforter Set
                </Link>
                <Link href="/#collections" className="block transition hover:translate-x-1 hover:text-white">
                  Collections
                </Link>
              </div>
            </div>

            <div>
              <p className="text-[9px] tracking-[0.3em] text-[#d0c5b2]">
                CONTACT US
              </p>

              <div className="mt-5 space-y-4 text-sm text-[#e0ddd5]">
                <a
                  href="https://wa.me/919306674303"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition hover:text-[#c6a36b]"
                >
                  WhatsApp: +91 93066 74303
                </a>

                <a
                  href="mailto:velora082026@gmail.com"
                  className="block break-all transition hover:text-[#c6a36b]"
                >
                  velora082026@gmail.com
                </a>

                <p>Panipat, Haryana, India</p>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-[#514c40] pt-6 text-center sm:mt-14">
            <p className="text-[8px] tracking-[0.2em] text-[#d0c5b2] sm:text-[9px]">
              © 2026 VELORA. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
