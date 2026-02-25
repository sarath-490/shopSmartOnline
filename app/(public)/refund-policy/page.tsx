export const metadata = {
    title: 'Refund Policy | Shop Smart Online',
};

export default function RefundPolicyPage() {
    return (
        <div className="bg-stone-50 min-h-screen py-20 px-4 md:px-6">
            <div className="container mx-auto max-w-4xl bg-white rounded-[40px] p-10 md:p-16 border border-stone-100 shadow-sm">
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-8 italic">
                    Refund <span className="text-emerald-600">Policy.</span>
                </h1>

                <div className="prose prose-emerald max-w-none text-stone-500 leading-relaxed">
                    <p className="font-bold text-gray-900">Effective Date: February 24, 2026</p>

                    <p>Since Shop Smart Online is a content-based review platform and does not directly sell physical or digital products, our refund policy pertains specifically to our operational role.</p>

                    <h2>1. Third-Party Purchases</h2>
                    <p>Shop Smart Online provides expert reviews and affiliate links to third-party retailers (such as Amazon). We never handle your payment for these products. Any requests for refunds, returns, or exchanges of products purchased through our affiliate links must be directed to the retailer where the purchase was made.</p>

                    <h2>2. Advertising & Sponsorships</h2>
                    <p>If you are a business that has purchased advertising space or sponsored content on Shop Smart Online, refunds will only be issued if the content was not published according to the agreed-upon timeline or quality standards specified in your individual contract.</p>

                    <h2>3. Contact Us</h2>
                    <p>If you have any questions about how we handle product recommendations, please contact us at hello@shopsmartonline.com.</p>
                </div>
            </div>
        </div>
    );
}
