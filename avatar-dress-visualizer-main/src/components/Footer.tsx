
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Chic Try</h3>
            <p className="mt-2 text-sm text-gray-600">
              Try on dresses virtually before you buy. The future of online shopping is here.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Shop</h3>
            <div className="mt-4 space-y-2">
              <Link to="/catalog" className="text-sm text-gray-600 hover:text-fashion-primary">
                All Dresses
              </Link>
              <div className="block text-sm text-gray-600 hover:text-fashion-primary">
                New Arrivals
              </div>
              <div className="block text-sm text-gray-600 hover:text-fashion-primary">
                Featured
              </div>
              <Link to="/avatar" className="block text-sm text-gray-600 hover:text-fashion-primary">
                Virtual Try-On
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
            <div className="mt-4 space-y-2">
              <div className="block text-sm text-gray-600 hover:text-fashion-primary">
                Contact Us
              </div>
              <div className="block text-sm text-gray-600 hover:text-fashion-primary">
                FAQ
              </div>
              <div className="block text-sm text-gray-600 hover:text-fashion-primary">
                Returns
              </div>
              <div className="block text-sm text-gray-600 hover:text-fashion-primary">
                Size Guide
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Stay Connected</h3>
            <p className="mt-4 text-sm text-gray-600">
              Subscribe to our newsletter for updates on new arrivals and special offers.
            </p>
            <form className="mt-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-fashion-primary"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-fashion-primary rounded-md hover:bg-fashion-secondary transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-center text-gray-500">
            &copy; {new Date().getFullYear()} Chic Try. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
