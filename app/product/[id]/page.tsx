
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
          image: data.image || data.images?.[0] || "",
          images: data.images || (data.image ? [data.image] : []),
          price: Number(data.price || 0),
          mrp: data.mrp ? Number(data.mrp) : null,
          fabric: data.fabric || "",
          size: data.size || "",
          color: data.color || "",
          description: data.description || "",
          stock: Number(data.stock || 0),
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
      <main className="min-h-screen bg-[#f5f3ed] text-[#292820]">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-[#81786d]">
          Loading product...
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f5f3ed] text-[#292820]">
        <Header />
        <section className="flex min-h-[60vh] items-center justify-center px-6 text-center">
          <div>
            <p className="text-xs tracking-[0.35em] text-[#a17a43]">
              VELORA
            </p>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl">
              Product Not Found
            </h1>
            <p className="mt-4 text-sm text-[#81786d]">
              This product is unavailable at the moment.
            </p>
            <Link
              href="/"
              className="mt-8 inline-block bg-[#292820] px-8 py-4 text-sm text-white transition hover:bg-[#a17a43]"
            >
              Back to Home
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

  const mrp = Number(product.mrp || 0);
  const sellingPrice = Number(product.price || 0);
  const hasDiscount = mrp > sellingPrice && mrp > 0;

  const discountPercentage = hasDiscount
    ? Math.round(((mrp - sellingPrice) / mrp) * 100)
    : 0;

  const savings = hasDiscount ? mrp - sellingPrice : 0;

  const categoryLinks: Record<string, string> = {
    bedsheet: "/bedsheet",
    comforter: "/comforter",
    "pillow-covers": "/pillow-covers",
    "ac-comforter-set": "/ac-comforter-set",
  };

  const backLink = categoryLinks[product.category] || "/";

  return (
    <main className="min-h-screen bg-[#f5f3ed] text-[#292820]">
      <Header />

      <section className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="mb-8">
          <Link
            href={backLink}
            className="text-xs text-[#81786d] transition hover:text-[#a17a43]"
          >
            ← Back to Collection
          </Link>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {/* PRODUCT IMAGES */}

          <div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#ebe7df]">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="font-serif text-6xl tracking-widest text-[#b8aea2]">
                    VELORA
                  </p>
                </div>
              )}

              {hasDiscount && (
                <div className="absolute left-4 top-4 bg-[#b88d50] px-3 py-2 text-[10px] font-medium tracking-wider text-white">
                  {discountPercentage}% OFF
                </div>
              )}
            </div>

            {productImages.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`h-20 w-20 overflow-hidden border transition sm:h-24 sm:w-24 ${
                      selectedImage === image
                        ? "border-[#a17a43]"
                        : "border-[#e1dbd0] hover:border-[#a17a43]"
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

          {/* PRODUCT INFORMATION */}

          <div className="lg:sticky lg:top-24">
            <p className="text-[10px] font-medium tracking-[0.3em] text-[#a17a43]">
              VELORA COLLECTION
            </p>

            <h1 className="mt-4 font-serif text-3xl leading-snug text-[#292820] sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <div className="mt-5 h-px w-14 bg-[#b88d50]" />

            {/* PRICE */}

            <div className="mt-7">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-2xl font-semibold text-[#303a32] sm:text-3xl">
                  ₹{sellingPrice.toLocaleString("en-IN")}
                </span>

                {hasDiscount && (
                  <>
                    <span className="text-base text-[#999187] line-through">
                      ₹{mrp.toLocaleString("en-IN")}
                    </span>

                    <span className="bg-[#eee8dc] px-2.5 py-1 text-[10px] font-medium tracking-wide text-[#98713c]">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>

              {hasDiscount && (
                <p className="mt-2 text-xs text-[#81786d]">
                  You save ₹{savings.toLocaleString("en-IN")}
                </p>
              )}

              <p className="mt-3 text-xs text-[#81786d]">
                Inclusive of all taxes
              </p>
            </div>

            {/* DESCRIPTION */}

            {product.description && (
              <p className="mt-7 max-w-xl text-sm leading-7 text-[#716b60]">
                {product.description}
              </p>
            )}

            {/* PRODUCT DETAILS */}

            <div className="mt-8 border-y border-[#ded8cc]">
              {[
                { label: "Fabric", value: product.fabric },
                { label: "Size", value: product.size },
                { label: "Colour", value: product.color },
                {
                  label: "Availability",
                  value: product.stock > 0 ? "In Stock" : "Out of Stock",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-4 border-b border-[#e7e1d7] py-4 last:border-b-0"
                >
                  <span className="text-xs text-[#81786d]">
                    {item.label}
                  </span>

                  <span
                    className={`text-sm font-medium text-right ${
                      item.label === "Availability"
                        ? product.stock > 0
                          ? "text-[#58734d]"
                          : "text-[#a34d42]"
                        : "text-[#292820]"
                    }`}
                  >
                    {item.value || "Not specified"}
                  </span>
                </div>
              ))}
            </div>

            {/* ACTION BUTTONS */}

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="border border-[#292820] bg-transparent px-6 py-4 text-sm font-medium text-[#292820] transition duration-300 hover:bg-[#292820] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="bg-[#292820] px-6 py-4 text-sm font-medium text-white transition duration-300 hover:bg-[#a17a43] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Buy Now
              </button>
            </div>

            <p className="mt-5 text-center text-[11px] text-[#81786d] sm:text-left">
              Thoughtfully selected textiles for beautiful living.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="border-t border-[#494438] bg-[#292820] text-[#f5f3ed]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:px-12">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            <div className="md:col-span-2">
              <Link
                href="/"
                className="font-serif text-3xl tracking-[0.2em] transition hover:opacity-70"
              >
                VELORA
              </Link>

              <p className="mt-2 text-[8px] tracking-[0.4em] text-[#d0c5b2]">
                THE ART OF TEXTILES
              </p>

              <p className="mt-5 max-w-md text-sm leading-7 text-[#ded8cc]">
                Thoughtfully selected home textiles designed to bring comfort,
                softness and timeless elegance into everyday living.
              </p>
            </div>

            <div>
              <p className="text-[9px] tracking-[0.3em] text-[#d0c5b2]">
                EXPLORE
              </p>

              <div className="mt-5 space-y-3 text-sm text-[#ded8cc]">
                <Link href="/" className="block transition hover:text-white">Home</Link>
                <Link href="/bedsheet" className="block transition hover:text-white">Bedsheets</Link>
                <Link href="/pillow-covers" className="block transition hover:text-white">Pillow Covers</Link>
                <Link href="/comforter" className="block transition hover:text-white">Plain Comforter</Link>
                <Link href="/ac-comforter-set" className="block transition hover:text-white">AC Comforter Set</Link>
              </div>
            </div>

            <div>
              <p className="text-[9px] tracking-[0.3em] text-[#d0c5b2]">
                CUSTOMER CARE
              </p>

              <div className="mt-5 space-y-3 text-sm text-[#ded8cc]">
                <p>Contact Us</p>
                <p>Shipping Information</p>
                <p>Returns & Refunds</p>
                <p>Privacy Policy</p>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-[#514c40] pt-6 text-center">
            <p className="text-[9px] tracking-[0.2em] text-[#d0c5b2]">
              © 2026 VELORA. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
