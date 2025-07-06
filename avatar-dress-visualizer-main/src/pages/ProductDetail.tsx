
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAvatar } from '@/context/AvatarContext';
import { dresses } from '@/lib/data';
import { Dress } from '@/lib/types';
import { generatePlaceholderImage } from '@/lib/data';
import { ChevronLeft, Eye, ShoppingBag } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Dress | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { tryOnDress } = useAvatar();
  
  useEffect(() => {
    if (id) {
      const foundProduct = dresses.find(dress => dress.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedSize(null);
        setSelectedColor(null);
      }
    }
  }, [id]);
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12">
          <div className="container mx-auto px-4">
            <p>Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const handleAddToCart = () => {
    addToCart(product, 1, selectedSize || undefined, selectedColor || undefined);
  };
  
  const handleTryOn = () => {
    tryOnDress(product);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Link to="/catalog" className="flex items-center text-gray-600 hover:text-fashion-primary mb-8">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Collection
            </Link>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden">
                <img 
                  src={product.image || generatePlaceholderImage(product.id)} 
                  alt={product.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-2xl font-semibold mb-4">${product.price.toFixed(2)}</p>
                <p className="text-gray-600 mb-6">{product.description}</p>
                
                <div className="space-y-6 mb-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button 
                          key={size} 
                          type="button"
                          className={`
                            py-2 px-4 border rounded-md text-sm
                            ${selectedSize === size 
                              ? 'bg-fashion-primary text-white border-fashion-primary' 
                              : 'bg-white text-gray-900 border-gray-200 hover:border-fashion-primary'
                            }
                          `}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((color) => (
                        <button 
                          key={color} 
                          type="button"
                          className={`
                            h-10 w-10 rounded-full border-2
                            ${selectedColor === color ? 'border-fashion-primary' : 'border-transparent'}
                          `}
                          style={{ backgroundColor: color.toLowerCase() }}
                          onClick={() => setSelectedColor(color)}
                          title={color}
                        ></button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    onClick={handleAddToCart} 
                    className="flex-1 bg-fashion-primary hover:bg-fashion-secondary"
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Button 
                    onClick={handleTryOn} 
                    variant="outline" 
                    className="flex-1 border-fashion-primary text-fashion-primary hover:bg-fashion-light"
                  >
                    <Eye className="mr-2 h-5 w-5" />
                    Try It On
                  </Button>
                </div>
                
                <div className="mt-10 border-t pt-6">
                  <h3 className="text-lg font-medium mb-2">Product Details</h3>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Category: {product.category}</li>
                    <li>Available Sizes: {product.sizes.join(', ')}</li>
                    <li>Available Colors: {product.colors.join(', ')}</li>
                    <li>Try before you buy with our virtual fitting room</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
