
export type Dress = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  sizes: string[];
  colors: string[];
  category: string;
  featured?: boolean;
};

export type CartItem = {
  product: Dress;
  quantity: number;
  size?: string;
  color?: string;
};

export type Avatar = {
  imageSrc: string | null;
  faceDetected: boolean;
};
