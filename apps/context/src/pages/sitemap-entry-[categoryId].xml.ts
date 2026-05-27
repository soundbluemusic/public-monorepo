import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ params, redirect }) => {
  const { categoryId } = params;
  return redirect(`/sitemaps/entries/${categoryId}.xml`, 301);
};
