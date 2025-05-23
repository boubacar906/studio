// src/components/calorie-estimator/ImageUpload.tsx
"use client";

import { ChangeEvent, useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageUploadProps {
  onImageSelected: (file: File | null) => void;
  currentImagePreviewUrl: string | null;
}

export function ImageUpload({ onImageSelected, currentImagePreviewUrl }: ImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(currentImagePreviewUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelected(file);
    } else {
      setImagePreview(null);
      onImageSelected(null);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    onImageSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  return (
    <div className="w-full space-y-4">
      <Label htmlFor="food-image-upload" className="text-lg font-medium">Upload Food Image</Label>
      <div
        className="relative w-full h-64 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors group bg-background"
        onClick={() => fileInputRef.current?.click()}
      >
        {imagePreview ? (
          <>
            <Image
              src={imagePreview}
              alt="Food preview"
              layout="fill"
              objectFit="contain"
              className="rounded-lg p-2"
              data-ai-hint="food meal"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 z-10 opacity-70 group-hover:opacity-100 transition-opacity"
              onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            <UploadCloud className="mx-auto h-12 w-12 mb-2" />
            <p className="font-semibold">Click to upload or drag and drop</p>
            <p className="text-xs">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>
        )}
        <Input
          id="food-image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
      {imagePreview && (
        <Button variant="outline" onClick={handleRemoveImage} className="w-full sm:w-auto">
          Clear Image
        </Button>
      )}
    </div>
  );
}
