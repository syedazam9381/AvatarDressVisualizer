
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AvatarProvider } from "@/context/AvatarContext";

import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import AvatarPage from "./pages/AvatarPage";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <AvatarProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/avatar" element={<AvatarPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AvatarProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
