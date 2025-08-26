/**
 * Firebase Functions Configuration
 * Centralized configuration for all Firebase Cloud Functions
 */

export const FIREBASE_FUNCTIONS = {
  // Ontology Management
  SEARCH_ONTOLOGIES: 'https://us-central1-ontology-marketplace-efv1v3.cloudfunctions.net/search_ontologies',
  ADD_ONTOLOGY: 'https://us-central1-ontology-marketplace-efv1v3.cloudfunctions.net/add_ontology',
  UPDATE_ONTOLOGY: 'https://us-central1-ontology-marketplace-efv1v3.cloudfunctions.net/update_ontology',
  DELETE_ONTOLOGY: 'https://us-central1-ontology-marketplace-efv1v3.cloudfunctions.net/delete_ontology',
  
  // URL Processing
  PROCESS_ONTOLOGY_URL: 'https://us-central1-ontology-marketplace-efv1v3.cloudfunctions.net/process_ontology_url',
  VALIDATE_ONTOLOGY_URL: 'https://us-central1-ontology-marketplace-efv1v3.cloudfunctions.net/validate_ontology_url',
  
  // Database Operations
  UPLOAD_TO_DATABASE: 'https://us-central1-ontology-marketplace-efv1v3.cloudfunctions.net/upload_ontology_to_database',
  EXPORT_FROM_DATABASE: 'https://us-central1-ontology-marketplace-efv1v3.cloudfunctions.net/export_from_database',
  
  // Cloudinary Integration
  GENERATE_CLOUDINARY_SIGNATURE: 'https://us-central1-ontology-marketplace-efv1v3.cloudfunctions.net/generate_cloudinary_signature',
  
  // Analytics and Monitoring
  TRACK_USAGE: 'https://us-central1-ontology-marketplace-efv1v3.cloudfunctions.net/track_usage',
  GET_ANALYTICS: 'https://us-central1-ontology-marketplace-efv1v3.cloudfunctions.net/get_analytics',
} as const;

/**
 * Firebase Function Call Helper
 * Provides a standardized way to call Firebase functions
 */
export class FirebaseFunctionCaller {
  private static async getAuthToken(): Promise<string> {
    // This would need to be imported from your auth service
    const { auth } = await import('../config/firebase');
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return await user.getIdToken();
  }

  /**
   * Make a call to a Firebase function
   */
  static async callFunction<T = any>(
    functionUrl: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      body?: any;
      headers?: Record<string, string>;
    } = {}
  ): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;
    
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(functionUrl, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...headers,
        },
        ...(body && { body: JSON.stringify(body) }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Firebase function call failed (${functionUrl}):`, error);
      throw error;
    }
  }

  /**
   * Search ontologies
   */
  static async searchOntologies() {
    return this.callFunction(FIREBASE_FUNCTIONS.SEARCH_ONTOLOGIES);
  }

  /**
   * Add ontology
   */
  static async addOntology(ontologyData: any) {
    return this.callFunction(FIREBASE_FUNCTIONS.ADD_ONTOLOGY, {
      method: 'POST',
      body: ontologyData,
    });
  }

  /**
   * Process ontology URL
   */
  static async processOntologyUrl(url: string, validateOnly = false) {
    return this.callFunction(FIREBASE_FUNCTIONS.PROCESS_ONTOLOGY_URL, {
      method: 'POST',
      body: { url, validateOnly },
    });
  }

  /**
   * Upload ontology to database
   */
  static async uploadToDatabase(ontologyId: string, targetDatabase: string, mergeStrategy: string) {
    return this.callFunction(FIREBASE_FUNCTIONS.UPLOAD_TO_DATABASE, {
      method: 'POST',
      body: { ontologyId, targetDatabase, mergeStrategy },
    });
  }

  /**
   * Generate Cloudinary signature
   */
  static async generateCloudinarySignature(params: any) {
    return this.callFunction(FIREBASE_FUNCTIONS.GENERATE_CLOUDINARY_SIGNATURE, {
      method: 'POST',
      body: { params },
    });
  }
}

