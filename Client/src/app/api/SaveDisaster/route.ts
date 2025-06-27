import { dbConnect } from "@/lib/db/mongoose";
import SaveDisasters, { ISaveDisaster } from "@/lib/model/SaveDisaster";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Getting disaster data
    const disasterData = await req.json();

    // Check if required fields are present
    if (
      !disasterData.name ||
      !disasterData.severity ||
      disasterData.foodHave === undefined ||
      disasterData.foodRequired === undefined ||
      disasterData.waterHave === undefined ||
      disasterData.waterRequired === undefined ||
      disasterData.medicalHave === undefined ||
      disasterData.medicalRequired === undefined ||
      disasterData.shelterHave === undefined ||
      disasterData.shelterRequired === undefined ||
      disasterData.blanketsHave === undefined ||
      disasterData.blanketsRequired === undefined ||
      disasterData.rescuePersonnelHave === undefined ||
      disasterData.rescuePersonnelRequired === undefined
    )
      return NextResponse.json(
        { error: "Invalid info received by API! Missing required fields." },
        { status: 400 }
      );

    // Connect to database
    await dbConnect();

    // Create new disaster record
    const newDisaster: ISaveDisaster = new SaveDisasters({
      name: disasterData.name,
      activeStatus: "active",
      severity: disasterData.severity,
      foodHave: disasterData.foodHave,
      foodRequired: disasterData.foodRequired,
      waterHave: disasterData.waterHave,
      waterRequired: disasterData.waterRequired,
      medicalHave: disasterData.medicalHave,
      medicalRequired: disasterData.medicalRequired,
      shelterHave: disasterData.shelterHave,
      shelterRequired: disasterData.shelterRequired,
      blanketsHave: disasterData.blanketsHave,
      blanketsRequired: disasterData.blanketsRequired,
      rescuePersonnelHave: disasterData.rescuePersonnelHave,
      rescuePersonnelRequired: disasterData.rescuePersonnelRequired,
    });

    await newDisaster.save();

    return NextResponse.json({
      message: "Disaster registered successfully",
      disasterId: newDisaster._id,
      status: 200,
    });
  } catch (err) {
    // Logging error
    console.error(err instanceof Error ? err.message : String(err));

    // Sending server error response
    return NextResponse.json(
      { error: "Internal Server error!" },
      { status: 500 }
    );
  }
}
