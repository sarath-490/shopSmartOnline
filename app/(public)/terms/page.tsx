export const metadata = {
    title: 'Terms & Conditions | Shop Smart Online',
};

export default function TermsPage() {
    return (
        <div className="bg-stone-50 min-h-screen py-20 px-4 md:px-6">
            <div className="container mx-auto max-w-4xl bg-white rounded-[40px] p-10 md:p-16 border border-stone-100 shadow-sm">
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-8 italic">
                    Terms of <span className="text-emerald-600">Service.</span>
                </h1>

                <div className="prose prose-emerald max-w-none text-stone-500 leading-relaxed">
                    <p className="font-bold text-gray-900">Effective Date: February 24, 2026</p>

                    <p>Welcome to Shop Smart Online. By accessing this website (shopsmartonline.com), you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>

                    <h2>1. Use License</h2>
                    <p>Permission is granted to temporarily download one copy of the materials (information or software) on Shop Smart Online&apos;s website for personal, non-commercial transitory viewing only.</p>

                    <h2>2. Disclaimer</h2>
                    <p>The materials on Shop Smart Online&apos;s website are provided on an &apos;as is&apos; basis. Shop Smart Online makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

                    <h2>3. Affiliate Disclosure</h2>
                    <p>Shop Smart Online participates in the Amazon Services LLC Associates Program and other affiliate programs. We earn commissions from qualifying purchases made through links on our site.</p>

                    <h2>4. Limitations</h2>
                    <p>In no event shall Shop Smart Online or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Shop Smart Online&apos;s website.</p>
                </div>
            </div>
        </div>
    );
}
