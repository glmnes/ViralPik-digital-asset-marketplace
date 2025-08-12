import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { getAllPosts, getCategories, getFeaturedPosts } from '@/lib/blog';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | ViralPik - Insights & Ideas',
  description: 'Thoughts on design, creativity, and building in the digital age. Learn from experts about digital assets, marketing, and creative business.',
  openGraph: {
    title: 'ViralPik Blog - Insights & Ideas',
    description: 'Thoughts on design, creativity, and building in the digital age',
    type: 'website',
  },
};

export default function BlogPage() {
  const allPosts = getAllPosts();
  const categories = ['All', ...getCategories()];
  const featuredPosts = getFeaturedPosts();
  
  // Use real posts if available, otherwise use demo data
  const blogPosts = allPosts.length > 0 ? allPosts : [
    {
      slug: 'the-future-of-digital-assets',
      title: 'The future of digital assets',
      excerpt: 'How AI and blockchain are reshaping the creative economy and what it means for creators.',
      author: 'Sarah Chen',
      date: '2024-01-15',
      readTime: '5 min read',
      category: 'Industry',
      featured: true,
      image: '/api/placeholder/800/400'
    },
    {
      slug: 'building-a-sustainable-creator-business',
      title: 'Building a sustainable creator business',
      excerpt: 'Practical strategies for turning your creative passion into a thriving business.',
      author: 'Marcus Rodriguez',
      date: '2024-01-12',
      readTime: '8 min read',
      category: 'Business',
      featured: false,
      image: '/api/placeholder/400/300'
    },
    {
      slug: 'design-trends-that-will-define-2024',
      title: 'Design trends that will define 2024',
      excerpt: 'From brutalism to neo-minimalism, explore the trends shaping digital design.',
      author: 'Elena Volkov',
      date: '2024-01-10',
      readTime: '6 min read',
      category: 'Design',
      featured: false,
      image: '/api/placeholder/400/300'
    },
    {
      slug: 'maximizing-your-reach-on-ViralPik',
      title: 'Maximizing your reach on ViralPik',
      excerpt: 'Tips and strategies to get your content discovered by the right audience.',
      author: 'James Park',
      date: '2024-01-08',
      readTime: '4 min read',
      category: 'Platform',
      featured: false,
      image: '/api/placeholder/400/300'
    },
    {
      slug: 'the-psychology-of-viral-content',
      title: 'The psychology of viral content',
      excerpt: 'Understanding what makes content spread and how to create shareable assets.',
      author: 'Dr. Lisa Thompson',
      date: '2024-01-05',
      readTime: '10 min read',
      category: 'Marketing',
      featured: false,
      image: '/api/placeholder/400/300'
    },
    {
      slug: 'from-side-hustle-to-six-figures',
      title: 'From side hustle to six figures',
      excerpt: 'Real stories from creators who transformed their craft into careers.',
      author: 'Michael Chang',
      date: '2024-01-03',
      readTime: '7 min read',
      category: 'Success Stories',
      featured: false,
      image: '/api/placeholder/400/300'
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero */}
      <section className="py-24 px-4 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Insights & Ideas
          </h1>
          <p className="text-xl text-zinc-400">
            Thoughts on design, creativity, and building in the digital age
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  category === 'All'
                    ? 'bg-white text-zinc-900'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {blogPosts.filter(post => post.featured).map(post => (
        <section key={post.slug} className="py-16 px-4 border-b border-zinc-800">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-4">
                  <span className="text-sm text-zinc-500 uppercase tracking-wider">{post.category}</span>
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">{post.title}</h2>
                <p className="text-lg text-zinc-400 mb-6">{post.excerpt}</p>
                <div className="flex items-center gap-6 text-sm text-zinc-500 mb-8">
                  <span>{post.author}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all"
                >
                  Read article
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-zinc-900 rounded-lg h-96 flex items-center justify-center">
                <span className="text-zinc-600">Featured Image</span>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Blog Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(post => !post.featured).map(post => (
              <article key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`}>
                  <div className="bg-zinc-900 rounded-lg h-48 mb-6 group-hover:bg-zinc-800 transition-colors flex items-center justify-center">
                    <span className="text-zinc-600 group-hover:text-zinc-500 transition-colors">Thumbnail</span>
                  </div>
                  <div className="mb-3">
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">{post.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-zinc-300 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-zinc-400 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span>{post.author}</span>
                    <span>{post.readTime}</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-16 text-center">
            <button className="px-8 py-3 bg-zinc-900 text-white hover:bg-zinc-800 transition-colors">
              Load more articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-4 bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay in the loop
          </h2>
          <p className="text-zinc-400 mb-8">
            Get weekly insights on creativity, design, and building digital products
          </p>
          <form className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:border-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-zinc-900 font-medium hover:bg-zinc-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
