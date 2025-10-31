// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// HTTP Function - receives form data
exports.submitListeningTest = functions.https.onRequest(async (req, res) => {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', 'https://robotic-casing-476704-v4.web.app');
    
    if (req.method === 'POST') {
      const { email, results} = req.body;
        
      // Check if email already exists
      const snapshot = await admin.firestore()
          .collection('test_results')
          .where('email', '==', email)
          .get();
        
      if (!snapshot.empty) {
          //patch instead of post

          return res.status(200).json({ success: true })
      }        

      // Save to Firestore
      await admin.firestore().collection('test_results').add({
          email: email,
          results: results,
          timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
        
      return res.status(200).json({ success: true });
    }

    if (req.method === "GET") {
      return res.status(200).json({success:true})
    }
});
