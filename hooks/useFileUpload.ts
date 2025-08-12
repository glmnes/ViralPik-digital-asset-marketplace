import { useState, useCallback } from 'react';
import { toast } from 'sonner';

// Helper function to get MIME type from file extension
function getMimeType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop();
  const mimeTypes: Record<string, string> = {
    'psd': 'application/vnd.adobe.photoshop',
    'svg': 'image/svg+xml',
    'mp4': 'video/mp4',
    'zip': 'application/zip',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'pdf': 'application/pdf',
  };
  return mimeTypes[ext || ''] || 'application/octet-stream';
}

interface UploadProgress {
  percentage: number;
  loaded: number;
  total: number;
}

interface UploadResult {
  assetUrl: string;
  thumbnailUrl: string;
  assetKey: string;
  thumbnailKey: string;
}

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({ percentage: 0, loaded: 0, total: 0 });

  const uploadFile = useCallback(async (file: File): Promise<UploadResult | null> => {
    try {
      setIsUploading(true);
      setProgress({ percentage: 0, loaded: 0, total: file.size });

      // Step 1: Get presigned URL from our API
      // For PSD files and other unrecognized types, use a fallback content type
      const contentType = file.type || getMimeType(file.name);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          filename: file.name,
          contentType: contentType,
          fileSize: file.size,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Upload API error:', error);
        throw new Error(error.error || 'Failed to get upload URL');
      }

      const { uploadUrl, assetUrl, thumbnailUrl, assetKey, thumbnailKey } = await response.json();

      // Step 2: Upload directly to R2 using presigned URL
      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentage = Math.round((e.loaded / e.total) * 100);
            setProgress({ percentage, loaded: e.loaded, total: e.total });
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setProgress({ percentage: 100, loaded: file.size, total: file.size });
            resolve({ assetUrl, thumbnailUrl, assetKey, thumbnailKey });
          } else {
            reject(new Error('Upload failed'));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', contentType);
        xhr.send(file);
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Upload failed');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const uploadMultiple = useCallback(async (files: File[]): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];
    
    for (const file of files) {
      const result = await uploadFile(file);
      if (result) {
        results.push(result);
      }
    }
    
    return results;
  }, [uploadFile]);

  const deleteFile = useCallback(async (assetKey: string, thumbnailKey?: string) => {
    try {
      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetKey, thumbnailKey }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      return true;
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
      return false;
    }
  }, []);

  return {
    uploadFile,
    uploadMultiple,
    deleteFile,
    isUploading,
    progress,
  };
}
