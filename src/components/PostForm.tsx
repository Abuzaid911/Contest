'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Camera, Moon, Star, Upload, AlertCircle } from 'lucide-react';

export default function PostForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !image) {
      setError('Title and image are required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Upload image
      const imageUrl = await uploadImage(image);

      // Create post
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      // Reset form
      setTitle('');
      setDescription('');
      setImage(null);
      setImagePreview(null);

      // Redirect to home page
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // This function handles image upload to Cloudinary
  const uploadImage = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error(error instanceof Error ? error.message : 'Error uploading image');
    }
  };

  return (
    <div className="bg-cream rounded-lg shadow-md border border-primary-gold p-6">
      <div className="flex items-center justify-center mb-6">
        <Moon className="h-6 w-6 text-primary-gold" />
        <h2 className="text-xl font-semibold mx-2 text-primary-brown font-['Amiri']">Share Your Iftar Meal</h2>
        <Star className="h-6 w-6 text-primary-gold" />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-primary-brown">
            Meal Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-primary-gold rounded-md bg-sand-light focus:outline-none focus:ring-2 focus:ring-primary-gold"
            placeholder="What delicious dish did you prepare for Iftar today?"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-primary-brown">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-primary-gold rounded-md bg-sand-light focus:outline-none focus:ring-2 focus:ring-primary-gold"
            placeholder="Share more details about your meal, ingredients, or the tradition behind it..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <span className="block text-sm font-medium text-primary-brown">Meal Photo</span>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
              imagePreview 
                ? 'border-primary-gold' 
                : 'border-primary-gold border-opacity-50 hover:border-opacity-100'
            }`}
          >
            {imagePreview ? (
              <div className="relative h-64 w-full">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center">
                <Camera className="h-12 w-12 text-primary-gold opacity-70" />
                <p className="mt-2 text-sm text-primary-brown">
                  Click to upload a photo of your Iftar meal
                </p>
                <p className="text-xs text-primary-brown opacity-70 mt-1">
                  Share your delicious creation with the community
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 text-red-600 bg-red-50 rounded-md border border-red-200 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-primary-gold text-white rounded-md hover:bg-secondary-gold disabled:opacity-50 transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="ramadan-spinner mr-2 border-2 h-5 w-5 border-white border-l-transparent"></div>
              Sharing...
            </>
          ) : (
            <>
              <Upload className="h-5 w-5 mr-2" />
              Share Your Iftar Meal
            </>
          )}
        </button>
      </form>
    </div>
  );
}