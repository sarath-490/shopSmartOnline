# Shop Smart Online 🛒

Shop Smart Online is a modern, high-performance affiliate blogging platform designed to help users find the best products through expert guides and reviews. Built with Next.js 15, it prioritizes SEO, speed, and a premium user experience.

## ✨ Features

- **🚀 Modern Tech Stack**: Built with Next.js 15, React 19, and TypeScript.
- **📝 Expert Guides**: Fully SEO-optimized blog system with support for categories and tags.
- **📊 Admin Dashboard**: Comprehensive management interface for content, categories, and affiliate links.
- **🔗 Affiliate Integration**: Seamless management of affiliate links with built-in click tracking.
- **🔍 SEO Ready**: Automated sitemaps, RSS feeds, and dynamic meta tags for maximum visibility.
- **🎨 Premium UI**: Elegant design using Tailwind CSS, Framer Motion, and Lucide icons.
- **🔒 Secure**: Robust authentication system using JWT and Bcrypt.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Auth**: JWT (Jose) & BcryptJS

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sarath-490/shopSmartOnline.git
   cd shop-smart-online
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   APP_URL=http://localhost:3000
   ADMIN_EMAIL=email
   ADMIN_PASSWORD=your_password
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📈 SEO & Performance

The platform is designed with a strong focus on technical SEO:
- **Dynamic Sitemap**: Automatically generated at `/sitemap.ts`.
- **RSS Feed**: Available at `/feed.xml`.
- **Robots.txt**: Configured for optimal crawling.
- **Optimized Metadata**: Dynamic meta tags for every guide and category.

## 📄 License

This project is private and proprietary.
