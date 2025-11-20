import { supabase } from './client';

export type StorageBucket = 'pantry-images' | 'meal-images' | 'receipts' | 'avatars';

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  bucket: StorageBucket,
  file: File,
  userId: string,
  customPath?: string
) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const filePath = customPath || fileName;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      data: {
        path: data.path,
        publicUrl: urlData.publicUrl,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { data: null, error };
  }
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(bucket: StorageBucket, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Delete a file from storage
 */
export async function deleteFile(bucket: StorageBucket, path: string) {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { error };
  }
}

/**
 * Upload image with compression (optional future enhancement)
 */
export async function uploadImage(
  bucket: StorageBucket,
  file: File,
  userId: string
): Promise<{ data: { path: string; publicUrl: string } | null; error: any }> {
  // Future: Add image compression here
  return uploadFile(bucket, file, userId);
}
