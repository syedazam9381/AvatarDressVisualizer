
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AvatarUploader } from '@/components/AvatarUploader';
import { VirtualTryOn } from '@/components/VirtualTryOn';
import { useAvatar } from '@/context/AvatarContext';

const AvatarPage = () => {
  const { avatar } = useAvatar();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Virtual Try-On</h1>
            <p className="text-gray-600 mb-8">Create your avatar and try on our dresses virtually</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <AvatarUploader />
              </div>
              <div>
                <VirtualTryOn />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AvatarPage;
