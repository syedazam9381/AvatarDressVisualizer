
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductGrid } from '@/components/ProductGrid';
import { dresses } from '@/lib/data';

const Catalog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Dress Collection</h1>
            <p className="text-gray-600 mb-8">Find the perfect dress for any occasion</p>
            
            <ProductGrid products={dresses} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Catalog;
