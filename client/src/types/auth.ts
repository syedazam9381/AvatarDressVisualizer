/**
 * Authentication Types
 * TypeScript interfaces for authentication-related data
 */

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  avatar?: {
    imagePath?: string;
    originalName?: string;
    uploadDate?: string;
    isActive?: boolean;
  };
  addresses?: Address[];
  preferences?: UserPreferences;
  isEmailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  orders?: Order[];
}

export interface Address {
  _id?: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface UserPreferences {
  newsletter: boolean;
  notifications: boolean;
  preferredSizes: string[];
  favoriteColors: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  total: number;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}