
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "./Components/Header";
import ProductCard from "./Components/productcard";
import { Product } from "./data/products";
import { supabase } from "./lib/supabase";

const categories = [
  {
    name: "Bedsheets",
    subtitle: "TIMELESS COMFORT",
    description: "Beautiful prints for a restful sleep.",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1000",
    href: "/bedsheet",
  },
  {
    name: "Pillow Covers",
    subtitle: "THE PERFECT FINISH",
    description: "Elegant covers for your pillows.",
    image: "https://images.unsplash.com/photo-1631049035182-249067d7618e?w=1000",
    href: "/pillow-covers",
  },
  {
    name: "Plain Comforter",
    subtitle: "EVERYDAY SOFTNESS",
    description: "Soft comfort for everyday living.",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1000",
    href: "/comforter",
  },
  {
    name: "AC Comforter Set",
    subtitle: "COMFORT IN EVERY SEASON",
    description: "Lightweight comfort for peaceful nights.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1000",
    href: "/ac-comforter-set",
  },
];

export default function Home() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [arrivalsLoading, setArrivalsLoading] = useState(true);

  useEffect(() => {
    async function loadNewArrivals() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("New arrivals load error:", error.message);
        setArrivalsLoading(false);
        return;
      }

      const formattedProducts: Product[] = (data || []).map((item) => ({
        id: Number(item.id),
        name: item.name,
        category: item.category,
        image: item.image || item.images?.[0] || "",
        images: item.images || (item.image ? [item.image] : []),
        price: Number(item.price || 0),
        fabric: item.fabric || "",
        size: item.size || "",
        color: item.color || "",
        description: item.description || "",
        stock: Number(item.stock || 0),
      }));

      setNewArrivals(formattedProducts);
      setArrivalsLoading(false);
    }

    loadNewArrivals();
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f3ed] text-[#292820]">
      <Header />

      {/* HERO SECTION */}

      <section className="w-full overflow-hidden bg-[#292820]">
        {/* MOBILE HERO */}

        <div className="sm:hidden">
          <img
            src="/velora-hero-full.png"
            alt="Velora luxury bedroom collection"
            className="block h-auto w-full object-contain"
          />

          <div className="px-6 py-10 text-white">
            <p className="text-[9px] font-medium tracking-[0.4em] text-[#e5c99c]">
              THE ART OF BEAUTIFUL LIVING
            </p>

            <h1 className="mt-4 font-serif text-4xl leading-tight">
              Comfort Meets
              <br />
              Elegance.
            </h1>

            <p className="mt-4 max-w-lg text-xs leading-7 text-white/85">
              Discover beautifully crafted home textiles designed to bring
              comfort, softness and timeless elegance to your home.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/#collections"
                className="border border-[#b88d50] bg-[#b88d50] px-5 py-3.5 text-[9px] font-semibold tracking-[0.15em] text-white transition duration-300 hover:bg-white hover:text-[#292820]"
              >
                SHOP COLLECTION
              </Link>

              <Link
                href="#velora-story"
                className="border border-white/80 px-5 py-3.5 text-[9px] font-semibold tracking-[0.15em] text-white transition duration-300 hover:bg-white hover:text-[#292820]"
              >
                DISCOVER VELORA
              </Link>
            </div>
          </div>
        </div>

        {/* DESKTOP HERO */}

        <div className="relative hidden h-[580px] sm:block sm:h-[680px] lg:h-[760px]">
          <img
            src="/velora-hero-full.png"
            alt="Velora luxury bedroom collection"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#211e19]/75 via-[#211e19]/35 to-transparent" />

          <div className="relative z-10 flex h-full items-center px-6 sm:px-12 md:px-16 lg:px-24">
            <div className="max-w-2xl text-white">
              <p className="text-[9px] font-medium tracking-[0.4em] text-[#e5c99c] sm:text-[11px]">
                THE ART OF BEAUTIFUL LIVING
              </p>

              <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Comfort Meets
                <br />
                Elegance.
              </h1>

              <p className="mt-6 max-w-lg text-xs leading-7 text-white/85 sm:text-sm sm:leading-8">
                Discover beautifully crafted home textiles designed to bring
                comfort, softness and timeless elegance to your home.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/#collections"
                  className="border border-[#b88d50] bg-[#b88d50] px-6 py-3.5 text-[9px] font-semibold tracking-[0.2em] text-white transition duration-300 hover:border-white hover:bg-white hover:text-[#292820] sm:px-8 sm:text-[10px]"
                >
                  SHOP COLLECTION
                </Link>

                <Link
                  href="#velora-story"
                  className="border border-white/80 bg-transparent px-6 py-3.5 text-[9px] font-semibold tracking-[0.2em] text-white transition duration-300 hover:bg-white hover:text-[#292820] sm:px-8 sm:text-[10px]"
                >
                  DISCOVER VELORA
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}

      <section
        id="collections"
        className="bg-[#f5f3ed] px-5 py-16 sm:px-8 sm:py-20 md:px-12 lg:px-16"
      >
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-10 text-center sm:mb-12">
            <p className="text-[9px] tracking-[0.4em] text-[#a17a43] sm:text-[10px]">
              EXPLORE VELORA
            </p>

            <h2 className="mt-3 font-serif text-4xl text-[#292820] sm:text-5xl">
              Shop By Category
            </h2>

            <p className="mx-auto mt-4 max-w-md text-xs leading-6 text-[#81786d]">
              Thoughtfully chosen essentials for a more beautiful and
              comfortable home.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-5">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                href={category.href}
                className="group overflow-hidden rounded-2xl border border-[#e5ded1] bg-[#fffdf9] shadow-[0_3px_14px_rgba(70,55,35,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(70,55,35,0.12)]"
              >
                <div className="relative">
                  <div className="aspect-[4/5] overflow-hidden bg-[#eee9df]">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="absolute bottom-0 left-1/2 z-10 flex h-10 w-10 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#b88d50] font-serif text-xs text-white shadow-md">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>

                <div className="px-3 pb-5 pt-8 text-center sm:px-4">
                  <h3 className="font-serif text-lg text-[#292820] transition-colors duration-300 group-hover:text-[#a17a43] sm:text-xl">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-[8px] font-medium tracking-[0.17em] text-[#a17a43] sm:text-[9px]">
                    {category.subtitle}
                  </p>

                  <p className="mt-2 text-[10px] leading-5 text-[#81786d] sm:text-xs">
                    {category.description}
                  </p>

                  <p className="mt-4 text-[9px] font-semibold tracking-[0.15em] text-[#a17a43] transition-all duration-300 group-hover:tracking-[0.22em]">
                    EXPLORE →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}

      <section
        id="new-arrivals"
        className="border-t border-[#e5ded1] bg-[#faf8f3] px-5 py-16 sm:px-8 sm:py-20 md:px-12 lg:px-16"
      >
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[9px] tracking-[0.35em] text-[#a17a43] sm:text-[10px]">
            FRESH FROM VELORA
          </p>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-serif text-4xl text-[#292820] sm:text-5xl">
              New Arrivals
            </h2>

            <p className="text-[10px] tracking-[0.15em] text-[#81786d]">
              OUR LATEST COLLECTION
            </p>
          </div>

          {arrivalsLoading ? (
            <p className="py-12 text-center text-sm text-[#81786d]">
              Loading latest products...
            </p>
          ) : newArrivals.length === 0 ? (
            <p className="py-12 text-center text-sm text-[#81786d]">
              New collections coming soon.
            </p>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* VELORA PROMISE */}

      <section className="border-t border-[#e5ded1] bg-[#eeece4] px-5 py-20 sm:px-8 sm:py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[9px] tracking-[0.4em] text-[#a17a43] sm:text-[10px]">
              THE VELORA PROMISE
            </p>

            <h2 className="mt-4 font-serif text-4xl text-[#292820] sm:text-5xl">
              Made for Everyday Luxury
            </h2>

            <p className="mt-6 text-sm leading-8 text-[#716b60]">
              Thoughtfully selected textiles that bring softness, comfort and
              timeless elegance to your home.
            </p>
          </div>

          <div className="mt-12 grid border-y border-[#d8d1c3] md:mt-16 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "PREMIUM QUALITY",
                description:
                  "Carefully selected fabrics designed for softness, comfort and everyday living.",
              },
              {
                number: "02",
                title: "TIMELESS DESIGN",
                description:
                  "Elegant patterns and refined textures created to complement your home beautifully.",
              },
              {
                number: "03",
                title: "MADE WITH CARE",
                description:
                  "Every textile is thoughtfully chosen with attention to comfort, detail and lasting appeal.",
              },
            ].map((item, index) => (
              <div
                key={item.number}
                className={`px-5 py-10 text-center transition duration-300 hover:bg-[#e7e3d9] sm:px-8 ${
                  index !== 0 ? "border-t border-[#d8d1c3] md:border-t-0" : ""
                } ${index !== 2 ? "md:border-r md:border-[#d8d1c3]" : ""}`}
              >
                <div className="font-serif text-3xl text-[#a17a43]">
                  {item.number}
                </div>

                <h3 className="mt-6 text-[10px] tracking-[0.3em] text-[#292820]">
                  {item.title}
                </h3>

                <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-[#716b60]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VELORA STORY */}

      <section
        id="velora-story"
        className="border-t border-[#e5ded1] bg-[#eae9e1]"
      >
        <div className="grid md:grid-cols-2">
          <div className="relative min-h-[400px] overflow-hidden sm:min-h-[500px] md:min-h-[600px]">
            <img
              src="/velora-luxury-bedroom-hero.png"
              alt="Beautiful Velora bedroom interior"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-[#292820]/20" />
            <div className="absolute inset-6 border border-white/60 sm:inset-10" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <p className="font-serif text-6xl font-semibold tracking-widest sm:text-7xl md:text-8xl">
                  VELORA
                </p>

                <div className="mx-auto mt-5 h-px w-12 bg-white/80" />

                <p className="mt-5 text-[8px] tracking-[0.4em]">
                  THE ART OF TEXTILES
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center px-6 py-16 sm:px-10 md:px-14 lg:px-20">
            <div className="max-w-xl">
              <p className="text-[9px] tracking-[0.4em] text-[#a17a43] sm:text-[10px]">
                THE VELORA STORY
              </p>

              <h2 className="mt-5 font-serif text-5xl leading-tight text-[#292820] sm:text-6xl">
                Crafted for
                <br />
                Beautiful Living.
              </h2>

              <div className="mt-7 h-px w-14 bg-[#b88d50]" />

              <p className="mt-7 text-sm leading-8 text-[#716b60]">
                At Velora, we believe that everyday comfort can be beautifully
                designed. Our collection brings together thoughtfully chosen
                textiles, refined textures and timeless designs made for modern
                homes.
              </p>

              <p className="mt-5 text-sm leading-8 text-[#716b60]">
                From quiet mornings to restful nights, every piece is selected
                to bring warmth, softness and effortless elegance into your
                space.
              </p>

              <Link
                href="#collections"
                className="mt-9 inline-block border-b border-[#292820] pb-2 text-[10px] font-medium tracking-[0.3em] transition duration-300 hover:-translate-y-1 hover:opacity-50"
              >
                DISCOVER OUR COLLECTION →
              </Link>
            </div>
          </div>
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
                CUSTOMER CARE
              </p>

              <div className="mt-5 space-y-3 text-sm text-[#e0ddd5]">
                <p>Contact Us</p>
                <p>Shipping Information</p>
                <p>Returns & Refunds</p>
                <p>Privacy Policy</p>
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
