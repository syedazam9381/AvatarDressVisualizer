
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAvatar } from '@/context/AvatarContext';
import { Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function AvatarUploader() {
  const { avatar, setAvatarImage, resetAvatar } = useAvatar();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleConfirm = () => {
    if (preview) {
      setAvatarImage(preview);
    }
  };
  
  const handleCancel = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Create Your Avatar</h2>
      
      {preview ? (
        <div className="space-y-4">
          <div className="aspect-square max-w-sm mx-auto overflow-hidden rounded-lg border bg-gray-50">
            <img 
              src={preview} 
              alt="Preview" 
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="flex justify-center gap-4">
            <Button onClick={handleConfirm} className="bg-fashion-primary hover:bg-fashion-secondary">
              Confirm Photo
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      ) : avatar.imageSrc ? (
        <div className="space-y-4">
          <div className="aspect-square max-w-sm mx-auto overflow-hidden rounded-lg border bg-gray-50">
            <img 
              src={avatar.imageSrc} 
              alt="Your Avatar" 
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="text-center">
            <p className="text-green-600 mb-2">Avatar created successfully!</p>
            <Button variant="destructive" onClick={resetAvatar} size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Reset Avatar
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div 
            onClick={handleUploadClick}
            className="aspect-square cursor-pointer max-w-sm mx-auto border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-6 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700">Upload your photo</p>
            <p className="text-sm text-gray-500 mt-1">Click to browse or drag and drop</p>
            <p className="text-xs text-gray-400 mt-4">Supported formats: JPG, PNG, GIF</p>
          </div>
          
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <div className="text-center text-sm text-gray-500">
            <p>For best results, use a clear front-facing photo.</p>
            <p className="mt-1">We'll use this image to create your virtual avatar.</p>
          </div>
        </div>
      )}
    </div>
  );
}
