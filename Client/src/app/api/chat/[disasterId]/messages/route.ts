import { dbConnect } from "@/lib/db/mongoose";
import ChatMessage from "@/lib/model/ChatMessage";
import Departments from "@/lib/model/DepartmentData";
import DisasterMember from "@/lib/model/DisasterMember";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch messages for a disaster
export async function GET(
  req: NextRequest,
  { params }: { params: { disasterId: Promise<{ disasterId: string }> } }
) {
  try {
    await dbConnect();
    const { disasterId } = await params;

    const messages = await ChatMessage.find({ disasterId })
      .sort({ timestamp: 1 })
      .limit(100)
      .lean();

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST - Send a new message
export async function POST(
  req: NextRequest,
  { params }: { params: { disasterId: Promise<{ disasterId: string }> } }
) {
  try {
    await dbConnect();
    const { disasterId } = await params;
    const { text, userId, departmentId } = await req.json();

    // Validate department exists
    const department = await Departments.findOne({
      userId,
      depId: departmentId,
    });

    if (!department) {
      return NextResponse.json(
        { error: "Invalid department credentials" },
        { status: 401 }
      );
    }

    // Add user to disaster members if not already added
    await DisasterMember.findOneAndUpdate(
      { disasterId, userId },
      {
        disasterId,
        userId,
        userName: department.name,
        departmentId,
        isActive: true,
      },
      { upsert: true, new: true }
    );

    // Create new message
    const newMessage = new ChatMessage({
      disasterId,
      text,
      userId,
      userName: department.name,
      departmentId,
    });

    await newMessage.save();

    return NextResponse.json({ message: newMessage }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
