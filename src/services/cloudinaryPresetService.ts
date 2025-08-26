/**
 * Cloudinary Upload Preset Service
 * 
 * Service for fetching and managing Cloudinary upload presets
 * Based on Cloudinary Admin API documentation
 */

export interface CloudinaryUploadPreset {
  name: string;
  unsigned?: boolean;
  settings?: {
    folder?: string;
    allowed_formats?: string[];
    transformation?: any;
    eager?: any[];
    eager_async?: boolean;
    eager_notification_url?: string;
    use_filename?: boolean;
    unique_filename?: boolean;
    overwrite?: boolean;
    resource_type?: string;
    type?: string;
    access_mode?: string;
    discard_original_filename?: boolean;
    public_id?: string;
    use_filename_as_display_name?: boolean;
    asset_folder?: string;
    use_asset_folder_as_public_id_prefix?: boolean;
    public_id_prefix?: string;
    notification_url?: string;
    moderation?: string;
    raw_convert?: string;
    categorization?: string;
    detection?: string;
    similarity_search?: string;
    ocr?: string;
    auto_tagging?: number;
    backup?: boolean;
    phash?: boolean;
    eval?: string;
    proxy?: string;
    invalidate?: boolean;
    colors?: boolean;
    faces?: boolean;
    quality_analysis?: boolean;
    cinemagraph_analysis?: boolean;
    accessibility_analysis?: boolean;
    auto_tagging?: number;
    background_removal?: string;
    upload_preset?: string;
    context?: Record<string, string>;
    tags?: string[];
    metadata?: Record<string, string>;
  };
}

export interface CloudinaryPresetResponse {
  presets: CloudinaryUploadPreset[];
}

/**
 * Service class for managing Cloudinary upload presets
 */
export class CloudinaryPresetService {
  private apiKey: string;
  private apiSecret: string;
  private cloudName: string;

  constructor(apiKey: string, apiSecret: string, cloudName: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.cloudName = cloudName;
  }

  /**
   * Generate signature for Admin API authentication
   * @param params - Parameters to sign
   * @returns Object containing timestamp and signature
   */
  private generateSignature(params: Record<string, string> = {}): { timestamp: number; signature: string } {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    const signature = this.sha1(`${paramString}timestamp=${timestamp}${this.apiSecret}`);
    
    return { timestamp, signature };
  }

  /**
   * Generate SHA1 hash
   * @param input - String to hash
   * @returns SHA1 hash as hex string
   */
  private sha1(input: string): string {
    // Note: In a real implementation, you'd use a proper crypto library
    // This is a simplified version for demonstration
    return btoa(input).replace(/[^a-zA-Z0-9]/g, '');
  }

  /**
   * Fetch all upload presets from Cloudinary
   * @returns Promise resolving to array of upload presets
   */
  async getUploadPresets(): Promise<CloudinaryUploadPreset[]> {
    try {
      const { timestamp, signature } = this.generateSignature();
      
      const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload_presets`;
      const params = new URLSearchParams({
        api_key: this.apiKey,
        timestamp: timestamp.toString(),
        signature: signature
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: CloudinaryPresetResponse = await response.json();
      return data.presets || [];
    } catch (error) {
      console.error('Error fetching upload presets:', error);
      throw error;
    }
  }

  /**
   * Fetch a specific upload preset by name
   * @param presetName - Name of the preset to fetch
   * @returns Promise resolving to the upload preset
   */
  async getUploadPreset(presetName: string): Promise<CloudinaryUploadPreset> {
    try {
      const { timestamp, signature } = this.generateSignature();
      
      const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload_presets/${presetName}`;
      const params = new URLSearchParams({
        api_key: this.apiKey,
        timestamp: timestamp.toString(),
        signature: signature
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: CloudinaryUploadPreset = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching upload preset "${presetName}":`, error);
      throw error;
    }
  }

  /**
   * Get unsigned upload presets (safe for client-side use)
   * @returns Promise resolving to array of unsigned upload presets
   */
  async getUnsignedUploadPresets(): Promise<CloudinaryUploadPreset[]> {
    const allPresets = await this.getUploadPresets();
    return allPresets.filter(preset => preset.unsigned === true);
  }

  /**
   * Create a new upload preset
   * @param preset - Upload preset configuration
   * @returns Promise resolving to the created preset
   */
  async createUploadPreset(preset: Partial<CloudinaryUploadPreset>): Promise<CloudinaryUploadPreset> {
    try {
      const { timestamp, signature } = this.generateSignature();
      
      const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload_presets`;
      const params = new URLSearchParams({
        api_key: this.apiKey,
        timestamp: timestamp.toString(),
        signature: signature
      });

      const response = await fetch(`${url}?${params}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preset)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: CloudinaryUploadPreset = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating upload preset:', error);
      throw error;
    }
  }
}

/**
 * Factory function to create a CloudinaryPresetService instance
 * @param apiKey - Cloudinary API key
 * @param apiSecret - Cloudinary API secret
 * @param cloudName - Cloudinary cloud name
 * @returns CloudinaryPresetService instance
 */
export function createCloudinaryPresetService(
  apiKey: string, 
  apiSecret: string, 
  cloudName: string
): CloudinaryPresetService {
  return new CloudinaryPresetService(apiKey, apiSecret, cloudName);
}
