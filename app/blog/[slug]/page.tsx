import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, Share2, Twitter, Linkedin, Copy, Check } from 'lucide-react';
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/blog';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | ViralPik Blog',
    };
  }

  return {
    title: `${post.title} | ViralPik Blog`,
    description: post.excerpt,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: post.image ? [post.image] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : undefined,
    },
  };
}

// Custom MDX components
const components = {
  h1: ({ children }: any) => (
    <h1 className="text-4xl font-bold text-white mb-6 mt-12">{children}</h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-3xl font-bold text-white mb-4 mt-10">{children}</h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-2xl font-semibold text-white mb-3 mt-8">{children}</h3>
  ),
  p: ({ children }: any) => (
    <p className="text-zinc-300 mb-6 leading-relaxed">{children}</p>
  ),
  ul: ({ children }: any) => (
    <ul className="list-disc list-inside text-zinc-300 mb-6 space-y-2">{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-inside text-zinc-300 mb-6 space-y-2">{children}</ol>
  ),
  li: ({ children }: any) => (
    <li className="text-zinc-300">{children}</li>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-blue-500 pl-6 py-2 my-6 text-zinc-400 italic">
      {children}
    </blockquote>
  ),
  code: ({ children }: any) => (
    <code className="bg-zinc-800 text-blue-400 px-2 py-1 rounded text-sm">{children}</code>
  ),
  pre: ({ children }: any) => (
    <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-x-auto mb-6">
      {children}
    </pre>
  ),
  a: ({ href, children }: any) => (
    <a href={href} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  img: ({ src, alt }: any) => (
    <img src={src} alt={alt} className="w-full rounded-lg my-8" />
  ),
  hr: () => <hr className="border-zinc-800 my-12" />,
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  
  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(resolvedParams.slug);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          
          {/* Post Meta */}
          <div className="mb-6">
            <span className="text-sm text-blue-400 uppercase tracking-wider">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {post.title}
          </h1>
          
          <p className="text-xl text-zinc-400 mb-8">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <span className="font-medium">{post.author}</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
            
            {/* Share buttons */}
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-zinc-900 rounded-lg transition-colors">
                <Twitter className="w-4 h-4 text-zinc-400" />
              </button>
              <button className="p-2 hover:bg-zinc-900 rounded-lg transition-colors">
                <Linkedin className="w-4 h-4 text-zinc-400" />
              </button>
              <button className="p-2 hover:bg-zinc-900 rounded-lg transition-colors">
                <Copy className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.image && (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 pb-16">
        <div className="prose prose-invert max-w-none">
          {post.content ? (
            <MDXRemote 
              source={post.content}
              components={components}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    rehypeHighlight,
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: 'wrap' }]
                  ],
                },
              }}
            />
          ) : (
            <div className="text-zinc-400">
              <p>This is a placeholder post. Create MDX files in the content/blog directory to see real content.</p>
            </div>
          )}
        </div>
      </article>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 pb-12">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span 
                key={tag}
                className="px-3 py-1 bg-zinc-900 text-zinc-400 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Author Bio */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-zinc-900 rounded-lg p-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-zinc-800 rounded-full"></div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                {post.author}
              </h3>
              <p className="text-zinc-400 mb-4">
                Contributing writer at ViralPik. Passionate about digital creativity and helping creators succeed.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">
                  Twitter
                </a>
                <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 px-4 border-t border-zinc-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.slug} className="group">
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <div className="bg-zinc-900 rounded-lg h-48 mb-6 group-hover:bg-zinc-800 transition-colors"></div>
                    <div className="mb-3">
                      <span className="text-xs text-zinc-500 uppercase tracking-wider">
                        {relatedPost.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-zinc-300 transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-zinc-400 mb-4 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                      <span>{relatedPost.author}</span>
                      <span>{relatedPost.readTime}</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
