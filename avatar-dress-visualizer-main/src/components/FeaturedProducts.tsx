
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dresses } from '@/lib/data';
import { Dress } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { generatePlaceholderImage } from '@/lib/data';
import { useIsMobile } from '@/hooks/use-mobile';

export function FeaturedProducts() {
  const [featuredDresses, setFeaturedDresses] = useState<Dress[]>([]);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const featured = dresses.filter(dress => dress.featured);
    setFeaturedDresses(featured);
  }, []);
  
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Collection</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of stunning dresses for every occasion.
          </p>
        </div>
        
        <Carousel className="w-full">
          <CarouselContent>
            {featuredDresses.map((dress) => (
              <CarouselItem key={dress.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="h-full p-1">
                  <div className="overflow-hidden rounded-lg border bg-white h-full flex flex-col">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img 
                        src={dress.image || generatePlaceholderImage(dress.id)} 
                        alt={dress.name}
                        className="h-full w-full object-cover transition-transform hover:scale-105 duration-500"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-lg font-medium">{dress.name}</h3>
                      <p className="text-sm text-gray-500 mt-2 flex-grow">{dress.description}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-lg font-semibold">${dress.price.toFixed(2)}</span>
                        <Link to={`/product/${dress.id}`}>
                          <Button variant="outline" size={isMobile ? "sm" : "default"} className="border-fashion-primary text-fashion-primary hover:bg-fashion-light">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
        
        <div className="mt-10 text-center">
          <Link to="/catalog">
            <Button className="bg-fashion-primary hover:bg-fashion-secondary">
              View All Collection
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
