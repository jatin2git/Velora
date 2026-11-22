
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../Components/CartContext";
import { useOrders, PaymentMethod } from "../Components/OrdersContext";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { createOrder } = useOrders();
  const router = useRouter();

  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pin: "",
    email: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("Prepaid");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    if (loading) return;

    if (
      !customer.firstName.trim() ||
      !customer.lastName.trim() ||
      !customer.mobile.trim() ||
      !customer.address.trim() ||
      !customer.city.trim() ||
      !customer.state.trim() ||
      !customer.pin.trim() ||
      !customer.email.trim()
    ) {
      setError("Please fill all delivery details.");
      return;
    }

    if (!/^[0-9]{10}$/.test(customer.mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^[0-9]{6}$/.test(customer.pin)) {
      setError("Please enter a valid 6-digit PIN code.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const orderId = await createOrder(
        cartItems,
        customer,
        subtotal,
        shipping,
        total,
        paymentMethod
      );

      clearCart();
      router.push(`/order-success?orderId=${orderId}`);
    } catch (err) {
      console.error("Order placement error:", err);
      setError("Order could not be placed. Please try again.");
      setLoading(false);
    }
  };

  const updateCustomer = (field: keyof typeof customer, value: string) => {
    setCustomer((current) => ({ ...current, [field]: value }));
  };

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-[#24211e]">
      <div className="border-b border-[#ddd8d0] px-6 py-6 md:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="font-serif text-2xl tracking-[0.2em] transition duration-300 hover:opacity-60"
          >
            VELORA
          </Link>

          <Link
            href="/cart"
            className="text-[9px] tracking-[0.25em] transition duration-300 hover:opacity-50"
          >
            BACK TO CART
          </Link>
        </div>
      </div>

      <section className="px-6 py-12 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="text-[10px] tracking-[0.4em] text-[#8a8178]">
              VELORA
            </p>
            <h1 className="mt-3 font-serif text-5xl">Checkout</h1>
          </div>

          {cartItems.length === 0 ? (
            <div className="border-y border-[#ddd8d0] py-20 text-center">
              <p className="font-serif text-4xl italic text-[#b8aea2]">
                YOUR CART IS EMPTY
              </p>
              <Link
                href="/bedsheet"
                className="mt-8 inline-block bg-[#24211e] px-8 py-4 text-[9px] tracking-[0.3em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#3b3631]"
              >
                SHOP COLLECTION
              </Link>
            </div>
          ) : (
            <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
              <div>
                <div className="mb-8">
                  <p className="text-[10px] tracking-[0.3em] text-[#8a8178]">
                    DELIVERY DETAILS
                  </p>
                  <h2 className="mt-3 font-serif text-3xl">
                    Where should we deliver?
                  </h2>
                </div>

                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={customer.firstName}
                      onChange={(e) => updateCustomer("firstName", e.target.value)}
                      className="border border-[#d8d1c8] bg-transparent px-5 py-4 text-sm outline-none transition focus:border-[#24211e]"
                    />

                    <input
                      type="text"
                      placeholder="Last Name"
                      value={customer.lastName}
                      onChange={(e) => updateCustomer("lastName", e.target.value)}
                      className="border border-[#d8d1c8] bg-transparent px-5 py-4 text-sm outline-none transition focus:border-[#24211e]"
                    />
                  </div>

                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={customer.mobile}
                    onChange={(e) => updateCustomer("mobile", e.target.value)}
                    className="w-full border border-[#d8d1c8] bg-transparent px-5 py-4 text-sm outline-none transition focus:border-[#24211e]"
                  />

                  <input
                    type="text"
                    placeholder="Address"
                    value={customer.address}
                    onChange={(e) => updateCustomer("address", e.target.value)}
                    className="w-full border border-[#d8d1c8] bg-transparent px-5 py-4 text-sm outline-none transition focus:border-[#24211e]"
                  />

                  <div className="grid gap-5 sm:grid-cols-3">
                    <input
                      type="text"
                      placeholder="City"
                      value={customer.city}
                      onChange={(e) => updateCustomer("city", e.target.value)}
                      className="border border-[#d8d1c8] bg-transparent px-5 py-4 text-sm outline-none transition focus:border-[#24211e]"
                    />

                    <input
                      type="text"
                      placeholder="State"
                      value={customer.state}
                      onChange={(e) => updateCustomer("state", e.target.value)}
                      className="border border-[#d8d1c8] bg-transparent px-5 py-4 text-sm outline-none transition focus:border-[#24211e]"
                    />

                    <input
                      type="text"
                      placeholder="PIN Code"
                      value={customer.pin}
                      onChange={(e) => updateCustomer("pin", e.target.value)}
                      className="border border-[#d8d1c8] bg-transparent px-5 py-4 text-sm outline-none transition focus:border-[#24211e]"
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="Email Address"
                    value={customer.email}
                    onChange={(e) => updateCustomer("email", e.target.value)}
                    className="w-full border border-[#d8d1c8] bg-transparent px-5 py-4 text-sm outline-none transition focus:border-[#24211e]"
                  />
                </div>

                <div className="mb-8 mt-14">
                  <p className="text-[10px] tracking-[0.3em] text-[#8a8178]">
                    PAYMENT
                  </p>
                  <h2 className="mt-3 font-serif text-3xl">
                    Choose payment method
                  </h2>
                  <p className="mt-2 text-xs text-[#8a8178]">
                    Select your preferred payment option.
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("Prepaid");
                      setError("");
                    }}
                    className={`w-full border p-5 text-left transition duration-300 hover:border-[#24211e] ${
                      paymentMethod === "Prepaid"
                        ? "border-[#24211e] bg-[#f0ece5]"
                        : "border-[#ddd8d0]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">
                          Online Payment (Prepaid)
                        </p>
                        <p className="mt-2 text-xs text-[#716b64]">
                          UPI · Google Pay · PhonePe · Paytm
                        </p>
                        <p className="mt-1 text-xs text-[#716b64]">
                          Credit / Debit Card · Net Banking
                        </p>
                        <p className="mt-3 text-[9px] tracking-[0.15em] text-[#8a8178]">
                          PAYMENT GATEWAY COMING SOON
                        </p>
                      </div>
                      <span className="text-lg">
                        {paymentMethod === "Prepaid" ? "◉" : "○"}
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("COD");
                      setError("");
                    }}
                    className={`w-full border p-5 text-left transition duration-300 hover:border-[#24211e] ${
                      paymentMethod === "COD"
                        ? "border-[#24211e] bg-[#f0ece5]"
                        : "border-[#ddd8d0]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">
                          Cash on Delivery
                        </p>
                        <p className="mt-2 text-xs text-[#716b64]">
                          Pay when your order arrives
                        </p>
                      </div>
                      <span className="text-lg">
                        {paymentMethod === "COD" ? "◉" : "○"}
                      </span>
                    </div>
                  </button>
                </div>

                <div className="mt-5 border border-[#ddd8d0] bg-[#f3f0eb] p-4">
                  <p className="text-xs leading-6 text-[#716b64]">
                    {paymentMethod === "Prepaid"
                      ? "Prepaid orders can be placed for testing, but no money will be collected until the payment gateway is activated. Payment will remain pending."
                      : "Cash on Delivery is selected. Pay for your order when it is delivered."}
                  </p>
                </div>
              </div>

              <aside className="h-fit border border-[#ddd8d0] bg-[#f3f0eb] p-7">
                <p className="text-[10px] tracking-[0.3em] text-[#8a8178]">
                  ORDER SUMMARY
                </p>

                <div className="mt-7 space-y-5 border-b border-[#d8d1c8] pb-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between gap-5"
                    >
                      <div>
                        <p className="font-serif text-lg">
                          {item.product.name}
                        </p>
                        <p className="mt-1 text-[9px] tracking-[0.15em] text-[#8a8178]">
                          QTY: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm">
                        ₹{item.product.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#716b64]">Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#716b64]">Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-between border-t border-[#d8d1c8] pt-6">
                  <span className="text-[10px] tracking-[0.2em]">TOTAL</span>
                  <span className="font-serif text-2xl">₹{total}</span>
                </div>

                {error && (
                  <p className="mt-6 border border-[#c9b8ad] bg-[#eee5df] px-4 py-3 text-center text-[10px] leading-5 text-[#6d5145]">
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="mt-7 w-full bg-[#24211e] px-6 py-4 text-[9px] tracking-[0.3em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#3b3631] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "PLACING ORDER..." : "PLACE ORDER"}
                </button>

                <p className="mt-4 text-center text-[9px] leading-5 text-[#8a8178]">
                  Secure order placement · VELORA
                </p>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
