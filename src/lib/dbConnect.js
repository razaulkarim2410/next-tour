// src/lib/dbConnect.js
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

export const collectionNameObj = {
  products: "products",
};

export default function dbConnect(collectionName) {
  return client.db(process.env.MONGODB_DB).collection(collectionName);
}
