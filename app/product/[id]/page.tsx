"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "../../Components/Header";
import { products } from "../../data/products";
import { useCart } from "../../Components/CartContext";

export default function ProductPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const router = useRouter();

  const product = products.find(
    (item) => item.id === Number(params.id)
  );

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f8f6f2] text-[#24211e]">
        <Header />

        <section className="flex min-h-[60vh] items-center justify-center px-6 text-center">
          <div>
            <p className="text-[10px] tracking-[0.35em] text-[#8a8178]">
              VELORA
            </p>

            <h1 className="mt-4 font-serif text-4xl">
              Product Not Found
            </h1>

            <p className="mt-4 text-sm text-[#716b64]">
              The product you are looking for does not exist.
            </p>

            <Link
              href="/"
              className="mt-8 inline-block bg-[#24211e] px-8 py-4 text-[9px] tracking-[0.3em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#3b3631]"
            >
              BACK TO HOME
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const handleAddToCart = () => {
  addToCart(product);
  router.push("/cart");
};

const handleBuyNow = () => {
  addToCart(product);
  router.push("/checkout");
};

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-[#24211e]">
      <Header />

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16 md:px-12 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

          <div className="relative aspect-[4/5] overflow-hidden bg-[#e3ddd4]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="font-serif text-7xl italic tracking-wide text-[#b8aea2] sm:text-8xl">
                  VELORA
                </p>

                <div className="mx-auto mt-5 h-px w-12 bg-[#aaa095]" />

                <p className="mt-5 text-[8px] tracking-[0.4em] text-[#958a7f]">
                  PRODUCT IMAGE
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Add to wishlist"
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center bg-[#f8f6f2]/90 text-xl transition duration-300 hover:scale-110 hover:bg-white"
            >
              ♡
            </button>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-[9px] tracking-[0.35em] text-[#8a8178]">
              VELORA COLLECTION
            </p>

            <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              {product.name}
            </h1>

            <div className="mt-6 h-px w-14 bg-[#8d8277]" />

            <p className="mt-6 text-[10px] tracking-[0.25em] text-[#716b64]">
              {product.fabric} · {product.size} · {product.color}
            </p>

            <p className="mt-7 max-w-xl text-sm leading-7 text-[#655f59]">
              {product.description}
            </p>

            <div className="mt-8 border-y border-[#ddd8d0] py-6">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="text-[8px] tracking-[0.25em] text-[#8a8178]">
                    FABRIC
                  </p>
                  <p className="mt-2 text-sm">{product.fabric}</p>
                </div>

                <div>
                  <p className="text-[8px] tracking-[0.25em] text-[#8a8178]">
                    SIZE
                  </p>
                  <p className="mt-2 text-sm">{product.size}</p>
                </div>

                <div>
                  <p className="text-[8px] tracking-[0.25em] text-[#8a8178]">
                    COLOR
                  </p>
                  <p className="mt-2 text-sm">{product.color}</p>
                </div>

                <div>
                  <p className="text-[8px] tracking-[0.25em] text-[#8a8178]">
                    AVAILABILITY
                  </p>
                  <p className="mt-2 text-sm">
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-[#24211e] px-8 py-4 text-[9px] tracking-[0.3em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#3b3631] disabled:cursor-not-allowed disabled:bg-[#aaa39b]"
              >
                {product.stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
              </button>

              <button
                 type="button"
                 onClick={handleBuyNow}
                 className="flex-1 border border-[#24211e] px-8 py-4 text-[9px] tracking-[0.3em] transition duration-300 hover:-translate-y-0.5 hover:bg-[#24211e] hover:text-white"
              >
                BUY NOW
              </button>
            </div>

            <Link
              href={
                product.category === "bedsheet"
                  ? "/bedsheet"
                  : "/comforter"
              }
              className="mt-7 inline-block text-[9px] tracking-[0.3em] text-[#716b64] transition duration-300 hover:translate-x-1 hover:text-[#24211e]"
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
                <Link
                  href="/"
                  className="block transition duration-300 hover:translate-x-1 hover:text-white"
                >
                  Home
                </Link>

                <Link
                  href="/bedsheet"
                  className="block transition duration-300 hover:translate-x-1 hover:text-white"
                >
                  Bedsheets
                </Link>

                <Link
                  href="/comforter"
                  className="block transition duration-300 hover:translate-x-1 hover:text-white"
                >
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