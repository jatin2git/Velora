
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

  const originalTotal = cartItems.reduce(
    (total, item) => {
      const mrp = Number(item.product.mrp || 0);
      const price = Number(item.product.price || 0);
      const originalPrice = mrp > price ? mrp : price;

      return total + originalPrice * item.quantity;
    },
    0
  );

  const totalSavings = originalTotal - subtotal;
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-[#f5f3ed] text-[#292820]">
      <Header />

      <section className="border-b border-[#e2dcd1] px-5 py-12 sm:px-8 md:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] tracking-[0.4em] text-[#a17a43]">
            VELORA
          </p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
            Your Cart
          </h1>
          <p className="mt-3 text-sm text-[#81786d]">
            Your selected pieces of everyday comfort.
          </p>
        </div>
      </section>

      {cartItems.length === 0 ? (
        <section className="flex min-h-[420px] items-center justify-center px-6 text-center">
          <div>
            <p className="font-serif text-5xl italic text-[#b8aea2]">
              VELORA
            </p>
            <p className="mt-5 text-[10px] tracking-[0.3em] text-[#a17a43]">
              YOUR CART IS EMPTY
            </p>
            <p className="mt-4 text-sm text-[#716b64]">
              Discover our collection and add something beautiful to your cart.
            </p>
            <Link
              href="/bedsheet"
              className="mt-8 inline-block bg-[#292820] px-8 py-4 text-xs tracking-[0.15em] text-white transition duration-300 hover:bg-[#a17a43]"
            >
              Shop Bedsheets
            </Link>
          </div>
        </section>
      ) : (
        <section className="px-5 py-10 sm:px-8 md:px-12 md:py-14">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
            <div>
              <div className="mb-6 flex items-center justify-between border-b border-[#ded8cc] pb-4">
                <p className="text-[10px] tracking-[0.2em] text-[#81786d]">
                  {cartItems.length} ITEM{cartItems.length > 1 ? "S" : ""}
                </p>

                <Link
                  href="/bedsheet"
                  className="text-[10px] tracking-[0.12em] underline underline-offset-4 transition hover:text-[#a17a43]"
                >
                  Continue Shopping
                </Link>
              </div>

              <div className="space-y-6">
                {cartItems.map((item) => {
                  const product = item.product;
                  const productImage =
                    product.images?.[0] || product.image;

                  const price = Number(product.price || 0);
                  const mrp = Number(product.mrp || 0);
                  const hasDiscount = mrp > price && mrp > 0;

                  const discount = hasDiscount
                    ? Math.round(((mrp - price) / mrp) * 100)
                    : 0;

                  const savings = hasDiscount ? mrp - price : 0;
                  const itemTotal = price * item.quantity;

                  return (
                    <div
                      key={product.id}
                      className="border-b border-[#ded8cc] pb-6"
                    >
                      <div className="flex gap-4 sm:gap-6">
                        <Link
                          href={`/product/${product.id}`}
                          className="group relative block h-32 w-28 shrink-0 overflow-hidden bg-[#ebe7df] sm:h-40 sm:w-36"
                        >
                          {productImage ? (
                            <img
                              src={productImage}
                              alt={product.name}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <span className="font-serif text-2xl text-[#b8aea2]">
                                VELORA
                              </span>
                            </div>
                          )}

                          {hasDiscount && (
                            <span className="absolute left-1.5 top-1.5 bg-[#b88d50] px-2 py-1 text-[8px] text-white">
                              {discount}% OFF
                            </span>
                          )}
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div>
                            <p className="text-[9px] tracking-[0.2em] text-[#a17a43]">
                              {product.fabric}
                            </p>

                            <Link
                              href={`/product/${product.id}`}
                              className="mt-1 block font-serif text-lg leading-snug transition hover:text-[#a17a43] sm:text-2xl"
                            >
                              {product.name}
                            </Link>

                            <p className="mt-2 text-[10px] text-[#81786d]">
                              {product.size} · {product.color}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <span className="text-lg font-semibold text-[#303a32]">
                                ₹{price.toLocaleString("en-IN")}
                              </span>

                              {hasDiscount && (
                                <>
                                  <span className="text-xs text-[#999187] line-through">
                                    ₹{mrp.toLocaleString("en-IN")}
                                  </span>

                                  <span className="bg-[#eee8dc] px-2 py-1 text-[9px] font-medium text-[#98713c]">
                                    {discount}% OFF
                                  </span>
                                </>
                              )}
                            </div>

                            {hasDiscount && (
                              <p className="mt-1 text-[10px] text-[#58734d]">
                                You save ₹{savings.toLocaleString("en-IN")} per item
                              </p>
                            )}

                            <p className="mt-2 text-xs text-[#716b64]">
                              Item total: ₹{itemTotal.toLocaleString("en-IN")}
                            </p>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center border border-[#d5cec5]">
                              <button
                                type="button"
                                onClick={() => decreaseQuantity(product.id)}
                                className="flex h-8 w-9 items-center justify-center transition hover:bg-[#292820] hover:text-white"
                              >
                                −
                              </button>

                              <span className="flex h-8 w-9 items-center justify-center border-x border-[#d5cec5] text-xs">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() => increaseQuantity(product.id)}
                                className="flex h-8 w-9 items-center justify-center transition hover:bg-[#292820] hover:text-white"
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFromCart(product.id)}
                              className="text-[10px] text-[#81786d] underline underline-offset-4 transition hover:text-[#a34d42]"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ORDER SUMMARY */}

            <aside className="h-fit border border-[#e0d9ce] bg-[#eeece4] p-6 sm:p-7">
              <p className="text-[10px] tracking-[0.25em] text-[#a17a43]">
                VELORA
              </p>

              <h2 className="mt-2 font-serif text-2xl">
                Order Summary
              </h2>

              <div className="mt-7 space-y-4 border-b border-[#d8d1c8] pb-6">
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-[#716b64]">Original Price</span>
                  <span>
                    ₹{originalTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-[#716b64]">Discount Savings</span>
                  <span className="text-[#58734d]">
                    - ₹{totalSavings.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-[#716b64]">Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-[#716b64]">Shipping</span>
                  <span>
                    {shipping === 0
                      ? "FREE"
                      : `₹${shipping.toLocaleString("en-IN")}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-6">
                <span className="text-xs font-medium tracking-[0.15em]">
                  TOTAL
                </span>

                <span className="font-serif text-2xl">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              {totalSavings > 0 && (
                <p className="mt-4 bg-[#e4e7dc] px-3 py-3 text-center text-xs text-[#58734d]">
                  You are saving ₹{totalSavings.toLocaleString("en-IN")} on this order
                </p>
              )}

              <Link
                href="/checkout"
                className="mt-7 block w-full bg-[#292820] px-5 py-4 text-center text-xs tracking-[0.15em] text-white transition duration-300 hover:bg-[#a17a43]"
              >
                Proceed to Checkout
              </Link>

              <p className="mt-4 text-center text-[10px] leading-5 text-[#81786d]">
                Shipping is free on orders above ₹999.
              </p>
            </aside>
          </div>
        </section>
      )}
    </main>
  );
}
