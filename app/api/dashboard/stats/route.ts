import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Guide from '@/models/Guide';
import AffiliateLink from '@/models/AffiliateLink';
import Category from '@/models/Category';
import ClickTracking from '@/models/ClickTracking';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const [
            totalGuides,
            publishedGuides,
            draftGuides,
            totalCategories,
            totalClicks,
            recentGuides,
        ] = await Promise.all([
            Guide.countDocuments({}),
            Guide.countDocuments({ status: 'published' }),
            Guide.countDocuments({ status: 'draft' }),
            Category.countDocuments({}),
            AffiliateLink.aggregate([
                { $group: { _id: null, total: { $sum: '$clickCount' } } },
            ]),
            Guide.find({})
                .populate('category', 'name slug')
                .populate('author', 'name')
                .sort({ updatedAt: -1 })
                .limit(5)
                .lean(),
        ]);

        // Get top guide by affiliate clicks
        const topGuideResult = await ClickTracking.aggregate([
            { $match: { guide: { $ne: null } } },
            { $group: { _id: '$guide', clicks: { $sum: 1 } } },
            { $sort: { clicks: -1 } },
            { $limit: 1 },
        ]);

        let topGuide = null;
        if (topGuideResult.length > 0) {
            topGuide = await Guide.findById(topGuideResult[0]._id)
                .select('title slug')
                .lean();
        }
        if (!topGuide && recentGuides.length > 0) {
            topGuide = { title: (recentGuides[0] as any).title, slug: (recentGuides[0] as any).slug };
        }

        // Get top category
        const topCategoryResult = await Guide.aggregate([
            { $match: { status: 'published' } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 },
        ]);

        let topCategory = null;
        if (topCategoryResult.length > 0) {
            topCategory = await Category.findById(topCategoryResult[0]._id)
                .select('name slug')
                .lean();
        }

        return NextResponse.json({
            totalGuides,
            publishedGuides,
            draftGuides,
            totalCategories,
            totalClicks: totalClicks[0]?.total || 0,
            topGuide: topGuide || { title: 'N/A', slug: '' },
            topCategory: topCategory || { name: 'N/A', slug: '' },
            recentGuides,
        });
    } catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
