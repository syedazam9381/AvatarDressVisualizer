
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      <div className="absolute inset-0 bg-gray-900/40"></div>
      
      {/* Using a solid color background for now instead of an image */}
      <div className="absolute inset-0 bg-gradient-to-r from-fashion-tertiary to-fashion-primary opacity-90"></div>
      
      <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Try Before You Buy
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90">
            Experience virtual fitting with our cutting-edge try-on technology. 
            Upload your photo and see how our dresses look on you before making a purchase.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/catalog">
              <Button size="lg" className="bg-white text-fashion-primary hover:bg-gray-100">
                Shop Collection
              </Button>
            </Link>
            <Link to="/avatar">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Try On Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
