
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Header from "../../Components/Header";
import { Product } from "../../data/products";
import { useCart } from "../../Components/CartContext";
import { supabase } from "../../lib/supabase";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);

      const productId = Number(params.id);

      if (!Number.isFinite(productId)) {
        setProduct(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("Product loading error:", error.message);
        setProduct(null);
      } else if (data) {
        const formattedProduct: Product = {
          id: Number(data.id),
          name: data.name,
          category: data.category,
          image: data.image || "",
          images: data.images || [],
          price: Number(data.price),
          fabric: data.fabric || "",
          size: data.size || "",
          color: data.color || "",
          description: data.description || "",
          stock: Number(data.stock),
        };

        setProduct(formattedProduct);
        setSelectedImage(
          formattedProduct.images?.[0] || formattedProduct.image
        );
      } else {
        setProduct(null);
      }

      setLoading(false);
    }

    loadProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product);
    router.push("/cart");
  };

  const handleBuyNow = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product);
    router.push("/checkout");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f6f2] text-[#24211e]">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center text-base text-[#8a8178]">
          Loading product...
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f8f6f2] text-[#24211e]">
        <Header />
        <section className="flex min-h-[60vh] items-center justify-center px-6 text-center">
          <div>
            <p className="text-xs tracking-[0.35em] text-[#8a8178]">
              VELORA
            </p>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl">
              Product Not Found
            </h1>
            <p className="mt-4 text-base text-[#716b64]">
              The product you are looking for does not exist or is unavailable.
            </p>
            <Link
              href="/"
              className="mt-8 inline-block bg-[#24211e] px-9 py-5 text-xs tracking-[0.25em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#3b3631]"
            >
              BACK TO HOME
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const productImages = product.images?.length
    ? product.images
    : product.image
      ? [product.image]
      : [];

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-[#24211e]">
      <Header />

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16 md:px-12 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="relative aspect-[4/5] overflow-hidden bg-[#e3ddd4]">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-serif text-7xl italic tracking-wide text-[#b8aea2] sm:text-8xl">
                      VELORA
                    </p>
                    <div className="mx-auto mt-5 h-px w-12 bg-[#aaa095]" />
                    <p className="mt-5 text-xs tracking-[0.35em] text-[#958a7f]">
                      PRODUCT IMAGE
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button"
                aria-label="Add to wishlist"
                className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center bg-[#f8f6f2]/90 text-2xl transition duration-300 hover:scale-110 hover:bg-white"
              >
                ♡
              </button>
            </div>

            {productImages.length > 1 && (
              <div className="mt-5 flex flex-wrap gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`h-20 w-20 overflow-hidden border-2 ${
                      selectedImage === image
                        ? "border-[#24211e]"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs font-medium tracking-[0.3em] text-[#8a8178] sm:text-sm">
              VELORA COLLECTION
            </p>

            <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {product.name}
            </h1>

            <div className="mt-7 h-px w-16 bg-[#8d8277]" />

            <p className="mt-7 text-sm tracking-[0.12em] leading-7 text-[#716b64] sm:text-base">
              {product.fabric} · {product.size} · {product.color}
            </p>

            <p className="mt-7 font-serif text-3xl sm:text-4xl">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#655f59] sm:text-lg">
              {product.description}
            </p>

            <div className="mt-9 border-y border-[#ddd8d0] py-7">
              <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                <div>
                  <p className="text-xs font-medium tracking-[0.2em] text-[#8a8178] sm:text-sm">
                    FABRIC
                  </p>
                  <p className="mt-3 text-base font-medium sm:text-lg">
                    {product.fabric || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium tracking-[0.2em] text-[#8a8178] sm:text-sm">
                    SIZE
                  </p>
                  <p className="mt-3 text-base font-medium sm:text-lg">
                    {product.size || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium tracking-[0.2em] text-[#8a8178] sm:text-sm">
                    COLOR
                  </p>
                  <p className="mt-3 text-base font-medium sm:text-lg">
                    {product.color || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium tracking-[0.2em] text-[#8a8178] sm:text-sm">
                    AVAILABILITY
                  </p>
                  <p className={`mt-3 text-base font-medium sm:text-lg ${
                    product.stock > 0 ? "text-[#58734d]" : "text-[#a34d42]"
                  }`}>
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-[#24211e] px-8 py-5 text-xs font-medium tracking-[0.22em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#3b3631] disabled:cursor-not-allowed disabled:bg-[#aaa39b]"
              >
                {product.stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 border border-[#24211e] px-8 py-5 text-xs font-medium tracking-[0.22em] transition duration-300 hover:-translate-y-0.5 hover:bg-[#24211e] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                BUY NOW
              </button>
            </div>

            <Link
              href={product.category === "bedsheet" ? "/bedsheet" : "/comforter"}
              className="mt-9 inline-block text-sm font-medium tracking-[0.2em] text-[#716b64] transition duration-300 hover:translate-x-1 hover:text-[#24211e] sm:text-base"
            >
              ← BACK TO COLLECTION
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#d9d4cd] bg-[#24211e] text-[#f5f2ed]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 md:px-12">
          <div className="grid gap-10 md:grid-cols-4">
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

          <div className="mt-12 border-t border-[#514c47] pt-6 text-center">
            <p className="text-[9px] tracking-[0.2em] text-[#918b84]">
              © 2026 VELORA. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
