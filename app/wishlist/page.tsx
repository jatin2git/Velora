
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type WishlistProduct = {
  id: number;
  name: string;
  image: string | null;
  images?: string[] | null;
  price: number;
  fabric: string | null;
  size: string | null;
};

export default function WishlistPage() {
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      const saved = JSON.parse(localStorage.getItem("velora-wishlist") || "[]");
      const ids = saved.map(Number).filter((id: number) => Number.isFinite(id));

      if (ids.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("id", ids)
        .eq("is_active", true);

      if (!error && data) {
        setProducts(data);
      }

      setLoading(false);
    };

    loadWishlist();
  }, []);

  const removeProduct = (id: number) => {
    const updated = products.filter((product) => product.id !== id);
    setProducts(updated);
    localStorage.setItem(
      "velora-wishlist",
      JSON.stringify(updated.map((product) => product.id))
    );
  };

  return (
    <main className="min-h-screen bg-[#f8f6f2] px-5 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-xs tracking-[0.25em] text-[#8a7968]">
          YOUR PERSONAL COLLECTION
        </p>

        <div className="mb-10 flex items-center justify-between border-b border-[#dedbd5] pb-6">
          <h1 className="font-serif text-3xl text-[#24211e] sm:text-4xl">
            My Wishlist
          </h1>
          <span className="text-sm text-[#77716a]">
            {products.length} Items
          </span>
        </div>

        {loading ? (
          <p className="py-20 text-center text-[#77716a]">
            Loading your wishlist...
          </p>
        ) : products.length === 0 ? (
          <div className="py-24 text-center">
            <div className="mb-5 text-5xl text-[#a69a8b]">♡</div>
            <h2 className="font-serif text-2xl text-[#24211e]">
              Your wishlist is empty
            </h2>
            <p className="mt-3 text-sm text-[#77716a]">
              Save your favourite products here.
            </p>
            <Link
              href="/bedsheet"
              className="mt-7 inline-block bg-[#29251f] px-8 py-4 text-xs tracking-widest text-white transition hover:bg-[#75634f]"
            >
              EXPLORE COLLECTION
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="group">
                <Link href={`/product/${product.id}`}>
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#e8e3dc]">
                    <img
                      src={product.images?.[0] || product.image || "/placeholder.png"}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-4 text-sm text-[#24211e] sm:text-base">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-[#77716a]">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </p>
                </Link>

                <button
                  onClick={() => removeProduct(product.id)}
                  className="mt-3 text-xs tracking-wider text-[#8a5148] transition hover:text-[#24211e]"
                >
                  REMOVE
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
