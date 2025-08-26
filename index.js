const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const cors = require('cors')({ 
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
});

// Initialize Firebase Admin
admin.initializeApp();

// Cloudinary configuration
const CLOUDINARY_CONFIG = {
  cloud_name: 'dpy6hjz0c',
  api_key: '437525635911614',
  api_secret: 'ahL6jaoclt0G92E1KOxQ13gq1uY'
};

/**
 * Generate Cloudinary signature for signed uploads
 */
function generateCloudinarySignature(params) {
  const crypto = require('crypto');
  
  // Sort parameters alphabetically
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  // Create signature
  return crypto.createHash('sha1')
    .update(sortedParams + CLOUDINARY_CONFIG.api_secret)
    .digest('hex');
}

/**
 * Search ontologies function
 */
exports.search_ontologies = onRequest(async (req, res) => {
  return cors(req, res, async () => {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      res.set('Access-Control-Max-Age', '3600');
      res.status(204).send('');
      return;
    }

    try {
      // Verify authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      console.log('Authenticated user:', decodedToken.uid);

      // Get ontologies from Firestore
      const ontologiesRef = admin.firestore().collection('ontologies');
      const snapshot = await ontologiesRef.get();
      
      const ontologies = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        ontologies.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
        });
      });

      res.json({
        success: true,
        ontologies: ontologies
      });

    } catch (error) {
      console.error('Error in search_ontologies:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

/**
 * Add ontology function
 */
exports.add_ontology = onRequest(async (req, res) => {
  return cors(req, res, async () => {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      res.set('Access-Control-Max-Age', '3600');
      res.status(204).send('');
      return;
    }

    try {
      // Verify authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      console.log('Authenticated user:', decodedToken.uid);

      const { title, description, file_url, thumbnail_url, is_public = true } = req.body;

      if (!title || !description || !file_url) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      // Add ontology to Firestore
      const ontologyData = {
        title,
        description,
        file_url,
        thumbnail_url: thumbnail_url || '',
        is_public,
        ownerId: decodedToken.uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const docRef = await admin.firestore().collection('ontologies').add(ontologyData);

      res.json({
        success: true,
        ontologyId: docRef.id,
        message: 'Ontology added successfully'
      });

    } catch (error) {
      console.error('Error in add_ontology:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

/**
 * Generate Cloudinary signature for signed uploads
 */
exports.generate_cloudinary_signature = onRequest(async (req, res) => {
  return cors(req, res, async () => {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      res.set('Access-Control-Max-Age', '3600');
      res.status(204).send('');
      return;
    }

    try {
      // Verify authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      console.log('Generating signature for user:', decodedToken.uid);

      const { params } = req.body;

      if (!params) {
        res.status(400).json({ error: 'Missing params' });
        return;
      }

      // Add timestamp if not present
      if (!params.timestamp) {
        params.timestamp = Math.round(Date.now() / 1000).toString();
      }

      // Generate signature
      const signature = generateCloudinarySignature(params);

      res.json({
        success: true,
        signature,
        timestamp: params.timestamp,
        api_key: CLOUDINARY_CONFIG.api_key
      });

    } catch (error) {
      console.error('Error generating signature:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});
