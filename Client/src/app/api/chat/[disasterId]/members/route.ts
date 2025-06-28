import { dbConnect } from "@/lib/db/mongoose";
import DisasterMember from "@/lib/model/DisasterMember";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch active members for a disaster
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ disasterId: string }> }
) {
  try {
    await dbConnect();
    const { disasterId } = await params; // Add await here
    
    const members = await DisasterMember.find({ 
      disasterId, 
      isActive: true 
    }).lean();

    return NextResponse.json({ members }, { status: 200 });
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}
