import dotenv from 'dotenv';
import admin from 'firebase-admin'
import serviceAccount from './firebase/ecommerce-db2-f8fe9-firebase-adminsdk-yarzw-3b93564996.js'
import mongoose from 'mongoose';


dotenv.config();



//prueba de conexion firebase
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Connected ok to Firebase");
} catch (error) {
  console.log(error);
}

//prueba de conexion mongo
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:')); 
db.once('open', () => {
  console.log('Connected ok to mongoDB'); 
});



export const config = {
    mongo: {
      uri: process.env.MONGO_URI_STRING,
      options: { useNewUrlParser: true, useUnifiedTopology: true }
    },
    firebase: {
      db: admin.firestore()
    }
  }