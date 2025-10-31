// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// HTTP Function - receives form data
exports.submitListeningTest = functions.https.onRequest( { cors: ["https://robotic-casing-476704-v4.web.app", "https://robotic-casing-476704-v4.firebaseapp.com"]}, async (req, res) => {
    // Enable CORS
    // res.set('Access-Control-Allow-Origin', 'https://robotic-casing-476704-v4.web.app');
    res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    try {
      if (req.method === 'POST') {
        const { email, scores, date, dominant_styles} = req.body;
        
        if (!email || !scores) {
          return res.status(400).json({ error: "Missing Required Fields!"})
        };


        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
          return res.status(400).json({ error: 'Invalid email format' });
        }
        
        const normalized_email = email.toLowerCase().trim().substring(0, 254);

        if (normalized_email.length < 3 || normalized_email.length > 254) {
          return res.status(400).json({ error: 'Invalid email length' });
        }

        if (typeof scores !== 'object' || !scores.A_total || !scores.B_total || 
          !scores.C_total || !scores.D_total || !scores.E_total || !scores.A_indv || 
          !scores.B_indv || !scores.C_indv || !scores.D_indv || !scores.E_indv ) {
          return res.status(400).json({ error: 'Invalid score data' });
        }

        if (!Array.isArray(dominant_styles) || dominant_styles.length === 0) {
          return res.status(400).json({ error: 'Invalid dominant styles' });
        }

        const validStyles = ['A', 'B', 'C', 'D', 'E'];
        const allValidStyles = dominant_styles.every(style => 
            validStyles.includes(style));  
          if (!allValidStyles) {
            return res.status(400).json({ error: 'Invalid style values' });
        }

        // Check if email already exists
        const snapshot = await admin.firestore()
            .collection('test_results')
            .where('email', '==', normalized_email)
            .get();
          
        if (!snapshot.empty) {
            //patch instead of post
            const docId = snapshot.docs[0].id;

            await admin.firestore().collection('test_results').doc(docId).update({
                email: normalized_email,
                scores: {
                  A_total: scores.A_total,
                  B_total: scores.B_total,
                  C_total: scores.C_total,
                  D_total: scores.D_total,
                  E_total: scores.E_total,
                  A_indv: scores.A_indv,
                  B_indv: scores.B_indv,
                  C_indv: scores.C_indv,
                  D_indv: scores.D_indv,
                  E_indv:scores.E_indv
                },
                dominant_styles: dominant_styles,
                submission_date: date,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
            
          return res.status(200).json({ success: true, message: "Submission Recorded Successfully!" });
        }        

        // Save to Firestore
        await admin.firestore().collection('test_results').add({
            email: normalized_email,
            scores: {
              A_total: scores.A_total,
              B_total: scores.B_total,
              C_total: scores.C_total,
              D_total: scores.D_total,
              E_total: scores.E_total,
              A_indv: scores.A_indv,
              B_indv: scores.B_indv,
              C_indv: scores.C_indv,
              D_indv: scores.D_indv,
              E_indv:scores.E_indv
            },
            dominant_styles: dominant_styles,
            submission_date: date,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
          
        return res.status(200).json({ success: true, message: "Submission Recorded Successfully!" });
      }
    } catch(error) {
      console.error("Error processing submission: ", error);
      return res.status(500).json({ error:"Internal Server Error. Please try again."})
    }

    if (req.method === "GET") {
      return res.status(200).json({success:true})
    }
});
