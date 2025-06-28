import { dbConnect } from "@/lib/db/mongoose";
import Departments from "@/lib/model/DepartmentData";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const reqData = await req.json();
  const loginUsername = reqData.username;
  const loginPassword = reqData.password;

  await dbConnect();

  const depIdData = await Departments.find(
    { userId: loginUsername, password: loginPassword },
    {
      _id: 0,
      depId: 1,
    }
  );

  // Check if no matching documents were found
  if (!depIdData || depIdData.length === 0) {
    return NextResponse.json({ error: "Invalid Creds" }, { status: 401 });
  }

  return NextResponse.json({ depId: depIdData }, { status: 200 });
}
