
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAvatar } from '@/context/AvatarContext';
import { Dress } from '@/lib/types';
import { ShoppingBag, Eye } from 'lucide-react';
import { generatePlaceholderImage } from '@/lib/data';

type ProductCardProps = {
  product: Dress;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { tryOnDress } = useAvatar();

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-white transition-all hover:shadow-md">
      <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden">
        <img
          src={product.image || generatePlaceholderImage(product.id)}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-medium">{product.name}</h3>
        </Link>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
          <div className="flex space-x-2">
            <Button 
              onClick={() => tryOnDress(product)} 
              variant="outline" 
              size="sm" 
              className="border-fashion-primary text-fashion-primary hover:bg-fashion-light"
            >
              <Eye className="mr-1 h-4 w-4" />
              Try On
            </Button>
            <Button 
              onClick={() => addToCart(product, 1)} 
              variant="outline" 
              size="sm" 
              className="border-fashion-primary text-fashion-primary hover:bg-fashion-light"
            >
              <ShoppingBag className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
