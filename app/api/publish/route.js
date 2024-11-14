// app/api/publish/route.js
export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://www.figma.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Access-Control-Max-Age': '86400'
};

// Validate the request body
function validateRequest(body) {
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

// Handle OPTIONS requests
export async function OPTIONS() {
  return new Response(null, {
    headers: corsHeaders
  });
}

// Handle POST requests
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationError = validateRequest(body);
    if (validationError) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: validationError 
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const { username, pages } = body;
    
    // Log the request
    console.log(`Processing ${pages.length} pages for user ${username}`);
    pages.forEach((page, index) => {
      console.log(`Page ${index + 1}: ${page.name}`);
    });

    // Here you would typically:
    // 1. Save the images to your storage (e.g., S3, Cloudinary)
    // 2. Save the metadata to your database
    // 3. Generate the user's gallery page
    
    // For now, we'll just return success
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
