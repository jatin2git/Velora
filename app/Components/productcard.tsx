
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
    const saved = JSON.parse(
      localStorage.getItem("velora-wishlist") || "[]"
    );
    setIsWishlisted(saved.map(Number).includes(Number(product.id)));
  }, [product.id]);

  const toggleWishlist = () => {
    const saved = JSON.parse(
      localStorage.getItem("velora-wishlist") || "[]"
    );

    const ids = saved.map(Number);

    const updated = ids.includes(Number(product.id))
      ? ids.filter((id: number) => id !== Number(product.id))
      : [...ids, Number(product.id)];

    setIsWishlisted(updated.includes(Number(product.id)));
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
    <div className="group overflow-hidden rounded-2xl border border-[#e5ded1] bg-[#fffdf9] shadow-[0_3px_14px_rgba(70,55,35,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(70,55,35,0.12)]">

      <div className="relative aspect-[3/4] overflow-hidden bg-[#eee9df]">
        <Link
          href={`/product/${product.id}`}
          className="absolute inset-0"
        >
          {productImage ? (
            <img
              src={productImage}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="font-serif text-4xl tracking-[0.2em] text-[#292820]">
                  VELORA
                </p>
                <div className="mx-auto mt-3 h-px w-10 bg-[#b48a50]" />
                <p className="mt-3 text-[8px] tracking-[0.3em] text-[#82796b]">
                  THE ART OF TEXTILES
                </p>
              </div>
            </div>
          )}
        </Link>

        <button
          type="button"
          onClick={toggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#e8dfd1] bg-[#fffdf9]/95 text-2xl shadow-sm transition hover:scale-110 hover:bg-white"
        >
          <span className={isWishlisted ? "text-[#a64d42]" : "text-[#292820]"}>
            {isWishlisted ? "♥" : "♡"}
          </span>
        </button>

        
      </div>

      <div className="px-3 pb-4 pt-7 text-center sm:px-4 sm:pb-5">
        <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#a17a43]">
          {product.fabric || "VELORA COLLECTION"}
        </p>

        <Link href={`/product/${product.id}`}>
          <h3 className="mt-2 font-serif text-lg leading-snug text-[#292820] transition-colors duration-300 group-hover:text-[#a17a43] sm:text-xl">
            {product.name}
          </h3>

          <p className="mt-2 text-[10px] tracking-wide text-[#81786d]">
            {product.size} · {product.color}
          </p>
        </Link>

        <p className="mt-3 text-sm font-semibold text-[#ad8146]">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleBuyNow}
            className="bg-[#292820] px-2 py-3 text-[9px] font-medium tracking-wider text-white transition hover:bg-[#806744] sm:text-[10px]"
          >
            BUY NOW
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            className="border border-[#b69a70] bg-transparent px-2 py-3 text-[9px] font-medium tracking-wider text-[#665238] transition hover:bg-[#b69a70] hover:text-white sm:text-[10px]"
          >
            {added ? "ADDED ✓" : "ADD TO CART"}
          </button>
        </div>
      </div>
    </div>
  );
}
