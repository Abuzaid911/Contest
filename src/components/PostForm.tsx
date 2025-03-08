// components/PostForm.tsx
'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Camera } from 'lucide-react';

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
      // Upload image to storage (you'll need to implement this part)
      // For demo purposes, we'll use a placeholder URL
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-primary-gold rounded-md bg-sand-light focus:outline-none focus:ring-2 focus:ring-primary-gold"
          placeholder="What did you prepare for Iftar today?"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">
          Description (Optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-primary-gold rounded-md bg-sand-light focus:outline-none focus:ring-2 focus:ring-primary-gold"
          placeholder="Share more details about your meal..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <span className="block text-sm font-medium">Photo</span>
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
            imagePreview ? 'border-gray-300' : 'border-blue-300 hover:border-blue-500'
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
              <Camera className="h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Click to upload a photo of your Iftar meal
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
        <div className="p-2 text-red-500 bg-red-50 rounded-md">{error}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Posting...' : 'Share Your Iftar Meal'}
      </button>
    </form>
  );
}