
import { createContext, useState, useContext, ReactNode } from 'react';
import { Avatar, Dress } from '@/lib/types';
import { toast } from 'sonner';

type AvatarContextType = {
  avatar: Avatar;
  selectedDress: Dress | null;
  setAvatarImage: (imageUrl: string) => void;
  tryOnDress: (dress: Dress) => void;
  resetAvatar: () => void;
};

const AvatarContext = createContext<AvatarContextType | null>(null);

export const AvatarProvider = ({ children }: { children: ReactNode }) => {
  const [avatar, setAvatar] = useState<Avatar>({
    imageSrc: null,
    faceDetected: false,
  });
  const [selectedDress, setSelectedDress] = useState<Dress | null>(null);

  const setAvatarImage = (imageUrl: string) => {
    // In a real app, we would do face detection here
    // For now, we'll just assume the face is detected
    setAvatar({
      imageSrc: imageUrl,
      faceDetected: true,
    });
    toast.success('Avatar created! Now you can try on dresses.');
  };

  const tryOnDress = (dress: Dress) => {
    setSelectedDress(dress);
    toast.success(`Now trying on: ${dress.name}`);
  };

  const resetAvatar = () => {
    setAvatar({
      imageSrc: null,
      faceDetected: false,
    });
    setSelectedDress(null);
    toast.success('Avatar reset');
  };

  return (
    <AvatarContext.Provider
      value={{
        avatar,
        selectedDress,
        setAvatarImage,
        tryOnDress,
        resetAvatar,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error('useAvatar must be used within an AvatarProvider');
  }
  return context;
};
