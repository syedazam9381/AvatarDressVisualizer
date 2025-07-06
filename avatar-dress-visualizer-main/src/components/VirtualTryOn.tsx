
import { useState, useEffect } from 'react';
import { useAvatar } from '@/context/AvatarContext';
import { dresses } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { generatePlaceholderImage } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

export function VirtualTryOn() {
  const { avatar, selectedDress } = useAvatar();
  const [compositeImage, setCompositeImage] = useState<string | null>(null);
  
  useEffect(() => {
    if (avatar.imageSrc && selectedDress) {
      // In a real app, this would render the dress on the avatar
      // For this demo, we'll just simulate it with a delay
      const timer = setTimeout(() => {
        simulateAvatarWithDress();
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setCompositeImage(null);
    }
  }, [avatar.imageSrc, selectedDress]);
  
  const simulateAvatarWithDress = () => {
    // In a real app, this would use canvas or WebGL to render the dress on the avatar
    // For this demo, we're just setting the composite to the avatar image
    setCompositeImage(avatar.imageSrc);
  };
  
  if (!avatar.imageSrc) {
    return (
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <div className="text-center py-8">
          <Camera className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Avatar Created Yet</h3>
          <p className="text-gray-500 mb-6">
            Upload your photo to create an avatar and try on dresses virtually.
          </p>
        </div>
      </div>
    );
  }
  
  if (!selectedDress) {
    return (
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <div className="text-center py-8">
          <h3 className="text-xl font-medium text-gray-900 mb-2">Select a Dress to Try On</h3>
          <p className="text-gray-500 mb-6">
            Browse our collection and click "Try On" to see how it looks on your avatar.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
            {dresses.slice(0, 4).map((dress) => (
              <ProductCard key={dress.id} product={dress} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Virtual Try-On</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden border">
            {compositeImage ? (
              <div className="relative h-full">
                <img 
                  src={compositeImage} 
                  alt="You wearing the dress" 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold">{selectedDress.name}</p>
                  <p className="text-white/80 text-sm">${selectedDress.price.toFixed(2)}</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-16 w-16 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-center gap-3">
            <Button className="bg-fashion-primary hover:bg-fashion-secondary">
              Save to Favorites
            </Button>
            <Button variant="outline" className="border-fashion-primary text-fashion-primary hover:bg-fashion-light">
              Share
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">{selectedDress.name}</h3>
          <p className="text-gray-600 mb-4">{selectedDress.description}</p>
          
          <div className="space-y-4 mb-6">
            <div>
              <p className="font-medium text-sm text-gray-700 mb-2">Price</p>
              <p className="text-xl font-bold">${selectedDress.price.toFixed(2)}</p>
            </div>
            
            <div>
              <p className="font-medium text-sm text-gray-700 mb-2">Available Sizes</p>
              <div className="flex flex-wrap gap-2">
                {selectedDress.sizes.map((size) => (
                  <div key={size} className="py-1 px-3 border rounded-full text-sm hover:bg-gray-50 cursor-pointer">
                    {size}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <p className="font-medium text-sm text-gray-700 mb-2">Available Colors</p>
              <div className="flex flex-wrap gap-2">
                {selectedDress.colors.map((color) => (
                  <div 
                    key={color} 
                    className="h-8 w-8 rounded-full border cursor-pointer"
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button className="flex-1 bg-fashion-primary hover:bg-fashion-secondary">
              Add to Cart
            </Button>
            <Button variant="outline" className="flex-1 border-fashion-primary text-fashion-primary hover:bg-fashion-light">
              Try Another Dress
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
