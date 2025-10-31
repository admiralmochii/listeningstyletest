const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5050;
const app = express();


const corsOptions = {
  origin: ['http://192.168.11.3', 'http://127.0.0.1', "http://localhost:4173", "http://localhost:5173"],  // Allow requests from this address / このアドレスからのリクエストを許可する
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
});

router = express.Router()

initializeApp();

const db = getFirestore();

router.get("/test_results", async (req,res) => {

})
