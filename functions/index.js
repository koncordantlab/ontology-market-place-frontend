const { onRequest } = require('firebase-functions/v2/https');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ 
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

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

/**
 * Update an existing ontology 
 */
exports.update_ontology = functions.https.onRequest((req, res) => {
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

      console.log('Updating ontology for user:', userId);

      // Get ontology ID from URL path or body
      const ontologyId = req.body.id || req.query.id;
      
      if (!ontologyId) {
        res.status(400).json({ error: 'Ontology ID is required' });
        return;
      }

      // Validate request body
      const { name, description, properties, tags } = req.body;
      
      if (!name || !description) {
        res.status(400).json({ error: 'Name and description are required' });
        return;
      }

      // Check if ontology exists and user owns it
      const ontologyRef = db.collection('ontologies').doc(ontologyId);
      const ontologyDoc = await ontologyRef.get();

      if (!ontologyDoc.exists) {
        res.status(404).json({ error: 'Ontology not found' });
        return;
      }

      const ontologyData = ontologyDoc.data();
      if (ontologyData.ownerId !== userId) {
        res.status(403).json({ error: 'You can only update your own ontologies' });
        return;
      }

      // Prepare update data
      const updateData = {
        name: name.trim(),
        description: description.trim(),
        tags: tags || [],
        properties: {
          source_url: properties?.source_url || '',
          image_url: properties?.image_url || '',
          is_public: properties?.is_public !== undefined ? properties.is_public : ontologyData.properties?.is_public || false
        },
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      // Update the ontology
      await ontologyRef.update(updateData);

      // Get updated document
      const updatedDoc = await ontologyRef.get();
      const updatedOntology = {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };

      console.log('Ontology updated:', ontologyId);
      
      res.status(200).json({
        success: true,
        ontology: updatedOntology
      });

    } catch (error) {
      console.error('Error in update_ontology:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        details: error.message 
      });
    }
  });
});

/**
 * Delete an ontology
 */
exports.delete_ontology = onRequest((req, res) => {
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

      console.log('Deleting ontology for user:', userId);

      // Get ontology ID from URL path or body
      const ontologyId = req.body.id || req.query.id;
      
      if (!ontologyId) {
        res.status(400).json({ error: 'Ontology ID is required' });
        return;
      }

      // Check if ontology exists and user owns it
      const ontologyRef = db.collection('ontologies').doc(ontologyId);
      const ontologyDoc = await ontologyRef.get();

      if (!ontologyDoc.exists) {
        res.status(404).json({ error: 'Ontology not found' });
        return;
      }

      const ontologyData = ontologyDoc.data();
      if (ontologyData.ownerId !== userId) {
        res.status(403).json({ error: 'You can only delete your own ontologies' });
        return;
      }

      // Delete the ontology
      await ontologyRef.delete();

      console.log('Ontology deleted:', ontologyId);
      
      res.status(200).json({
        success: true,
        message: 'Ontology deleted successfully'
      });

    } catch (error) {
      console.error('Error in delete_ontology:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        details: error.message 
      });
    }
  });
});

