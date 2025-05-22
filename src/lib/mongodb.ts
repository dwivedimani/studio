
import { MongoClient, ServerApiVersion, type Db, type Collection } from 'mongodb';
import type { BlogPost } from '@/types/blog';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'mediseek_blog'; // You can make DB name configurable

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

interface MongoConnection {
  client: MongoClient;
  db: Db;
  blogsCollection: Collection<Omit<BlogPost, 'id'>>;
}

async function connectToDatabase(): Promise<MongoConnection> {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    // @ts-ignore
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
      // @ts-ignore
      global._mongoClientPromise = client.connect();
    }
    // @ts-ignore
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    if (!clientPromise) {
      client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
      clientPromise = client.connect();
    }
  }
  const connectedClient = await clientPromise;
  const db = connectedClient.db(dbName);
  const blogsCollection = db.collection<Omit<BlogPost, 'id'>>('blogs'); // Store posts without string 'id'
  return { client: connectedClient, db, blogsCollection };
}

export default connectToDatabase;
