import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Review from "@/models/Review";

// GET /api/reviews?productId=xxx
export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ message: "productId is required" }, { status: 400 });
    }

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

    const calculatedAverage =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    return NextResponse.json({
      reviews,
      calculatedAverage: parseFloat(calculatedAverage.toFixed(1)),
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ message: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST /api/reviews
export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const { productId, userName, rating, comment } = body;

    if (!productId || !rating || !userName || !comment) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    const newReview = await Review.create({ productId, userName, rating, comment });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("Error saving review:", error);
    return NextResponse.json({ message: "Failed to save review" }, { status: 500 });
  }
}
