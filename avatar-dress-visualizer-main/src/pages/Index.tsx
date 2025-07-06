
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { FeaturedProducts } from '@/components/FeaturedProducts';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedProducts />
        
        <section className="py-16 bg-fashion-softer">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Virtual Try-On Experience</h2>
              <p className="text-lg text-gray-600 mb-8">
                See how our dresses look on you before you buy. Upload your photo, create your avatar, 
                and try on any dress in our collection virtually. It's that simple!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-16 h-16 bg-fashion-light text-fashion-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Upload Your Photo</h3>
                  <p className="text-gray-600">Upload a clear front-facing photo to create your avatar.</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-16 h-16 bg-fashion-light text-fashion-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Browse Dresses</h3>
                  <p className="text-gray-600">Explore our collection and select dresses you like.</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-16 h-16 bg-fashion-light text-fashion-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Try Them On</h3>
                  <p className="text-gray-600">See how each dress looks on your virtual avatar before buying.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
