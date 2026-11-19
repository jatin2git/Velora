
import Link from "next/link";

type OrderSuccessPageProps = {
  searchParams: Promise<{
    orderId?: string;
  }>;
};

export default async function OrderSuccessPage({
  searchParams,
}: OrderSuccessPageProps) {
  const { orderId } = await searchParams;

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-[#24211e]">
      <section className="flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl text-center">

          <p className="text-[10px] tracking-[0.4em] text-[#8a8178]">
            VELORA
          </p>

          <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full border border-[#bdb4aa]">
            <span className="text-2xl">✓</span>
          </div>

          <h1 className="mt-8 font-serif text-5xl">
            Order Confirmed
          </h1>

          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#716b64]">
            Thank you for choosing VELORA. Your order details have been
            successfully received.
          </p>

          {orderId && (
            <div className="mx-auto mt-8 max-w-sm border-y border-[#ddd8d0] py-6">
              <p className="text-[9px] tracking-[0.3em] text-[#8a8178]">
                ORDER ID
              </p>

              <p className="mt-3 font-serif text-xl tracking-[0.08em]">
                {orderId}
              </p>
            </div>
          )}

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="bg-[#24211e] px-8 py-4 text-[9px] tracking-[0.3em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#3b3631]"
            >
              CONTINUE SHOPPING
            </Link>

            <Link
              href="/bedsheet"
              className="border border-[#24211e] px-8 py-4 text-[9px] tracking-[0.3em] transition duration-300 hover:-translate-y-0.5 hover:bg-[#24211e] hover:text-white"
            >
              VIEW COLLECTION
            </Link>
          </div>

          <p className="mt-10 text-[9px] leading-5 text-[#8a8178]">
            Payment integration will be added before the store goes live.
          </p>

        </div>
      </section>
    </main>
  );
}
