"use client";

import Link from "next/link";
import Header from "../Components/Header";
import { useCart } from "../Components/CartContext";

export default function CartPage() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-[#24211e]">
      <Header />

      <section className="border-b border-[#ddd8d0] px-6 py-14 md:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] tracking-[0.4em] text-[#8a8178]">
            VELORA
          </p>

          <h1 className="mt-3 font-serif text-5xl">
            Your Cart
          </h1>
        </div>
      </section>

      {cartItems.length === 0 ? (
        <section className="flex min-h-[420px] items-center justify-center px-6 text-center">
          <div>
            <p className="font-serif text-5xl italic text-[#b8aea2]">
              VELORA
            </p>

            <p className="mt-5 text-[9px] tracking-[0.3em] text-[#8a8178]">
              YOUR CART IS EMPTY
            </p>

            <p className="mt-4 text-sm text-[#716b64]">
              Discover our collection and add something beautiful to your cart.
            </p>

            <Link
              href="/bedsheet"
              className="mt-8 inline-block bg-[#24211e] px-8 py-4 text-[9px] tracking-[0.3em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#3b3631]"
            >
              SHOP BEDSHEETS
            </Link>
          </div>
        </section>
      ) : (
        <section className="px-6 py-14 md:px-12">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_360px]">

            <div>
              <div className="mb-6 flex items-center justify-between border-b border-[#ddd8d0] pb-4">
                <p className="text-[10px] tracking-[0.3em] text-[#8a8178]">
                  {cartItems.length} ITEM{cartItems.length > 1 ? "S" : ""}
                </p>

                <Link
                  href="/bedsheet"
                  className="text-[9px] tracking-[0.25em] underline underline-offset-4 transition duration-300 hover:opacity-50"
                >
                  CONTINUE SHOPPING
                </Link>
              </div>

              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="border-b border-[#ddd8d0] pb-6"
                  >
                    <div className="flex gap-5">

                      <Link
                        href={`/product/${item.product.id}`}
                        className="group block h-32 w-28 shrink-0 overflow-hidden bg-[#e3ddd4] sm:h-40 sm:w-36"
                      >
                        <div className="flex h-full items-center justify-center transition duration-500 group-hover:scale-105">
                          <span className="font-serif text-2xl italic text-[#b8aea2]">
                            VELORA
                          </span>
                        </div>
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col justify-between">

                        <div>
                          <p className="text-[9px] tracking-[0.25em] text-[#8a8178]">
                            {item.product.fabric}
                          </p>

                          <Link
                            href={`/product/${item.product.id}`}
                            className="mt-2 block font-serif text-xl transition duration-300 hover:opacity-60 sm:text-2xl"
                          >
                            {item.product.name}
                          </Link>

                          <p className="mt-2 text-[10px] tracking-[0.15em] text-[#716b64]">
                            {item.product.size} · {item.product.color}
                          </p>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

                          <div className="flex items-center border border-[#d5cec5]">
                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(item.product.id)
                              }
                              className="flex h-9 w-9 items-center justify-center text-lg transition duration-300 hover:bg-[#24211e] hover:text-white"
                            >
                              −
                            </button>

                            <span className="flex h-9 w-9 items-center justify-center border-x border-[#d5cec5] text-xs">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(item.product.id)
                              }
                              className="flex h-9 w-9 items-center justify-center text-lg transition duration-300 hover:bg-[#24211e] hover:text-white"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(item.product.id)
                            }
                            className="text-[9px] tracking-[0.2em] text-[#8a8178] transition duration-300 hover:text-[#24211e] hover:underline"
                          >
                            REMOVE
                          </button>

                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="h-fit border border-[#ddd8d0] bg-[#f3f0eb] p-7">
              <p className="text-[10px] tracking-[0.3em] text-[#8a8178]">
                ORDER SUMMARY
              </p>

              <div className="mt-7 space-y-4 border-b border-[#d8d1c8] pb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#716b64]">
                    Subtotal
                  </span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-[#716b64]">
                    Shipping
                  </span>
                  <span>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <span className="text-[10px] tracking-[0.2em]">
                  TOTAL
                </span>

                <span className="font-serif text-2xl">
                  ₹{total}
                </span>
              </div>

              <Link
                 href="/checkout"
                 className="mt-7 block w-full bg-[#24211e] px-6 py-4 text-center text-[9px] tracking-[0.3em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#3b3631]"
               >
                  PROCEED TO CHECKOUT
                  </Link>

              <p className="mt-4 text-center text-[9px] leading-5 text-[#8a8178]">
                Checkout will be enabled once product pricing and payment
                setup are added.
              </p>
            </aside>

          </div>
        </section>
      )}
    </main>
  );
}