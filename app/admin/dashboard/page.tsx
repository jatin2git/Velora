
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Order = {
  id: number;
  order_reference: string | null;
  customer_name: string;
  mobile: string;
  total: number;
  status: string;
  created_at: string;
};

export default function SalesDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        router.replace("/admin/login");
        return;
      }

      const user = sessionData.session.user;

      const { data: admin, error: adminError } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (adminError || !admin) {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      const { data, error: ordersError } = await supabase
        .from("orders")
        .select(
          "id, order_reference, customer_name, mobile, total, status, created_at"
        )
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      setOrders((data ?? []) as Order[]);
    } catch {
      setError("Dashboard data load nahi ho saka. Refresh karke dobara try karein.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  
const normalizeStatus = (status: unknown) =>
  String(status ?? "").trim().toLowerCase();

const isCancelled = (status: unknown) =>
  normalizeStatus(status) === "cancelled";

const isDelivered = (status: unknown) =>
  normalizeStatus(status) === "delivered";


  const totalSales = orders
    .filter((order) => !isCancelled(order.status))
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  const pendingOrders = orders.filter(
    (order) => normalizeStatus(order.status) === "pending"
  ).length;

  const deliveredOrders = orders.filter(isDelivered).length;

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const statusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  const cards = [
    {
      title: "TOTAL SALES",
      value: formatMoney(totalSales),
      detail: "Excluding cancelled orders",
    },
    {
      title: "TOTAL ORDERS",
      value: orders.length.toLocaleString("en-IN"),
      detail: "All recorded orders",
    },
    {
      title: "PENDING ORDERS",
      value: pendingOrders.toLocaleString("en-IN"),
      detail: "Awaiting processing",
    },
    {
      title: "DELIVERED ORDERS",
      value: deliveredOrders.toLocaleString("en-IN"),
      detail: "Successfully delivered",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f8f6f2] px-4 py-6 text-[#24211e] sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#dedbd5] pb-6">
          <div>
            <p className="text-xs tracking-[0.3em] text-[#8a8178]">
              VELORA ADMIN
            </p>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl">
              Sales Dashboard
            </h1>
            <p className="mt-2 text-sm text-[#716b64]">
              Your store performance at a glance.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push("/admin/orders")}
              className="border border-[#24211e] px-4 py-3 text-xs tracking-wider transition hover:bg-[#24211e] hover:text-white"
            >
              VIEW ORDERS
            </button>
            <button
              onClick={loadDashboard}
              disabled={loading}
              className="bg-[#24211e] px-4 py-3 text-xs tracking-wider text-white transition hover:bg-[#49423b] disabled:opacity-50"
            >
              {loading ? "LOADING..." : "REFRESH"}
            </button>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.replace("/admin/login");
              }}
              className="border border-[#dedbd5] px-4 py-3 text-xs transition hover:border-[#24211e]"
            >
              LOG OUT
            </button>
          </div>
        </header>

        {error && (
          <div className="mt-6 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="border border-[#dedbd5] bg-white p-6 transition hover:border-[#a79b8e]"
            >
              <p className="text-xs tracking-[0.18em] text-[#817a72]">
                {card.title}
              </p>
              <p className="mt-5 break-words font-serif text-3xl sm:text-4xl">
                {loading ? "—" : card.value}
              </p>
              <p className="mt-3 text-xs text-[#817a72]">{card.detail}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 border border-[#dedbd5] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dedbd5] px-5 py-5 sm:px-7">
            <div>
              <h2 className="font-serif text-2xl">Recent Orders</h2>
              <p className="mt-1 text-sm text-[#817a72]">
                Latest orders received by your store.
              </p>
            </div>
            <button
              onClick={() => router.push("/admin/orders")}
              className="border-b border-[#24211e] pb-1 text-xs tracking-wider transition hover:opacity-60"
            >
              MANAGE ALL ORDERS →
            </button>
          </div>

          {loading ? (
            <p className="p-7 text-sm text-[#716b64]">
              Loading orders...
            </p>
          ) : orders.length === 0 ? (
            <p className="p-7 text-sm text-[#716b64]">
              Abhi koi order available nahi hai.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-[#f8f6f2] text-xs tracking-wider text-[#716b64]">
                  <tr>
                    <th className="px-5 py-4 font-medium">ORDER</th>
                    <th className="px-5 py-4 font-medium">CUSTOMER</th>
                    <th className="px-5 py-4 font-medium">DATE</th>
                    <th className="px-5 py-4 font-medium">AMOUNT</th>
                    <th className="px-5 py-4 font-medium">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order) => (
                    <tr
                      key={order.id}
                      className="border-t border-[#eeeae4] transition hover:bg-[#fcfaf7]"
                    >
                      <td className="px-5 py-4 font-medium">
                        {order.order_reference || `#${order.id}`}
                      </td>
                      <td className="px-5 py-4">
                        <p>{order.customer_name}</p>
                        <p className="mt-1 text-xs text-[#817a72]">
                          {order.mobile}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-[#716b64]">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-5 py-4 font-medium">
                        {formatMoney(Number(order.total || 0))}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs ${statusStyle(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="mt-5 text-xs text-[#817a72]">
          Sales total excludes cancelled orders. Figures reflect the orders
          your account is permitted to read.
        </p>
      </div>
    </main>
  );
}
