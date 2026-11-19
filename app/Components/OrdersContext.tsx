"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Product } from "../data/products";
import { supabase } from "../lib/supabase";

type OrderItem = {
  product: Product;
  quantity: number;
};

type CustomerDetails = {
  firstName: string;
  lastName: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  email: string;
};

export type Order = {
  id: string;
  items: OrderItem[];
  customer: CustomerDetails;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: string;
};

type OrdersContextType = {
  orders: Order[];
  createOrder: (
    items: OrderItem[],
    customer: CustomerDetails,
    subtotal: number,
    shipping: number,
    total: number
  ) => Promise<string>;
};

const OrdersContext = createContext<OrdersContextType | undefined>(
  undefined
);

export function OrdersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem("velora-orders");

      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch (error) {
      console.error("Local orders loading error:", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("velora-orders", JSON.stringify(orders));
  }, [orders]);

  const createOrder = async (
    items: OrderItem[],
    customer: CustomerDetails,
    subtotal: number,
    shipping: number,
    total: number
  ): Promise<string> => {
    const orderId = `VELORA-${Date.now()}`;

    const { error } = await supabase
      .from("orders")
      .insert({
        order_reference: orderId,
        customer_name: `${customer.firstName} ${customer.lastName}`,
        mobile: customer.mobile,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        pin: customer.pin,
        email: customer.email,
        total,
        status: "Pending",
        items,
      });

    if (error) {
      console.error(
        "Order save error:",
        JSON.stringify(error, null, 2)
      );
      throw new Error("Order could not be saved.");
    }

    const newOrder: Order = {
      id: orderId,
      items,
      customer,
      subtotal,
      shipping,
      total,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    setOrders((currentOrders) => [
      newOrder,
      ...currentOrders,
    ]);

    return orderId;
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        createOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error(
      "useOrders must be used inside OrdersProvider"
    );
  }

  return context;
}