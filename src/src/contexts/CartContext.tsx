import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, amount: number) => void;
  cartItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
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

  const addToCart = (itemToAdd: Omit<CartItem, 'quantity'>, quantity: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === itemToAdd.id);
      if (existingItem) {
        // 이미 장바구니에 있으면 수량만 추가
        return prevItems.map(item =>
          item.id === itemToAdd.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      // 장바구니에 없으면 새로 추가
      return [...prevItems, { ...itemToAdd, quantity }];
    });
    alert(`${itemToAdd.name} 상품 ${quantity}개가 장바구니에 담겼습니다.`);
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

  // 헤더에 표시될 총 상품 수량 계산
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};