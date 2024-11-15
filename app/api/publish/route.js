// app/api/publish/route.ts
import { NextResponse } from 'next/server';

// Store data in memory
let picks = new Map();

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400'
};

// Handle preflight requests
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

// Handle POST requests
export async function POST(request: Request) {
  // Add CORS headers to all responses
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const body = await request.json();
    const { username, pages } = body;
    
    // Store the picks in memory
    picks.set(username, pages);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully published ${pages.length} picks for ${username}`,
        url: `/${username}`
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// Handle GET requests
export async function GET(request: Request) {
  // Add CORS headers to all responses
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const url = new URL(request.url);
    const username = url.pathname.split('/').pop();

    const userPicks = picks.get(username);
    
    if (!userPicks) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No picks found for this user'
        }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        picks: userPicks
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to fetch picks',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
