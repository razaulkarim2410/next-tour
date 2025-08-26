// src/app/api/products/route.js
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

// GET all products
export async function GET() {
  const productsCollection = dbConnect(collectionNameObj.products);
  const products = await productsCollection.find({}).toArray();
  return NextResponse.json(products);
}

// POST add product
export async function POST(req) {
  const productsCollection = dbConnect(collectionNameObj.products);
  const body = await req.json();
  const result = await productsCollection.insertOne(body);
  return NextResponse.json(result, { status: 201 });
}
