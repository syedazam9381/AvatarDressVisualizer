
import { createContext, useState, useContext, ReactNode } from 'react';
import { CartItem, Dress } from '@/lib/types';
import { toast } from 'sonner';

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Dress, quantity: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Dress, quantity: number = 1, size?: string, color?: string) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.product.id === product.id && item.size === size && item.color === color
      );

      if (existingItem) {
        toast.success(`Updated quantity for ${product.name}`, {
          description: `Size: ${size || 'Not selected'}, Color: ${color || 'Not selected'}`,
        });
        
        return prevItems.map(item => 
          item.product.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      toast.success(`Added ${product.name} to cart`, {
        description: `Size: ${size || 'Not selected'}, Color: ${color || 'Not selected'}`,
      });
      
      return [...prevItems, { product, quantity, size, color }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(items.filter(item => item.product.id !== productId));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(
      items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
    toast.success('Cart updated');
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared');
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
