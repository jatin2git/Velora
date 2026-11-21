
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../Components/Header";
import ProductCard from "../Components/productcard";
import { Product } from "../data/products";
import { supabase } from "../lib/supabase";

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
          image: item.image || "",
          images: item.images || [],
          price: Number(item.price),
          fabric: item.fabric || "",
          size: item.size || "",
          color: item.color || "",
          description: item.description || "",
          stock: Number(item.stock),
        }));

        setBedsheets(formattedProducts);
      }

      setLoading(false);
    }

    loadBedsheets();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-[#24211e]">
      <Header />

      <section className="border-b border-[#dedbd5] bg-[#ebe6df] px-6 py-16 sm:px-8 sm:py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-[9px] tracking-[0.35em] text-[#8a8178] sm:text-[10px] sm:tracking-[0.4em]">
            VELORA COLLECTION
          </p>

          <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
            Bedsheets
          </h1>

          <div className="mt-7 h-px w-14 bg-[#8d8277]" />

          <p className="mt-7 max-w-xl text-sm leading-7 text-[#716b64]">
            Thoughtfully selected bedsheets designed to bring softness,
            comfort and timeless elegance to your bedroom.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-6 sm:py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between sm:mb-12">
            <div>
              <p className="text-[9px] tracking-[0.35em] text-[#8a8178] sm:text-[10px] sm:tracking-[0.4em]">
                EXPLORE
              </p>

              <h2 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl">
                Our Bedsheets
              </h2>
            </div>

            <p className="hidden text-[9px] tracking-[0.2em] text-[#8a8178] sm:block">
              {bedsheets.length} COLLECTIONS
            </p>
          </div>

          {loading ? (
            <p className="py-12 text-center text-sm text-[#8a8178]">
              Loading bedsheets...
            </p>
          ) : bedsheets.length === 0 ? (
            <p className="py-12 text-center text-sm text-[#8a8178]">
              No bedsheets available right now.
            </p>
          ) : (
            <div className="grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {bedsheets.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-[#d9d4cd] bg-[#24211e] text-[#f5f2ed]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 md:px-12">
          <div className="grid gap-10 sm:gap-12 md:grid-cols-4">
            <div className="md:col-span-2">
              <Link
                href="/"
                className="inline-block font-serif text-3xl tracking-[0.2em] transition duration-300 hover:opacity-70"
              >
                VELORA
              </Link>

              <p className="mt-2 text-[8px] tracking-[0.4em] text-[#aaa39b]">
                THE ART OF TEXTILES
              </p>

              <p className="mt-6 max-w-md text-sm leading-7 text-[#bdb7b0]">
                Thoughtfully crafted home textiles designed to bring comfort,
                softness and timeless elegance into everyday living.
              </p>
            </div>

            <div>
              <p className="text-[9px] tracking-[0.3em] text-[#aaa39b]">
                EXPLORE
              </p>

              <div className="mt-5 space-y-3 text-sm text-[#ded9d3]">
                <Link href="/" className="block transition duration-300 hover:translate-x-1 hover:text-white">
                  Home
                </Link>

                <Link href="/bedsheet" className="block transition duration-300 hover:translate-x-1 hover:text-white">
                  Bedsheets
                </Link>

                <Link href="/comforter" className="block transition duration-300 hover:translate-x-1 hover:text-white">
                  Comforters
                </Link>

                <Link href="/#collections" className="block transition duration-300 hover:translate-x-1 hover:text-white">
                  Collections
                </Link>
              </div>
            </div>

            <div>
              <p className="text-[9px] tracking-[0.3em] text-[#aaa39b]">
                CUSTOMER CARE
              </p>

              <div className="mt-5 space-y-3 text-sm text-[#ded9d3]">
                <p className="cursor-pointer transition duration-300 hover:translate-x-1 hover:text-white">
                  Contact Us
                </p>
                <p className="cursor-pointer transition duration-300 hover:translate-x-1 hover:text-white">
                  Shipping
                </p>
                <p className="cursor-pointer transition duration-300 hover:translate-x-1 hover:text-white">
                  Returns
                </p>
                <p className="cursor-pointer transition duration-300 hover:translate-x-1 hover:text-white">
                  Privacy Policy
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-[#514c47] pt-6 text-center sm:mt-14">
            <p className="text-[8px] tracking-[0.16em] text-[#918b84] sm:text-[9px] sm:tracking-[0.2em]">
              © 2026 VELORA. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
