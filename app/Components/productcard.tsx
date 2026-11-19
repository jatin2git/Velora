"use client";

import Link from "next/link";
import { Product } from "../data/products";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#e3ddd4]">
        <div className="absolute inset-0 flex items-center justify-center transition duration-700 group-hover:scale-105">
          <div className="text-center">
            <p className="font-serif text-6xl italic tracking-wide text-[#b8aea2]">
              VELORA
            </p>

            <div className="mx-auto mt-4 h-px w-10 bg-[#aaa095]" />

            <p className="mt-4 text-[8px] tracking-[0.35em] text-[#958a7f]">
              PREMIUM TEXTILES
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center bg-[#f8f6f2]/90 text-lg transition duration-300 hover:scale-110 hover:bg-white"
        >
          ♡
        </button>

        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[#24211e]/90 px-6 py-4 text-center text-white transition duration-500 group-hover:translate-y-0">
          <span className="text-[9px] tracking-[0.3em]">
            VIEW DETAILS →
          </span>
        </div>
      </div>

      <div className="pt-5">
        <p className="text-[9px] tracking-[0.25em] text-[#8a8178]">
          {product.fabric}
        </p>

        <h3 className="mt-2 font-serif text-2xl transition duration-300 group-hover:opacity-60">
          {product.name}
        </h3>

        <p className="mt-2 text-[10px] tracking-[0.18em] text-[#716b64]">
          {product.size} · {product.color}
        </p>
      </div>
    </Link>
  );
}