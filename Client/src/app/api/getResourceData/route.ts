import { dbConnect } from "@/lib/db/mongoose";
import SaveDisasters from "@/lib/model/SaveDisaster";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const reqData = await req.json();
  const disasterId = reqData.id;

  await dbConnect();

  const resourceData = await SaveDisasters.find(
    { _id: disasterId },
    {
      _id: 0,
      foodHave: 1,
      foodRequired: 1,
      waterHave: 1,
      waterRequired: 1,
      medicalHave: 1,
      medicalRequired: 1,
      shelterHave: 1,
      shelterRequired: 1,
      blanketsHave: 1,
      blanketsRequired: 1,
      rescuePersonnelHave: 1,
      rescuePersonnelRequired: 1,
    }
  );

  return NextResponse.json({ data: resourceData }, { status: 200 });
}
