import mongoose from 'mongoose';
import { ENV } from './env.js';

// Globális változó a kapcsolat állapotának gyorsítótárazásához
let isConnected = false;

export const connectDB = async () => {
  // 1. Ha már van élő kapcsolat, ne csináljunk semmit
  if (isConnected || mongoose.connection.readyState === 1) {
    console.log('MongoDB: Már kapcsolódva vagyunk (gyorsítótárból)');
    return;
  }

  try {
    const { MONGO_URI } = ENV;
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not set in environment variables');
    }

    // Kapcsolódás opciókkal, amelyek optimalizálják a serverless működést
    const conn = await mongoose.connect(MONGO_URI, {
      bufferCommands: false, // Ne várjon a parancsokkal, ha megszakad a kapcsolat
    });

    isConnected = true;
    console.log('Connected to MongoDB:', conn.connection.host);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    // ❌ FONTOS: Serverless környezetben NE használd a process.exit(1)-et!
    // Inkább dobjuk tovább a hibát, hogy az Express catch blokkja kezelni tudja
    throw error; 
  }
}
