import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');
  const type = searchParams.get('type');

  // Validate secret (optional but recommended for security)
  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid secret', { status: 401 });
  }

  // Enable Draft Mode
  (await draftMode()).enable();

  // Redirect to the preview URL based on content type
  if (type === 'property') {
    redirect(slug ? `/properties/${slug}` : '/');
  } else if (type === 'beach') {
    redirect(slug ? `/beaches/${slug}` : '/');
  } else if (type === 'distillery') {
    redirect(slug ? `/distilleries/${slug}` : '/');
  } else if (type === 'walk') {
    redirect(slug ? `/walks/${slug}` : '/');
  } else if (type === 'village') {
    redirect(slug ? `/villages/${slug}` : '/');
  }

  // Default redirect
  redirect('/');
}
