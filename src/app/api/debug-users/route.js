import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.js";


export async function GET() {
  try {
    console.log("🔹 Fetching all users for debugging...");
    await dbConnect();

    const users = await User.find({}, { email: 1, name: 1 }).lean();
    console.log("✅ Users found:", users);

    return Response.json({ users });
  } catch (error) {
    console.error("❌ Error in /debug-users:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch users", details: error.message }),
      { status: 500 }
    );
  }
}
