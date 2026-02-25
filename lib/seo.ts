/**
 * SEO utility functions for Shop Smart Online
 */

const BASE_URL = process.env.APP_URL || 'https://shopsmartonline.com';

/** Calculate estimated reading time from HTML content */
export function calculateReadingTime(htmlContent: string): number {
    const text = htmlContent.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 220));
}

/** Generate Article JSON-LD schema */
export function generateArticleSchema(guide: {
    title: string;
    slug: string;
    summary: string;
    content: string;
    featuredImage?: string;
    publishDate?: Date | string;
    updatedAt: Date | string;
    author?: { name: string };
    ratingScore?: number;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: guide.title,
        description: guide.summary,
        image: guide.featuredImage || undefined,
        author: {
            '@type': 'Person',
            name: guide.author?.name || 'Shop Smart Online Team',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Shop Smart Online',
            url: BASE_URL,
        },
        datePublished: guide.publishDate
            ? new Date(guide.publishDate).toISOString()
            : new Date(guide.updatedAt).toISOString(),
        dateModified: new Date(guide.updatedAt).toISOString(),
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${BASE_URL}/guides/${guide.slug}`,
        },
    };
}

/** Generate Product Review JSON-LD schema */
export function generateProductSchema(guide: {
    title: string;
    summary: string;
    ratingScore?: number;
    quickRecommendation?: {
        productName?: string;
        affiliateLink?: string;
        reason?: string;
    };
}) {
    if (!guide.quickRecommendation?.productName) return null;

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: guide.quickRecommendation.productName,
        description: guide.quickRecommendation.reason || guide.summary,
        review: {
            '@type': 'Review',
            reviewRating: {
                '@type': 'Rating',
                ratingValue: guide.ratingScore || 8,
                bestRating: 10,
            },
            author: {
                '@type': 'Organization',
                name: 'Shop Smart Online',
            },
        },
    };
}

/** Generate FAQ JSON-LD schema from content */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
    if (!faqs.length) return null;

    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}

/** Generate Breadcrumb JSON-LD schema */
export function generateBreadcrumbSchema(
    items: Array<{ name: string; url: string }>
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
        })),
    };
}

/** Extract FAQs from HTML (looks for h3 with answers) */
export function extractFAQsFromContent(html: string): Array<{ question: string; answer: string }> {
    const faqs: Array<{ question: string; answer: string }> = [];
    // Match patterns like <h3>Question?</h3><p>Answer</p>
    const regex = /<h3[^>]*>(.*?\?)<\/h3>\s*<p[^>]*>(.*?)<\/p>/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
        faqs.push({
            question: match[1].replace(/<[^>]*>/g, '').trim(),
            answer: match[2].replace(/<[^>]*>/g, '').trim(),
        });
    }
    return faqs;
}
