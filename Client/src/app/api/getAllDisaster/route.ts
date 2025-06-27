import { NextRequest, NextResponse } from 'next/server';
import SaveDisasters from '@/lib/model/SaveDisaster';
import { dbConnect } from '@/lib/db/mongoose';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Fetch all disasters with only name, severity, and createdAt fields
    const disasters = await SaveDisasters.find({}, {
      name: 1,
      activeStatus: 1,
      severity: 1,
      createdAt: 1,
      _id: 1
    }).sort({ createdAt: -1 });

    console.log(disasters);

    return NextResponse.json(
      {
        success: true,
        disasters: disasters,
        count: disasters.length
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching disasters:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch disasters',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
