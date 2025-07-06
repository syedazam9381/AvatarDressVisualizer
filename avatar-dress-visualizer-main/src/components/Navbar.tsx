
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, User, Menu, X, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { getItemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-fashion-primary">Chic Try</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
            <Link to="/" className="text-gray-700 hover:text-fashion-primary transition-colors">Home</Link>
            <Link to="/catalog" className="text-gray-700 hover:text-fashion-primary transition-colors">Shop</Link>
            <Link to="/avatar" className="text-gray-700 hover:text-fashion-primary transition-colors">Try-On</Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Link to="/avatar">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-5 w-5" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-fashion-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {getItemCount()}
                  </span>
                )}
              </Button>
            </Link>
          </div>
          
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={cn(
        "md:hidden bg-white border-b",
        isOpen ? "block animate-fade-in" : "hidden"
      )}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            to="/" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-fashion-light hover:text-fashion-primary"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/catalog" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-fashion-light hover:text-fashion-primary"
            onClick={() => setIsOpen(false)}
          >
            Shop
          </Link>
          <Link 
            to="/avatar" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-fashion-light hover:text-fashion-primary"
            onClick={() => setIsOpen(false)}
          >
            Try-On
          </Link>
          <Link 
            to="/cart" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-fashion-light hover:text-fashion-primary"
            onClick={() => setIsOpen(false)}
          >
            Cart
            {getItemCount() > 0 && (
              <span className="ml-2 bg-fashion-primary text-white rounded-full px-2 py-1 text-xs">
                {getItemCount()}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
