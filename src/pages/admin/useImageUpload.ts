import { useState } from 'react';
import { supabase } from '../../lib/supabase';

/**
 * Uploads a File to the `media` Supabase Storage bucket.
 * Returns the public URL of the uploaded file, or throws on error.
 */
export async function uploadMedia(file: File): Promise<string> {
  const ext  = file.name.split('.').pop() ?? 'jpg';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase!.storage.from('media').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase!.storage.from('media').getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Hook for image upload state management.
 * Usage: const { uploading, upload } = useImageUpload();
 */
export function useImageUpload() {
  const [uploading, setUploading] = useState(false);

  async function upload(file: File): Promise<string> {
    setUploading(true);
    try {
      return await uploadMedia(file);
    } finally {
      setUploading(false);
    }
  }

  return { uploading, upload };
}
