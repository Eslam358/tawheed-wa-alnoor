"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { data: session, status } = useSession();
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const hasMergedRef = useRef(false);

  // تحميل أولي: من localStorage (للزائر أو كنسخة احتياطية سريعة)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("tawheed-cart");
      if (stored) setItems(JSON.parse(stored));
    } catch (e) {
      console.error(e);
    }
    setLoaded(true);
  }, []);

  // لما يسجّل المستخدم الدخول: هات سلته المحفوظة وادمجها مع أي حاجة في localStorage
  useEffect(() => {
    if (status !== "authenticated" || hasMergedRef.current || !loaded) return;
    hasMergedRef.current = true;

    fetch("/api/cart")
      .then((r) => r.json())
      .then((data) => {
        const dbItems = data.items || [];
        setItems((localItems) => {
          const merged = [...dbItems];
          for (const localItem of localItems) {
            const existing = merged.find((i) => i.productId === localItem.productId);
            if (existing) {
              existing.quantity += localItem.quantity;
            } else {
              merged.push(localItem);
            }
          }
          return merged;
        });
      })
      .catch((e) => console.error("تعذر تحميل السلة المحفوظة:", e));
  }, [status, loaded]);

  // احفظ في localStorage دايماً (كنسخة سريعة/للزوار)
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("tawheed-cart", JSON.stringify(items));
    }
  }, [items, loaded]);

  // لو مسجّل دخول، احفظ في قاعدة البيانات كل ما تتغيّر السلة
  useEffect(() => {
    if (status !== "authenticated" || !loaded || !hasMergedRef.current) return;
    fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    }).catch((e) => console.error("تعذر حفظ السلة:", e));
  }, [items, status, loaded]);

  function addItem(product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product._id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "",
          stock: product.stock,
          quantity,
        },
      ];
    });
  }

  function updateQuantity(productId, quantity) {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          )
    );
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const itemsCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemsCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart يجب أن يُستخدم داخل CartProvider");
  return ctx;
}
