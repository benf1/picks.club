// app/api/publish/route.ts
import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Origin',
  'Access-Control-Max-Age': '86400',
};

// Store data in memory
let picks = new Map();

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Validate the request body
function validateRequest(body: any) {
  if (!body.username || typeof body.username !== 'string') {
    return 'Username is required';
  }
  
  if (!body.pages || !Array.isArray(body.pages)) {
    return 'Pages must be an array';
  }
  
  if (body.pages.length === 0) {
    return 'At least one page is required';
  }
  
  for (const page of body.pages) {
    if (!page.name || !page.image) {
      return 'Each page must have a name and image';
    }
  }
  
  return null;
}

// Handle POST requests
export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate request
    const validationError = validateRequest(body);
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400, headers: corsHeaders }
      );
    }

    const { username, pages } = body;
    
    // Store the picks in memory
    picks.set(username, pages);
    
    // Log for debugging
    console.log(`Stored ${pages.length} picks for user ${username}`);
    
    return NextResponse.json(
      {
        success: true,
        message: `Successfully published ${pages.length} picks for ${username}`,
        url: `/${username}`
      },
      { headers: corsHeaders }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle GET requests to fetch picks
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const username = url.pathname.split('/').pop();

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const userPicks = picks.get(username);
    
    if (!userPicks) {
      return NextResponse.json(
        { success: false, error: 'No picks found for this user' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, picks: userPicks },
      { headers: corsHeaders }
    );
    
  } catch (error) {
    console.error('Error fetching picks:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch picks',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
