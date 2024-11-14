export async function POST(request) {
  try {
    const { username, pages } = await request.json();
    
    // Just store the last submission for now
    // You can see it in Vercel's Logs
    console.log('Received picks for:', username);
    console.log('Pages:', pages);

    return Response.json({ 
      success: true,
      message: `Published at picks.club/${username}`
    });

  } catch (error) {
    return Response.json({ 
      error: 'Failed to publish' 
    }, { 
      status: 500 
    });
  }
}
