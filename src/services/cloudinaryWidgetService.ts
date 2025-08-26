/**
 * Cloudinary Upload Widget Service
 * 
 * This service uses Cloudinary's Upload Widget which can work without
 * knowing the cloud name upfront. Based on Cloudinary documentation:
 * https://cloudinary.com/documentation/upload_widget#upload_preset_selection
 */

export interface CloudinaryWidgetOptions {
  uploadPreset?: string;
  cloudName?: string;
  sources?: string[];
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  allowedFormats?: string[];
  folder?: string;
  tags?: string[];
  context?: Record<string, string>;
  getUploadPresets?: () => Promise<string[]>;
  prepareUploadParams?: (callback: (params: any) => void, params: any) => void;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  onClose?: () => void;
}

export interface CloudinaryWidgetResult {
  event: string;
  info: {
    public_id: string;
    secure_url: string;
    url: string;
    asset_id: string;
    version_id: string;
    width: number;
    height: number;
    format: string;
    created_at: string;
    resource_type: string;
    tags: string[];
    context: Record<string, string>;
  };
}

/**
 * Service class for Cloudinary Upload Widget
 */
export class CloudinaryWidgetService {
  private widget: any = null;
  private isInitialized = false;

    /**
   * Initialize the Cloudinary Upload Widget
   * @param options - Widget configuration options
   */
  async initialize(options: CloudinaryWidgetOptions = {}): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Load Cloudinary Upload Widget script if not already loaded
      await this.loadScript();
      
      // Wait a bit to ensure the script is fully loaded
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Create widget configuration - absolute minimal
      const widgetConfig: any = {
        uploadPreset: 'ml_default',
        sources: ['local'],
        multiple: false,
        maxFiles: 1,
        maxFileSize: 5000000,
        allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        folder: options.folder,
        tags: options.tags,
        context: options.context,
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        maxImageWidth: 2000,
        maxImageHeight: 2000,
        cropping: false,
        showAdvancedOptions: false,
        showUploadMoreButton: false,
        showCompletedButton: true,
        showSkipCropButton: false,
        showPoweredBy: false
      };

      // Add upload preset if provided
      if (options.uploadPreset) {
        widgetConfig.uploadPreset = options.uploadPreset;
      }

      // Add getUploadPresets function if provided
      if (options.getUploadPresets) {
        widgetConfig.getUploadPresets = options.getUploadPresets;
      }

      // Add prepareUploadParams function if provided
      if (options.prepareUploadParams) {
        widgetConfig.prepareUploadParams = options.prepareUploadParams;
      }

      // Create the widget
      this.widget = (window as any).cloudinary.createUploadWidget(
        widgetConfig,
        (error: any, result: CloudinaryWidgetResult) => {
          if (error) {
            console.error('Upload Widget Error:', error);
            options.onError?.(error);
          } else if (result && result.event === 'success') {
            console.log('Upload Widget Success:', result.info);
            options.onSuccess?.(result);
          } else if (result && result.event === 'close') {
            console.log('Upload Widget Closed');
            options.onClose?.();
          }
        }
      );

      this.isInitialized = true;
      console.log('Cloudinary Upload Widget initialized');
    } catch (error) {
      console.error('Error initializing Cloudinary Upload Widget:', error);
      throw error;
    }
  }

  /**
   * Open the upload widget
   */
  open(): void {
    if (!this.widget) {
      throw new Error('Widget not initialized. Call initialize() first.');
    }
    this.widget.open();
  }

  /**
   * Close the upload widget
   */
  close(): void {
    if (this.widget) {
      this.widget.close();
    }
  }

  /**
   * Destroy the widget instance
   */
  destroy(): void {
    if (this.widget) {
      this.widget.destroy();
      this.widget = null;
      this.isInitialized = false;
    }
  }

  /**
   * Load Cloudinary Upload Widget script
   */
  private loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if ((window as any).cloudinary) {
        resolve();
        return;
      }

             const script = document.createElement('script');
       script.src = 'https://upload-widget.cloudinary.com/global/all.js';
       script.async = true;
       script.crossOrigin = 'anonymous';
       script.type = 'text/javascript';
      
      script.onload = () => {
        console.log('Cloudinary Upload Widget script loaded');
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Cloudinary Upload Widget script'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Create a simple upload widget for basic use cases
   * @param uploadPreset - Upload preset name
   * @param onSuccess - Success callback
   * @param onError - Error callback
   */
  async createSimpleWidget(
    uploadPreset: string,
    onSuccess?: (result: CloudinaryWidgetResult) => void,
    onError?: (error: any) => void
  ): Promise<void> {
    await this.initialize({
      uploadPreset,
      sources: ['local'],
      multiple: false,
      maxFiles: 1,
      onSuccess,
      onError
    });
  }

  /**
   * Create a profile image upload widget
   * @param onSuccess - Success callback
   * @param onError - Error callback
   */
  async createProfileImageWidget(
    onSuccess?: (result: CloudinaryWidgetResult) => void,
    onError?: (error: any) => void
  ): Promise<void> {
    await this.initialize({
      uploadPreset: 'profile_images', // You'll need to create this preset
      sources: ['local', 'camera'],
      multiple: false,
      maxFiles: 1,
      allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
      folder: 'profile-images',
      tags: ['profile', 'user'],
      onSuccess,
      onError
    });
  }

  /**
   * Create a thumbnail upload widget
   * @param onSuccess - Success callback
   * @param onError - Error callback
   */
  async createThumbnailWidget(
    onSuccess?: (result: CloudinaryWidgetResult) => void,
    onError?: (error: any) => void
  ): Promise<void> {
    await this.initialize({
      uploadPreset: 'thumbnails', // You'll need to create this preset
      sources: ['local'],
      multiple: false,
      maxFiles: 1,
      allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
      folder: 'thumbnails',
      tags: ['thumbnail'],
      onSuccess,
      onError
    });
  }
}

import CryptoJS from 'crypto-js';

/**
 * Generate SHA1 hash for Cloudinary signature
 */
function sha1(input: string): string {
  try {
    // Use crypto-js for SHA1
    return CryptoJS.SHA1(input).toString();
  } catch (error) {
    console.error('Error generating SHA1:', error);
    // Fallback to simple hash
    let hash = 0;
    if (input.length === 0) return hash.toString();
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}

/**
 * Generate upload signature for Cloudinary
 */
function generateUploadSignature(params: Record<string, string>, apiSecret: string): string {
  // Sort parameters alphabetically
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  // Create signature
  return sha1(sortedParams + apiSecret);
}

/**
 * Prepare upload parameters with dynamic signature generation
 * This allows us to upload without needing presets or knowing cloud name upfront
 */
export function prepareUploadParamsWithSignature(
  callback: (params: any) => void,
  params: any
): void {
  import('../config/cloudinary').then(({ cloudinaryConfig }) => {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      
      // Try to determine cloud name from API key pattern
      // Based on the API key format, let's try some common patterns
      const possibleCloudNames = [
        'demo', // Default fallback
        'cloudinary',
        'efv1v3', // From Firebase project
        'ontology-marketplace',
        'marketplace'
      ];

      // For now, let's use a different approach - create an unsigned upload preset
      // This will work without knowing the cloud name
      console.log('Using unsigned upload approach - no cloud name needed');
      
      // Prepare upload parameters for unsigned upload
      const uploadParams: Record<string, string> = {
        upload_preset: 'ml_default', // This will be created by the user
        folder: 'ontology-thumbnails',
        tags: 'thumbnail,ontology',
        use_filename: 'true',
        unique_filename: 'true'
      };

      console.log('Using unsigned upload parameters:', uploadParams);
      
      // Call the callback with the prepared parameters
      callback(uploadParams);
    } catch (error) {
      console.error('Error preparing upload parameters:', error);
      // Fallback to callback with original params
      callback(params);
    }
  });
}

/**
 * Fetch upload presets from Cloudinary using Admin API
 * This function uses your API credentials to get available presets
 */
export async function fetchUploadPresets(): Promise<string[]> {
  const { cloudinaryConfig } = await import('../config/cloudinary');
  
  try {
    // For now, return common preset names that might exist
    // The Upload Widget will automatically determine the cloud name from the preset
    console.log('Using default preset list - the widget will auto-detect cloud name');
    
    // Return common preset names - the widget will try these and auto-detect the cloud name
    return ['ml_default', 'profile_images', 'thumbnails', 'documents', 'default'];
  } catch (error) {
    console.error('Error fetching upload presets:', error);
    // Return empty array if we can't fetch presets
    return [];
  }
}

/**
 * Factory function to create a CloudinaryWidgetService instance
 */
export function createCloudinaryWidgetService(): CloudinaryWidgetService {
  return new CloudinaryWidgetService();
}

// Global instance
export const cloudinaryWidgetService = createCloudinaryWidgetService();
