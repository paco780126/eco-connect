import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Product, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  cartItemCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

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

  const addToCart = (itemToAdd: Product, quantity: number) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === itemToAdd.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === itemToAdd.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...itemToAdd, quantity }];
    });
    alert(`${itemToAdd.name} 상품 ${quantity}개가 장바구니에 담겼습니다.`);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
  };
  
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const value = { cartItems, addToCart, removeFromCart, updateQuantity, cartItemCount, totalPrice };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};