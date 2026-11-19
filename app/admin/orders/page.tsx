
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type OrderItem = {
  product?: {
    id?: string | number;
    name?: string;
    price?: number;
  };
  id?: string | number;
  name?: string;
  title?: string;
  price?: number;
  quantity?: number;
  qty?: number;
};

type Order = {
  id: number | string;
  order_reference?: string | null;
  customer_name: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  email: string;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[] | null;
};

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function AdminOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const loadOrders = useCallback(async (manualRefresh = false) => {
    if (manualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");
    setStatusMessage("");
    setAccessDenied(false);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      const { data: admin, error: adminError } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (adminError) throw adminError;

      if (!admin || !["owner", "staff"].includes(admin.role)) {
        setOrders([]);
        setAccessDenied(true);
        return;
      }

      const { data, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      setOrders((data ?? []) as Order[]);
    } catch (err) {
      console.error("Admin orders error:", err);
      setError(
        "Orders load nahi ho paaye. Database connection aur RLS permissions check karein."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (
    order: Order,
    newStatus: string
  ) => {
    if (!ORDER_STATUSES.includes(newStatus)) return;
    if (newStatus === order.status) return;

    setUpdatingOrderId(String(order.id));
    setStatusMessage("");

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      const { data, error: updateError } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", order.id)
        .select("id")
        .maybeSingle();

      if (updateError) throw updateError;

      if (!data) {
        throw new Error(
          "Order update nahi hua. Supabase UPDATE policy check karein."
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          currentOrder.id === order.id
            ? { ...currentOrder, status: newStatus }
            : currentOrder
        )
      );

      setStatusMessage(
        `Order ${order.order_reference || order.id} ka status ${newStatus} ho gaya.`
      );
    } catch (err) {
      console.error("Order status update error:", err);
      setStatusMessage(
        "Status save nahi hua. Supabase mein admin UPDATE permission check karein."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleLogout = async () => {
    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      setError("Logout nahi ho paaya. Dobara try karein.");
      return;
    }

    router.replace("/admin/login");
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "All" ||
      (order.status || "Pending") === filterStatus;

    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      !query ||
      String(order.id).toLowerCase().includes(query) ||
      (order.order_reference || "").toLowerCase().includes(query) ||
      (order.customer_name || "").toLowerCase().includes(query) ||
      (order.mobile || "").toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-[#24211e]">
      <header className="border-b border-[#ddd8d0] px-5 py-6 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-[10px] tracking-[0.4em] text-[#8a8178]">
              VELORA ADMINISTRATION
            </p>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl">
              Orders
            </h1>
            <p className="mt-2 text-sm text-[#716b64]">
              Manage your customer orders.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => void loadOrders(true)}
              disabled={loading || refreshing}
              className="border border-[#24211e] px-5 py-3 text-[10px] tracking-[0.2em] transition hover:bg-[#e9e4dc] disabled:opacity-50"
            >
              {refreshing ? "REFRESHING..." : "REFRESH ORDERS"}
            </button>

            <button
              onClick={handleLogout}
              className="bg-[#24211e] px-5 py-3 text-[10px] tracking-[0.2em] text-white transition hover:bg-[#51483f]"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </header>

      <section className="px-5 py-10 md:px-12 md:py-12">
        <div className="mx-auto max-w-7xl">
          {statusMessage && (
            <div className="mb-6 border border-[#ddd8d0] bg-white p-4 text-sm">
              {statusMessage}
            </div>
          )}

          {!loading && !error && !accessDenied && (
            <>
              <div className="mb-8 grid gap-4 sm:grid-cols-2">
                <div className="border border-[#ddd8d0] bg-white p-6">
                  <p className="text-[10px] tracking-[0.25em] text-[#8a8178]">
                    TOTAL ORDERS
                  </p>
                  <p className="mt-2 font-serif text-4xl">
                    {orders.length}
                  </p>
                </div>

                <div className="border border-[#ddd8d0] bg-white p-6">
                  <p className="text-[10px] tracking-[0.25em] text-[#8a8178]">
                    MATCHING ORDERS
                  </p>
                  <p className="mt-2 font-serif text-4xl">
                    {filteredOrders.length}
                  </p>
                </div>
              </div>

              <div className="mb-5 border border-[#ddd8d0] bg-white p-5">
                <label
                  htmlFor="order-search"
                  className="mb-3 block text-xs tracking-[0.15em] text-[#716b64]"
                >
                  SEARCH ORDERS
                </label>

                <input
                  id="order-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Order ID, customer name or mobile number..."
                  className="w-full border border-[#cfc7bc] bg-white px-4 py-3 text-sm outline-none focus:border-[#24211e]"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="mt-3 border border-[#24211e] px-4 py-2 text-xs transition hover:bg-[#e9e4dc]"
                  >
                    CLEAR SEARCH
                  </button>
                )}
              </div>

              <div className="mb-8 flex flex-col gap-4 border border-[#ddd8d0] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-serif text-2xl">
                    Filter Orders
                  </h2>
                  <p className="mt-1 text-sm text-[#716b64]">
                    Orders ko unke current status ke hisaab se dekho.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label
                    htmlFor="order-status-filter"
                    className="text-xs tracking-[0.1em] text-[#716b64]"
                  >
                    STATUS
                  </label>

                  <select
                    id="order-status-filter"
                    value={filterStatus}
                    onChange={(event) => setFilterStatus(event.target.value)}
                    className="min-w-44 border border-[#cfc7bc] bg-white px-4 py-3 text-sm outline-none focus:border-[#24211e]"
                  >
                    <option value="All">All Orders</option>
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      setFilterStatus("All");
                      setSearchQuery("");
                    }}
                    className="border border-[#24211e] px-4 py-3 text-xs transition hover:bg-[#e9e4dc]"
                  >
                    CLEAR ALL
                  </button>
                </div>
              </div>

              <p className="mb-5 text-sm text-[#716b64]">
                Showing {filteredOrders.length} of {orders.length} orders
                {filterStatus !== "All" ? ` — ${filterStatus}` : ""}
                {searchQuery.trim() ? ` — Search: "${searchQuery.trim()}"` : ""}.
              </p>
            </>
          )}

          {loading && (
            <div className="py-20 text-center">
              <p className="font-serif text-2xl">Loading orders...</p>
              <p className="mt-3 text-sm text-[#716b64]">
                Connecting to your database.
              </p>
            </div>
          )}

          {accessDenied && (
            <div className="border border-[#ddd8d0] bg-white px-6 py-16 text-center">
              <h2 className="font-serif text-3xl">Access Restricted</h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#716b64]">
                This account does not have an authorized VELORA admin role.
              </p>
              <button
                onClick={handleLogout}
                className="mt-7 bg-[#24211e] px-6 py-3 text-xs tracking-[0.2em] text-white hover:bg-[#51483f]"
              >
                LOGOUT
              </button>
            </div>
          )}

          {error && (
            <div className="border border-red-200 bg-white p-6">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => void loadOrders(true)}
                className="mt-5 border border-[#24211e] px-5 py-3 text-xs tracking-[0.15em] hover:bg-[#f3f0eb]"
              >
                TRY AGAIN
              </button>
            </div>
          )}

          {!loading && !error && !accessDenied && orders.length === 0 && (
            <div className="border-y border-[#ddd8d0] py-20 text-center">
              <p className="font-serif text-3xl italic text-[#b8aea2]">
                NO ORDERS YET
              </p>
              <p className="mt-4 text-sm text-[#716b64]">
                Customer orders will appear here once available.
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            !accessDenied &&
            orders.length > 0 &&
            filteredOrders.length === 0 && (
              <div className="border-y border-[#ddd8d0] py-16 text-center">
                <p className="font-serif text-3xl">
                  No Matching Orders
                </p>
                <p className="mt-3 text-sm text-[#716b64]">
                  Search ya status filter ke hisaab se koi order nahi mila.
                </p>
                <button
                  onClick={() => {
                    setFilterStatus("All");
                    setSearchQuery("");
                  }}
                  className="mt-6 bg-[#24211e] px-6 py-3 text-xs tracking-[0.15em] text-white transition hover:bg-[#51483f]"
                >
                  CLEAR SEARCH AND FILTER
                </button>
              </div>
            )}

          {!loading &&
            !error &&
            !accessDenied &&
            filteredOrders.length > 0 && (
              <div className="space-y-8">
                {filteredOrders.map((order) => {
                  const items = Array.isArray(order.items) ? order.items : [];
                  const isUpdating = updatingOrderId === String(order.id);

                  return (
                    <article
                      key={order.id}
                      className="border border-[#ddd8d0] bg-white"
                    >
                      <div className="flex flex-col gap-4 border-b border-[#ddd8d0] bg-[#f3f0eb] p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-[9px] tracking-[0.3em] text-[#8a8178]">
                            ORDER ID
                          </p>
                          <p className="mt-2 font-serif text-xl">
                            {order.order_reference || order.id}
                          </p>
                          <p className="mt-2 text-xs text-[#716b64]">
                            Database ID: {order.id}
                          </p>
                        </div>

                        <div className="sm:text-right">
                          <label
                            htmlFor={`status-${order.id}`}
                            className="text-[9px] tracking-[0.25em] text-[#8a8178]"
                          >
                            ORDER STATUS
                          </label>

                          <div className="mt-2">
                            <select
                              id={`status-${order.id}`}
                              value={
                                ORDER_STATUSES.includes(order.status)
                                  ? order.status
                                  : "Pending"
                              }
                              disabled={isUpdating}
                              onChange={(event) =>
                                void handleStatusChange(order, event.target.value)
                              }
                              className="min-w-40 border border-[#cfc7bc] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#24211e] disabled:opacity-50"
                            >
                              {!ORDER_STATUSES.includes(order.status) && (
                                <option value="Pending">Pending</option>
                              )}

                              {ORDER_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </div>

                          {isUpdating && (
                            <p className="mt-2 text-xs text-[#716b64]">
                              Saving status...
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-8 p-6 lg:grid-cols-2">
                        <div>
                          <h2 className="text-[10px] tracking-[0.3em] text-[#8a8178]">
                            CUSTOMER DETAILS
                          </h2>

                          <div className="mt-5 space-y-3 break-words text-sm">
                            <p><span className="text-[#8a8178]">Name: </span>{order.customer_name}</p>
                            <p><span className="text-[#8a8178]">Mobile: </span>{order.mobile}</p>
                            <p><span className="text-[#8a8178]">Email: </span>{order.email}</p>
                            <p><span className="text-[#8a8178]">Address: </span>{order.address}</p>
                            <p><span className="text-[#8a8178]">City: </span>{order.city}</p>
                            <p><span className="text-[#8a8178]">State: </span>{order.state}</p>
                            <p><span className="text-[#8a8178]">PIN: </span>{order.pin}</p>
                          </div>
                        </div>

                        <div>
                          <h2 className="text-[10px] tracking-[0.3em] text-[#8a8178]">
                            ORDER ITEMS
                          </h2>

                          {items.length === 0 ? (
                            <p className="mt-5 text-sm text-[#716b64]">
                              No item details available for this order.
                            </p>
                          ) : (
                            <div className="mt-5 space-y-4">
                              {items.map((item, index) => {
                                const name =
                                  item.product?.name ||
                                  item.name ||
                                  item.title ||
                                  "Product";

                                const price = Number(
                                  item.product?.price ?? item.price ?? 0
                                );

                                const quantity = Number(
                                  item.quantity ?? item.qty ?? 1
                                );

                                return (
                                  <div
                                    key={
                                      item.product?.id ??
                                      item.id ??
                                      `${order.id}-${index}`
                                    }
                                    className="flex justify-between gap-5 border-b border-[#ddd8d0] pb-4"
                                  >
                                    <div>
                                      <p className="font-serif text-lg">{name}</p>
                                      <p className="mt-1 text-[10px] tracking-[0.15em] text-[#8a8178]">
                                        QTY: {quantity}
                                      </p>
                                    </div>

                                    <p className="shrink-0 text-sm">
                                      ₹{(price * quantity).toLocaleString("en-IN")}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          <div className="mt-6 flex justify-between border-t border-[#ddd8d0] pt-5">
                            <span className="text-[10px] tracking-[0.2em]">
                              ORDER TOTAL
                            </span>
                            <span className="font-serif text-2xl">
                              ₹{Number(order.total).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-[#ddd8d0] px-6 py-4">
                        <p className="text-[9px] tracking-[0.15em] text-[#8a8178]">
                          ORDER DATE:{" "}
                          {order.created_at
                            ? new Date(order.created_at).toLocaleString("en-IN")
                            : "Not available"}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
        </div>
      </section>
    </main>
  );
}
