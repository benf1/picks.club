// app/api/publish/route.js
export const dynamic = 'force-dynamic';

// Define headers once to reuse
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// Handle POST requests
export async function POST(request) {
  try {
    // Parse the incoming request
    const { username, pages } = await request.json();
    
    // Log the received data
    console.log('Received data for username:', username);
    console.log('Number of pages:', pages.length);
    
    // Process pages
    pages.forEach((page, index) => {
      console.log(`Page ${index + 1}: ${page.name}`);
      // The image is available as page.image (base64 string)
    });

    // Send success response
    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully published ${pages.length} pages for ${username}`,
        url: `https://picks-club.vercel.app/${username}`
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
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to process request',
        details: error.message
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

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    headers: corsHeaders
  });
}

// Handle GET requests
export async function GET() {
  return new Response(
    JSON.stringify({ 
      status: 'API is working',
      message: 'Send a POST request with username and pages data to publish'
    }),
    {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    }
  );
}
