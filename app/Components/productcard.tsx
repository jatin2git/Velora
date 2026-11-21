
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "../data/products";
import { useCart } from "./CartContext";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const productImage = product.images?.[0] || product.image;
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("velora-wishlist") || "[]");
    setIsWishlisted(saved.map(Number).includes(product.id));
  }, [product.id]);

  const toggleWishlist = () => {
    const saved = JSON.parse(localStorage.getItem("velora-wishlist") || "[]");
    const ids = saved.map(Number);

    const updated = ids.includes(product.id)
      ? ids.filter((id: number) => id !== product.id)
      : [...ids, product.id];

    setIsWishlisted(updated.includes(product.id));
    localStorage.setItem("velora-wishlist", JSON.stringify(updated));
  };

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product);
    router.push("/checkout");
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
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center bg-[#f8f6f2]/90 text-2xl transition hover:scale-110 hover:bg-white"
        >
          <span className={isWishlisted ? "text-[#9b5148]" : "text-[#24211e]"}>
            {isWishlisted ? "♥" : "♡"}
          </span>
        </button>
      </div>

      <div className="pt-4">
        <Link href={`/product/${product.id}`}>
          <p className="text-[9px] tracking-[0.25em] text-[#8a8178]">
            {product.fabric}
          </p>

          <h3 className="mt-2 font-serif text-xl transition duration-300 group-hover:opacity-60 sm:text-2xl">
            {product.name}
          </h3>

          <p className="mt-2 text-[10px] tracking-[0.18em] text-[#716b64]">
            {product.size} · {product.color}
          </p>
        </Link>

        <p className="mt-3 text-base font-medium text-[#24211e]">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleBuyNow}
            className="bg-[#24211e] px-2 py-3 text-[9px] font-medium tracking-wider text-white transition hover:bg-[#75634f] sm:text-[10px]"
          >
            BUY NOW
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            className="border border-[#24211e] bg-transparent px-2 py-3 text-[9px] font-medium tracking-wider text-[#24211e] transition hover:bg-[#24211e] hover:text-white sm:text-[10px]"
          >
            {added ? "ADDED ✓" : "ADD TO CART"}
          </button>
        </div>
      </div>
    </div>
  );
}
