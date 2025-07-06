
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartItems } from '@/components/CartItems';

const Cart = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
            <p className="text-gray-600 mb-8">Review and checkout your items</p>
            
            <CartItems />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
