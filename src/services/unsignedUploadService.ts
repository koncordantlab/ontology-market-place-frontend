/**
 * Unsigned Upload Service
 * 
 * This service uses unsigned uploads with upload presets.
 * This is the recommended approach for frontend applications.
 */

import { cloudinaryUploadUrl } from '../config/cloudinary';

export interface UnsignedUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  publicId?: string;
}

export interface UnsignedUploadOptions {
  preset?: string;
  folder?: string;
  tags?: string[];
}

/**
 * Unsigned upload service that uses upload presets
 */
export class UnsignedUploadService {
  /**
   * Upload a file using unsigned upload
   */
  async uploadFile(file: File, options: UnsignedUploadOptions = {}): Promise<UnsignedUploadResult> {
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
      
      // Use the specified preset or default
      const preset = options.preset || 'ml_default';
      formData.append('upload_preset', preset);
      
      // Add additional options (these must be allowed by the preset)
      if (options.folder) {
        formData.append('folder', options.folder);
      }
      
      if (options.tags && options.tags.length > 0) {
        formData.append('tags', options.tags.join(','));
      }

      console.log('Uploading file to Cloudinary with unsigned upload:', file.name, 'preset:', preset);

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
  async uploadThumbnail(file: File): Promise<UnsignedUploadResult> {
    return this.uploadFile(file, {
      preset: 'ontology_thumbnails', // This preset needs to be created with unsigned mode
      folder: 'ontology-thumbnails',
      tags: ['thumbnail', 'ontology']
    });
  }

  /**
   * Upload a profile image
   */
  async uploadProfileImage(file: File): Promise<UnsignedUploadResult> {
    return this.uploadFile(file, {
      preset: 'profile_images', // This preset needs to be created with unsigned mode
      folder: 'profile-images',
      tags: ['profile', 'user']
    });
  }

  /**
   * Upload a general image
   */
  async uploadGeneralImage(file: File): Promise<UnsignedUploadResult> {
    return this.uploadFile(file, {
      preset: 'ml_default', // This preset needs to be set to unsigned mode
      folder: 'general',
      tags: ['general']
    });
  }
}

// Export a singleton instance
export const unsignedUploadService = new UnsignedUploadService();
