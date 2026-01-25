import { defineEnableDraftMode } from 'next-sanity/draft-mode';
import { createClient } from 'next-sanity';
import { NextRequest, NextResponse } from 'next/server';

// Create a client with token for draft mode validation
const clientWithToken = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Token with Viewer permissions
});

const { GET: baseGET } = defineEnableDraftMode({
  client: clientWithToken,
});

// Wrap the GET handler to add custom redirect logic
export async function GET(request: NextRequest) {
  // Call the base handler to enable draft mode
  const response = await baseGET(request);
  
  // Get search params for redirect logic
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get('slug');
  const type = searchParams.get('type');

  // Determine redirect URL based on content type
  let redirectUrl = '/';
  if (type === 'property') {
    redirectUrl = slug ? `/accommodation/${slug}` : '/';
  } else if (type === 'beach') {
    redirectUrl = slug ? `/beaches/${slug}` : '/';
  } else if (type === 'distillery') {
    redirectUrl = slug ? `/distilleries/${slug}` : '/';
  } else if (type === 'walk') {
    redirectUrl = slug ? `/walks/${slug}` : '/';
  } else if (type === 'village') {
    redirectUrl = slug ? `/villages/${slug}` : '/';
  }

  // Return redirect response
  return NextResponse.redirect(new URL(redirectUrl, request.url));
}
