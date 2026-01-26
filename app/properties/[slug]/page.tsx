import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Legacy route - redirects to canonical /accommodation/ URL
 */
export default async function PropertyRedirect({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/accommodation/${slug}`);
}
