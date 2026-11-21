
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Product } from "../data/products";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const productImage = product.images?.[0] || product.image;
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("velora-wishlist") || "[]");
    setIsWishlisted(saved.map(Number).includes(product.id));
  }, [product.id]);

  const toggleWishlist = () => {
    const saved = JSON.parse(localStorage.getItem("velora-wishlist") || "[]");
    const ids = saved.map(Number);

    let updated;

    if (ids.includes(product.id)) {
      updated = ids.filter((id: number) => id !== product.id);
      setIsWishlisted(false);
    } else {
      updated = [...ids, product.id];
      setIsWishlisted(true);
    }

    localStorage.setItem("velora-wishlist", JSON.stringify(updated));
  };

  return (
    <div className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#e3ddd4]">
        <Link href={`/product/${product.id}`} className="absolute inset-0">
          {productImage ? (
            <img
              src={productImage}
              alt={product.name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="font-serif text-5xl italic tracking-wide text-[#b8aea2]">
                  VELORA
                </p>
                <div className="mx-auto mt-4 h-px w-10 bg-[#aaa095]" />
                <p className="mt-4 text-[8px] tracking-[0.35em] text-[#958a7f]">
                  PREMIUM TEXTILES
                </p>
              </div>
            </div>
          )}
        </Link>

        <button
          type="button"
          onClick={toggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center bg-[#f8f6f2]/90 text-2xl transition duration-300 hover:scale-110 hover:bg-white"
        >
          <span className={isWishlisted ? "text-[#9b5148]" : "text-[#24211e]"}>
            {isWishlisted ? "♥" : "♡"}
          </span>
        </button>

        <Link
          href={`/product/${product.id}`}
          className="absolute inset-x-0 bottom-0 translate-y-full bg-[#24211e]/90 px-6 py-4 text-center text-white transition duration-500 group-hover:translate-y-0"
        >
          <span className="text-[9px] tracking-[0.3em]">
            VIEW DETAILS →
          </span>
        </Link>
      </div>

      <Link href={`/product/${product.id}`} className="block pt-5">
        <p className="text-[9px] tracking-[0.25em] text-[#8a8178]">
          {product.fabric}
        </p>

        <h3 className="mt-2 font-serif text-2xl transition duration-300 group-hover:opacity-60">
          {product.name}
        </h3>

        <p className="mt-2 text-[10px] tracking-[0.18em] text-[#716b64]">
          {product.size} · {product.color}
        </p>
      </Link>
    </div>
  );
}
