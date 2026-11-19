"use client";

import Header from "./Components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f6f2] text-[#24211e]">
      <Header />

      <section className="relative overflow-hidden border-b border-[#dedbd5] bg-[#e8e2d9]">
        <div className="grid min-h-[650px] md:grid-cols-2">
          <div className="flex items-center px-6 py-16 sm:px-8 sm:py-20 md:px-14 lg:px-20">
            <div className="max-w-xl">
              <p className="mb-5 text-[9px] tracking-[0.35em] text-[#756b61] sm:mb-6 sm:text-[10px] sm:tracking-[0.45em]">
                THE ART OF BEAUTIFUL LIVING
              </p>

              <h1 className="font-serif text-4xl leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl">
                Comfort,
                <br />
                Crafted Beautifully.
              </h1>

              <div className="mt-6 h-px w-14 bg-[#8d8277] sm:mt-7" />

              <p className="mt-6 max-w-md text-sm leading-7 text-[#655f59] sm:mt-7">
                Thoughtfully crafted home textiles designed to bring timeless
                comfort, understated elegance and warmth into your everyday
                living.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-5 sm:mt-10 sm:gap-7">
                <a
                  href="/bedsheet"
                  className="inline-block bg-[#24211e] px-6 py-4 text-[9px] font-medium tracking-[0.25em] text-white transition duration-300 hover:-translate-y-1 hover:bg-[#3b3631] hover:shadow-lg sm:px-9 sm:text-[11px] sm:tracking-[0.3em]"
                >
                  SHOP COLLECTION
                </a>

                <a
                  href="#collections"
                  className="inline-block border-b border-[#24211e] pb-2 text-[9px] font-medium tracking-[0.25em] transition duration-300 hover:-translate-y-1 hover:opacity-50 sm:text-[11px] sm:tracking-[0.3em]"
                >
                  DISCOVER VELORA →
                </a>
              </div>
            </div>
          </div>

          <div className="relative min-h-[380px] bg-[#d8d0c5] sm:min-h-[430px] md:min-h-0">
            <div className="absolute inset-6 border border-[#b9afa3] sm:inset-8 md:inset-12" />

            <div className="relative flex h-full items-center justify-center">
              <div className="text-center">
                <p className="font-serif text-5xl italic tracking-wide text-[#81766b] sm:text-6xl md:text-7xl">
                  VELORA
                </p>

                <div className="mx-auto mt-4 h-px w-10 bg-[#9c9084] sm:mt-5 sm:w-12" />

                <p className="mt-4 text-[7px] tracking-[0.35em] text-[#81766b] sm:mt-5 sm:text-[8px] sm:tracking-[0.45em]">
                  PREMIUM HOME TEXTILES
                </p>

                <p className="mt-3 text-[8px] tracking-[0.12em] text-[#91867b] sm:text-[9px] sm:tracking-[0.15em]">
                  EST. 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="collections" className="px-5 py-16 sm:px-6 sm:py-20 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 sm:mb-12">
            <p className="text-[9px] tracking-[0.35em] text-[#8a8178] sm:text-[10px] sm:tracking-[0.4em]">
              EXPLORE OUR COLLECTION
            </p>

            <h2 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl">
              Shop By Category
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <a
              href="/bedsheet"
              className="group relative h-[360px] overflow-hidden bg-[#e3ddd4] transition duration-500 hover:-translate-y-2 hover:shadow-xl sm:h-[420px]"
            >
              <div className="absolute inset-0 flex items-center justify-center transition duration-700 group-hover:scale-105">
                <span className="font-serif text-6xl italic text-[#c4bbb0] sm:text-7xl">
                  01
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#24211e]/80 to-transparent p-6 pt-24 text-white sm:p-7 sm:pt-24">
                <p className="text-[8px] tracking-[0.25em] text-white/70 sm:text-[9px] sm:tracking-[0.3em]">
                  TIMELESS COMFORT
                </p>

                <h3 className="mt-2 font-serif text-2xl sm:text-3xl">
                  Bedsheets
                </h3>

                <p className="mt-4 text-[9px] tracking-[0.2em] sm:text-[10px] sm:tracking-[0.25em]">
                  DISCOVER COLLECTION →
                </p>
              </div>
            </a>

            <a
              href="/comforter"
              className="group relative h-[360px] overflow-hidden bg-[#ddd6cc] transition duration-500 hover:-translate-y-2 hover:shadow-xl sm:h-[420px]"
            >
              <div className="absolute inset-0 flex items-center justify-center transition duration-700 group-hover:scale-105">
                <span className="font-serif text-6xl italic text-[#bdb3a7] sm:text-7xl">
                  02
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#24211e]/80 to-transparent p-6 pt-24 text-white sm:p-7 sm:pt-24">
                <p className="text-[8px] tracking-[0.25em] text-white/70 sm:text-[9px] sm:tracking-[0.3em]">
                  SOFT LUXURY
                </p>

                <h3 className="mt-2 font-serif text-2xl sm:text-3xl">
                  Comforters
                </h3>

                <p className="mt-4 text-[9px] tracking-[0.2em] sm:text-[10px] sm:tracking-[0.25em]">
                  DISCOVER COLLECTION →
                </p>
              </div>
            </a>

            <div className="group relative h-[360px] overflow-hidden bg-[#e7e1d8] transition duration-500 hover:-translate-y-2 hover:shadow-xl sm:h-[420px]">
              <div className="absolute inset-0 flex items-center justify-center transition duration-700 group-hover:scale-105">
                <span className="font-serif text-6xl italic text-[#c7beb3] sm:text-7xl">
                  03
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#24211e]/80 to-transparent p-6 pt-24 text-white sm:p-7 sm:pt-24">
                <p className="text-[8px] tracking-[0.25em] text-white/70 sm:text-[9px] sm:tracking-[0.3em]">
                  JUST ARRIVED
                </p>

                <h3 className="mt-2 font-serif text-2xl sm:text-3xl">
                  New Arrivals
                </h3>

                <p className="mt-4 text-[9px] tracking-[0.2em] sm:text-[10px] sm:tracking-[0.25em]">
                  COMING SOON →
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#dedbd5] bg-[#f8f6f2] px-5 py-20 sm:px-6 sm:py-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[9px] tracking-[0.35em] text-[#8a8178] sm:text-[10px] sm:tracking-[0.4em]">
              THE VELORA PROMISE
            </p>

            <h2 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl">
              Made for Everyday Luxury
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#716b64] sm:mt-6">
              Thoughtfully selected textiles that bring softness, comfort and
              timeless elegance to your home.
            </p>
          </div>

          <div className="mt-12 grid border-y border-[#d8d2ca] sm:mt-16 md:grid-cols-3">
            <div className="px-5 py-9 text-center transition duration-300 hover:bg-[#f1ede7] sm:px-6 sm:py-10 md:border-r md:border-[#d8d2ca]">
              <div className="font-serif text-3xl">01</div>

              <h3 className="mt-6 text-[10px] tracking-[0.3em]">
                PREMIUM QUALITY
              </h3>

              <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-[#716b64]">
                Carefully selected fabrics designed for softness, comfort and
                everyday living.
              </p>
            </div>

            <div className="border-t border-[#d8d2ca] px-5 py-9 text-center transition duration-300 hover:bg-[#f1ede7] sm:px-6 sm:py-10 md:border-t-0 md:border-r">
              <div className="font-serif text-3xl">02</div>

              <h3 className="mt-6 text-[10px] tracking-[0.3em]">
                TIMELESS DESIGN
              </h3>

              <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-[#716b64]">
                Elegant patterns and refined textures created to complement
                your home beautifully.
              </p>
            </div>

            <div className="border-t border-[#d8d2ca] px-5 py-9 text-center transition duration-300 hover:bg-[#f1ede7] sm:px-6 sm:py-10 md:border-t-0">
              <div className="font-serif text-3xl">03</div>

              <h3 className="mt-6 text-[10px] tracking-[0.3em]">
                MADE WITH CARE
              </h3>

              <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-[#716b64]">
                Every textile is thoughtfully chosen with attention to comfort,
                detail and lasting appeal.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#dedbd5] bg-[#ebe6df]">
        <div className="grid md:grid-cols-2">
          <div className="relative min-h-[430px] bg-[#d5cec4] sm:min-h-[500px] md:min-h-[620px]">
            <div className="absolute inset-6 border border-[#b9afa3] sm:inset-7 md:inset-12" />

            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="font-serif text-5xl italic text-[#8b8075] sm:text-6xl md:text-8xl">
                  VELORA
                </p>

                <div className="mx-auto mt-5 h-px w-12 bg-[#9b9084]" />

                <p className="mt-5 text-[7px] tracking-[0.35em] text-[#81766b] sm:text-[8px] sm:tracking-[0.4em]">
                  THE ART OF TEXTILES
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center px-6 py-16 sm:px-8 sm:py-20 md:px-14 lg:px-20">
            <div className="max-w-xl">
              <p className="text-[9px] tracking-[0.35em] text-[#82786e] sm:text-[10px] sm:tracking-[0.4em]">
                THE VELORA STORY
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
                Crafted for
                <br />
                Beautiful Living.
              </h2>

              <div className="mt-7 h-px w-14 bg-[#8d8277]" />

              <p className="mt-7 text-sm leading-8 text-[#665f58]">
                At Velora, we believe that everyday comfort can be beautifully
                designed. Our collection brings together thoughtfully chosen
                textiles, refined textures and timeless designs made for modern
                homes.
              </p>

              <p className="mt-5 text-sm leading-8 text-[#665f58]">
                From quiet mornings to restful nights, every piece is created
                to bring warmth, softness and a sense of effortless elegance
                into your space.
              </p>

              <button className="mt-9 border-b border-[#24211e] pb-2 text-[10px] font-medium tracking-[0.3em] transition duration-300 hover:-translate-y-1 hover:opacity-50">
                DISCOVER OUR STORY →
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#d9d4cd] bg-[#24211e] text-[#f5f2ed]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 md:px-12">
          <div className="grid gap-10 sm:gap-12 md:grid-cols-4">
            <div className="md:col-span-2">
              <a
                href="/"
                className="inline-block font-serif text-3xl tracking-[0.2em] transition duration-300 hover:opacity-70"
              >
                VELORA
              </a>

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
                <a
                  href="/"
                  className="block transition duration-300 hover:translate-x-1 hover:text-white"
                >
                  Home
                </a>

                <a
                  href="/bedsheet"
                  className="block transition duration-300 hover:translate-x-1 hover:text-white"
                >
                  Bedsheets
                </a>

                <a
                  href="/comforter"
                  className="block transition duration-300 hover:translate-x-1 hover:text-white"
                >
                  Comforters
                </a>

                <a
                  href="#collections"
                  className="block transition duration-300 hover:translate-x-1 hover:text-white"
                >
                  Collections
                </a>
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