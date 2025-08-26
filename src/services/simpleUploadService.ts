import { cloudinaryUploadUrl } from '../config/cloudinary';

export interface SimpleUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  publicId?: string;
}

export interface SimpleUploadOptions {
  preset?: string;
  folder?: string;
  tags?: string[];
}

export class SimpleUploadService {
  async uploadFile(file: File, options: SimpleUploadOptions = {}): Promise<SimpleUploadResult> {
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
      const preset = options.preset || 'ontologymarketplace';
      formData.append('upload_preset', preset);
      
      if (options.folder) {
        formData.append('folder', options.folder);
      }
      
      if (options.tags && options.tags.length > 0) {
        formData.append('tags', options.tags.join(','));
      }



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


  async uploadThumbnail(file: File): Promise<SimpleUploadResult> {
    return this.uploadFile(file, {
      preset: 'ontologymarketplace',
      folder: 'ontology-thumbnails',
      tags: ['thumbnail', 'ontology']
    });
  }


  async uploadProfileImage(file: File): Promise<SimpleUploadResult> {
    return this.uploadFile(file, {
      preset: 'ontologymarketplace',
      folder: 'profile-images',
      tags: ['profile', 'user']
    });
  }


  async uploadGeneralImage(file: File): Promise<SimpleUploadResult> {
    return this.uploadFile(file, {
      preset: 'ontologymarketplace',
      folder: 'general',
      tags: ['general']
    });
  }
}

export const simpleUploadService = new SimpleUploadService();
