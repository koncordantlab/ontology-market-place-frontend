/**
 * Signed Upload Service (Temporary)
 * 
 * This service uses signed uploads with API keys for testing purposes.
 * This is less secure for production but allows immediate testing.
 */

import { cloudinaryConfig, cloudinaryUploadUrl } from '../config/cloudinary';

export interface SignedUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  publicId?: string;
}

export interface SignedUploadOptions {
  preset?: string;
  folder?: string;
  transformation?: any;
  tags?: string[];
}

/**
 * Generate signature for signed uploads
 * 
 * Note: This is a simplified implementation for testing.
 * In production, signature generation should be done on the backend.
 */
function generateSignature(params: Record<string, string>): string {
  // Sort parameters alphabetically
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  // Create the string to sign
  const stringToSign = sortedParams + cloudinaryConfig.apiSecret;
  
  // For browser environment, we'll use a simple hash
  // This is NOT secure for production - should be done server-side
  let hash = 0;
  for (let i = 0; i < stringToSign.length; i++) {
    const char = stringToSign.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to base64-like string
  return btoa(hash.toString());
}

/**
 * Signed upload service that uses API keys
 */
export class SignedUploadService {
  /**
   * Upload a file using signed upload
   */
  async uploadFile(file: File, options: SignedUploadOptions = {}): Promise<SignedUploadResult> {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return {
          success: false,
          error: 'File must be an image'
        };
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return {
          success: false,
          error: 'File size must be less than 5MB'
        };
      }

      const formData = new FormData();
      formData.append('file', file);
      
      // Use existing preset
      const preset = options.preset || 'ml_default';
      formData.append('upload_preset', preset);
      
      // Add API key for signed upload
      formData.append('api_key', cloudinaryConfig.apiKey);
      
      // Add timestamp
      const timestamp = Math.round(new Date().getTime() / 1000).toString();
      formData.append('timestamp', timestamp);
      
      // Add additional options
      if (options.folder) {
        formData.append('folder', options.folder);
      }
      
      if (options.tags && options.tags.length > 0) {
        formData.append('tags', options.tags.join(','));
      }
      
      if (options.transformation) {
        const transformationString = this.formatTransformation(options.transformation);
        formData.append('transformation', transformationString);
      }

      // Generate signature
      const params: Record<string, string> = {
        timestamp,
        upload_preset: preset
      };
      
      if (options.folder) params.folder = options.folder;
      if (options.tags && options.tags.length > 0) params.tags = options.tags.join(',');
      if (options.transformation) params.transformation = this.formatTransformation(options.transformation);
      
      const signature = generateSignature(params);
      formData.append('signature', signature);

      console.log('Uploading file to Cloudinary with signed upload:', file.name, 'preset:', preset);

      const response = await fetch(cloudinaryUploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', response.status, errorText);
        return {
          success: false,
          error: `Upload failed: ${response.status} - ${errorText}`
        };
      }

      const result = await response.json();
      console.log('Upload successful:', result);

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id
      };

    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown upload error'
      };
    }
  }

  /**
   * Upload a thumbnail image
   */
  async uploadThumbnail(file: File): Promise<SignedUploadResult> {
    return this.uploadFile(file, {
      preset: 'ml_default',
      folder: 'ontology-thumbnails',
      tags: ['thumbnail', 'ontology']
    });
  }

  /**
   * Upload a profile image
   */
  async uploadProfileImage(file: File): Promise<SignedUploadResult> {
    return this.uploadFile(file, {
      preset: 'ml_default',
      folder: 'profile-images',
      tags: ['profile', 'user']
    });
  }

  /**
   * Format transformation object to Cloudinary transformation string
   */
  private formatTransformation(transformation: any): string {
    const parts: string[] = [];
    
    if (transformation.width) parts.push(`w_${transformation.width}`);
    if (transformation.height) parts.push(`h_${transformation.height}`);
    if (transformation.crop) parts.push(`c_${transformation.crop}`);
    if (transformation.gravity) parts.push(`g_${transformation.gravity}`);
    if (transformation.quality) parts.push(`q_${transformation.quality}`);
    if (transformation.format) parts.push(`f_${transformation.format}`);
    
    return parts.join(',');
  }
}

// Export a singleton instance
export const signedUploadService = new SignedUploadService();
