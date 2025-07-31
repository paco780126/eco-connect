import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { Product } from '../data/mock-products';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  itemCount: number;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, amount: number) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const localData = localStorage.getItem('ecoconnect-cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("장바구니 정보를 불러오는 데 실패했습니다.", error);
      return [];
    }
  });

  useEffect(() => {
    try {
        localStorage.setItem('ecoconnect-cart', JSON.stringify(cartItems));
    } catch (error) {
        console.error("장바구니 정보를 저장하는 데 실패했습니다.", error);
    }
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  const updateQuantity = (productId: string, amount: number) => {
    setCartItems(prevItems =>
      prevItems
        .map(item => {
          if (item.id === productId) {
            const newQuantity = item.quantity + amount;
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(item => item.quantity > 0)
    );
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value = { cartItems, itemCount, addToCart, removeFromCart, updateQuantity };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart는 CartProvider 안에서 사용되어야 합니다.');
  }
  return context;
};
