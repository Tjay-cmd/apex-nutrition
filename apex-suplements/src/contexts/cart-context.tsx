"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/firebase-auth-context';
import { addToCart, removeFromCart as removeFromServerCart, updateCartItem, getCartItems } from '@/lib/firebase-queries';
import type { Product } from '@/types';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
  selected_options?: {
    flavor?: string;
    size?: string;
  };
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
  isLoading: boolean;
  addToCart: (product: Product, quantity: number, options?: { flavor?: string; size?: string }) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
  syncCartWithServer: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

// Calculate shipping cost based on subtotal
const calculateShipping = (subtotal: number): number => {
  if (subtotal >= 500) return 0; // Free shipping over R500
  return 99; // R99 shipping
};

// Format currency in ZAR
const formatZAR = (amount: number): string => {
  return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate totals with better validation
  const subtotal = items.reduce((sum, item) => {
    // Validate item has proper structure
    if (!item || !item.product || typeof item.quantity !== 'number' || item.quantity <= 0) {
      return sum;
    }
    const itemPrice = item.product.price || 0;
    return sum + (itemPrice * item.quantity);
  }, 0);
  const shipping = calculateShipping(subtotal);
  // If cart is empty, total should be 0 (no shipping cost for empty cart)
  const total = items.length === 0 ? 0 : subtotal + shipping;
  const totalItems = items.reduce((sum, item) => {
    // Validate item has proper structure
    if (!item || typeof item.quantity !== 'number' || item.quantity <= 0) {
      return sum;
    }
    return sum + item.quantity;
  }, 0);

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Cart Debug:', {
      items: items.length,
      totalItems,
      subtotal,
      shipping,
      total,
      items: items.map(item => ({
        id: item.id,
        product: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      }))
    });
  }

    // Load cart from localStorage on mount
  useEffect(() => {
    setIsLoading(true);
    // Clear corrupted cart data first
    try {
      const storedCart = localStorage.getItem('apex-cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        // Check if cart has corrupted data
        const hasCorruptedData = parsedCart.some((item: any) =>
          !item || !item.product || !item.product.name || typeof item.quantity !== 'number'
        );
        if (hasCorruptedData) {
          console.log('Clearing corrupted cart data');
          localStorage.removeItem('apex-cart');
          setItems([]);
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error('Error checking cart data:', error);
      localStorage.removeItem('apex-cart');
      setItems([]);
      setIsLoading(false);
      return;
    }

    loadCartFromStorage();
  }, []);

  // Sync cart with server when user changes
  // Temporarily disabled to prevent Firebase errors
  // useEffect(() => {
  //   if (user) {
  //     syncCartWithServer();
  //   } else {
  //     // Clear server cart when user logs out
  //     clearServerCart();
  //   }
  // }, [user]);

  const loadCartFromStorage = () => {
    try {
      const storedCart = localStorage.getItem('apex-cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        // Validate cart items to ensure they have required properties
        const validCart = parsedCart.filter((item: any) =>
          item &&
          item.product &&
          item.product.name && // Ensure product has a name
          typeof item.quantity === 'number' &&
          item.quantity > 0 &&
          typeof item.product.price === 'number' && // Ensure product has a price
          item.product.price > 0
        );

        if (process.env.NODE_ENV === 'development') {
          console.log('Loading cart from storage:', {
            original: parsedCart.length,
            valid: validCart.length,
            items: validCart.map(item => ({
              id: item.id,
              product: item.product.name,
              quantity: item.quantity,
              price: item.product.price
            }))
          });
        }

        setItems(validCart);
      } else {
        // Ensure empty cart state
        setItems([]);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      // Clear invalid cart data
      localStorage.removeItem('apex-cart');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCartToStorage = (cartItems: CartItem[]) => {
    try {
      localStorage.setItem('apex-cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  };

  const addToCart = async (product: Product, quantity: number, options?: { flavor?: string; size?: string }) => {
    try {
      // Validate input parameters
      if (!product || !product.id || !product.name || typeof quantity !== 'number' || quantity <= 0) {
        console.error('Invalid product or quantity:', { product, quantity });
        return;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('Adding to cart:', {
          product: product.name,
          quantity,
          options,
          currentItems: items.length
        });
      }

      const existingItemIndex = items.findIndex(
        item => item.product_id === product.id &&
        JSON.stringify(item.selected_options) === JSON.stringify(options)
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = [...items];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`, // Temporary ID
          product_id: product.id,
          quantity,
          product,
          selected_options: options,
        };
        newItems = [...items, newItem];
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('Setting new cart items:', {
          count: newItems.length,
          items: newItems.map(item => ({
            id: item.id,
            product: item.product.name,
            quantity: item.quantity
          }))
        });
      }

      setItems(newItems);
      saveCartToStorage(newItems);

      // Sync with server if user is logged in (with delay to prevent interference)
      // Temporarily disabled to prevent Firebase errors
      // if (user) {
      //   setTimeout(async () => {
      //     await syncCartWithServer();
      //   }, 100);
      // }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const newItems = items.filter(item => item.id !== itemId);
      setItems(newItems);
      saveCartToStorage(newItems);

      // Sync with server if user is logged in
      // Temporarily disabled to prevent Firebase errors
      // if (user) {
      //   const result = await removeFromServerCart(user.id, itemId);
      //   if (result && !result.success) {
      //     console.error('Error removing from server cart:', result.error);
      //   }
      // }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      const newItems = items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      setItems(newItems);
      saveCartToStorage(newItems);

      // Sync with server if user is logged in
      // Temporarily disabled to prevent Firebase errors
      // if (user) {
      //   const result = await updateCartItem(user.id, itemId, quantity);
      //   if (result && !result.success) {
      //     console.error('Error updating server cart item:', result.error);
      //   }
      // }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    try {
      setItems([]);
      saveCartToStorage([]);

      // Force clear localStorage
      localStorage.removeItem('apex-cart');

      // Clear server cart if user is logged in
      // Temporarily disabled to prevent Firebase errors
      // if (user) {
      //   await clearServerCart();
      // }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const loadCart = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await getCartItems(user.id);

      if (data) {
        const serverItems: CartItem[] = data.map(item => ({
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          product: item.product || {} as Product, // Handle case where product might not be loaded
          selected_options: item.selected_options,
        }));

        setItems(serverItems);
        saveCartToStorage(serverItems);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const syncCartWithServer = async () => {
    if (!user) return;

    try {
      // Only sync valid local changes to server
      const validItems = items.filter(item =>
        item &&
        item.product &&
        item.product_id &&
        typeof item.quantity === 'number' &&
        item.quantity > 0
      );

      if (process.env.NODE_ENV === 'development') {
        console.log('Syncing valid items to server:', validItems.length);
      }

      for (const item of validItems) {
        await addItemToServer(item);
      }
    } catch (error) {
      console.error('Error syncing cart with server:', error);
    }
  };

  const addItemToServer = async (item: CartItem) => {
    if (!user) return;

    // Validate item before sending to server
    if (!item || !item.product || !item.product_id || typeof item.quantity !== 'number' || item.quantity <= 0) {
      console.error('Invalid item data for server sync:', item);
      return;
    }

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Adding item to server:', {
          userId: user.id,
          productId: item.product_id,
          quantity: item.quantity
        });
      }

      const result = await addToCart(user.id, item.product_id, item.quantity);
      if (result && !result.success) {
        console.error('Error adding item to server cart:', result.error);
      } else if (!result) {
        console.error('Error adding item to server cart: No result returned');
      }
    } catch (error) {
      console.error('Error adding item to server cart:', error);
    }
  };

  const clearServerCart = async () => {
    if (!user) return;

    try {
      // Firebase doesn't have a direct "clear all" operation
      // We'll handle this by not syncing when user logs out
      console.log('User logged out, clearing local cart only');
    } catch (error) {
      console.error('Error clearing server cart:', error);
    }
  };

  const value: CartContextType = {
    items,
    totalItems,
    subtotal,
    shipping,
    total,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart,
    syncCartWithServer,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};