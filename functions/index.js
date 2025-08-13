const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();

/**
 * Search for ontologies - returns all ontologies a user creates or public ontologies
 */
exports.search_ontologies = onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      // Verify authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized - No valid token provided' });
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      
      // Verify the Firebase ID token
      const decodedToken = await admin.auth().verifyIdToken(token);
      const userId = decodedToken.uid;

      console.log('Searching ontologies for user:', userId);

      // Get ontologies from Firestore
      const ontologiesRef = db.collection('ontologies');
      const snapshot = await ontologiesRef
        .where('is_public', '==', true)
        .get();

      const publicOntologies = [];
      snapshot.forEach(doc => {
        publicOntologies.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Also get user's private ontologies
      const userOntologiesSnapshot = await ontologiesRef
        .where('ownerId', '==', userId)
        .get();

      const userOntologies = [];
      userOntologiesSnapshot.forEach(doc => {
        userOntologies.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Combine and remove duplicates
      const allOntologies = [...publicOntologies, ...userOntologies];
      const uniqueOntologies = allOntologies.filter((ontology, index, self) => 
        index === self.findIndex(o => o.id === ontology.id)
      );

      console.log(`Found ${uniqueOntologies.length} ontologies`);
      
      res.status(200).json({
        success: true,
        ontologies: uniqueOntologies
      });

    } catch (error) {
      console.error('Error in search_ontologies:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        details: error.message 
      });
    }
  });
});

/**
 * Add a new ontology
 */
exports.add_ontology = onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      // Verify authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized - No valid token provided' });
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      
      // Verify the Firebase ID token
      const decodedToken = await admin.auth().verifyIdToken(token);
      const userId = decodedToken.uid;

      console.log('Adding ontology for user:', userId);

      // Validate request body
      const { name, description, properties } = req.body;
      
      if (!name || !description) {
        res.status(400).json({ error: 'Name and description are required' });
        return;
      }

      // Create ontology document
      const ontologyData = {
        name: name.trim(),
        description: description.trim(),
        properties: {
          source_url: properties?.source_url || '',
          image_url: properties?.image_url || '',
          is_public: properties?.is_public || false
        },
        ownerId: userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      // Add to Firestore
      const docRef = await db.collection('ontologies').add(ontologyData);
      
      const newOntology = {
        id: docRef.id,
        ...ontologyData
      };

      console.log('Ontology created with ID:', docRef.id);
      
      res.status(201).json({
        success: true,
        ontology: newOntology
      });

    } catch (error) {
      console.error('Error in add_ontology:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        details: error.message 
      });
    }
  });
});
