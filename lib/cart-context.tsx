"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Product, ProductVariant, CustomizationSelection } from "./types";

interface CartContextType {
  items: CartItem[];
  addItem: (
    product: Product,
    customization: CustomizationSelection,
    variant?: ProductVariant,
    quantity?: number
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("dh_cart_items");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("dh_cart_items", JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addItem = (
    product: Product,
    customization: CustomizationSelection,
    variant?: ProductVariant,
    quantity: number = 1
  ) => {
    // Calculate base item unit price including variant & chosen addons
    let unitPrice = variant ? variant.price : product.base_price;

    // Add addons prices
    if (customization.selected_addons && product.customization_config.addons) {
      customization.selected_addons.forEach((addonId) => {
        const addon = product.customization_config.addons?.find((a) => a.id === addonId);
        if (addon) {
          unitPrice += addon.price;
        }
      });
    }

    // Add image upload addon price if applicable
    if (
      customization.uploaded_image_url &&
      product.customization_config.image_upload?.price_addon
    ) {
      unitPrice += product.customization_config.image_upload.price_addon;
    }

    const newItemId = `${product.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newItem: CartItem = {
      id: newItemId,
      product,
      variant,
      quantity,
      customization,
      unit_price: unitPrice,
      total_price: unitPrice * quantity,
    };

    setItems((prev) => [newItem, ...prev]);
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              total_price: item.unit_price * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.total_price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
