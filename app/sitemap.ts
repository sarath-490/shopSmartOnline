import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Guide from '@/models/Guide';
import Category from '@/models/Category';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect();

  const baseUrl = process.env.APP_URL || 'https://shopsmartonline.com';

  const [guides, categories] = await Promise.all([
    Guide.find({ status: 'published' }).select('slug updatedAt').lean(),
    Category.find({}).select('slug updatedAt').lean(),
  ]);

  const guideUrls = guides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(guide.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(category.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const staticPages = [
    { url: '', priority: 1.0, changeFrequency: 'daily' },
    { url: '/guides', priority: 0.9, changeFrequency: 'daily' },
    { url: '/about', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/how-we-test', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/contact', priority: 0.5, changeFrequency: 'monthly' },
    { url: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
    { url: '/terms', priority: 0.3, changeFrequency: 'yearly' },
    { url: '/refund-policy', priority: 0.3, changeFrequency: 'yearly' },
    { url: '/affiliate-disclosure', priority: 0.3, changeFrequency: 'yearly' },
  ].map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency as any,
    priority: page.priority,
  }));

  return [
    ...staticPages,
    ...guideUrls,
    ...categoryUrls,
  ];
}
