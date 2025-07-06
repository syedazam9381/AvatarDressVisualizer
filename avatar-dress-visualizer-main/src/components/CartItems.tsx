
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { generatePlaceholderImage } from '@/lib/data';

export function CartItems() {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  
  if (checkingOut) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="max-w-xl mx-auto py-8">
          <h2 className="text-2xl font-bold mb-6">Checkout</h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <Input id="name" type="text" placeholder="Enter your name" />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Address
              </label>
              <Input id="address" type="text" placeholder="Enter your address" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <Input id="city" type="text" placeholder="City" />
              </div>
              
              <div>
                <label htmlFor="postal" className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <Input id="postal" type="text" placeholder="Postal code" />
              </div>
            </div>
            
            <div>
              <label htmlFor="card" className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <Input id="card" type="text" placeholder="XXXX XXXX XXXX XXXX" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <Input id="expiry" type="text" placeholder="MM/YY" />
              </div>
              
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <Input id="cvv" type="text" placeholder="CVV" />
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between py-2">
              <span>Subtotal</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Shipping</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between py-2 font-bold">
              <span>Total</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={() => setCheckingOut(false)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Button>
            <Button className="flex-1 bg-fashion-primary hover:bg-fashion-secondary">
              Place Order
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added any dresses to your cart yet.</p>
        <Link to="/catalog">
          <Button className="bg-fashion-primary hover:bg-fashion-secondary">
            Browse Collection
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
        
        <div className="space-y-6">
          {items.map((item) => (
            <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex items-center gap-6 py-4 border-b">
              <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                <img 
                  src={item.product.image || generatePlaceholderImage(item.product.id)} 
                  alt={item.product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <div className="text-sm text-gray-500 mt-1">
                  {item.size && <span className="mr-4">Size: {item.size}</span>}
                  {item.color && <span>Color: {item.color}</span>}
                </div>
                <div className="text-sm font-semibold mt-1">${item.product.price.toFixed(2)}</div>
              </div>
              
              <div className="flex items-center">
                <div className="flex items-center border rounded-md">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-none"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <div className="w-10 text-center">{item.quantity}</div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-none"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="font-semibold">
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeFromCart(item.product.id)}
              >
                <Trash2 className="h-5 w-5 text-gray-400" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t p-6">
        <div className="flex justify-between mb-4">
          <span className="font-medium">Subtotal</span>
          <span className="font-semibold">${getCartTotal().toFixed(2)}</span>
        </div>
        
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={clearCart}
          >
            Clear Cart
          </Button>
          <Button 
            className="flex-1 bg-fashion-primary hover:bg-fashion-secondary"
            onClick={() => setCheckingOut(true)}
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
