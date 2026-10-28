"use client";

import { useThemeStore } from '@/store/theme.store';
import { useState, useEffect, useRef } from 'react';

export default function BlogPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleItems, setVisibleItems] = useState(new Set());

  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fetch blog posts from backend
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const url = selectedCategory === 'All'
          ? 'http://localhost:8000/api/blog/all'
          : `http://localhost:8000/api/blog/all?category=${selectedCategory}`;

        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'success') {
          setBlogPosts(data.data);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, [selectedCategory]);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-id');
          if (id) {
            if (entry.isIntersecting) {
              setVisibleItems(prev => new Set([...prev, id]));
            } else {
              setVisibleItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
              });
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observerRef.current?.observe(ref);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [blogPosts]);

  const categories = ['All', 'Web Development', 'Data Science', 'Design', 'Business'];

  // Skeleton component
  const SkeletonCard = () => (
    <article className={isDark ? "bg-slate-800 rounded-2xl overflow-hidden border border-slate-700" : "bg-white rounded-2xl overflow-hidden border border-gray-100"}>
      <div className={`h-48 animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}></div>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className={`h-6 w-20 rounded-full animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
          <div className={`h-4 w-32 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
        </div>
        <div className={`h-8 rounded animate-pulse w-3/4 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
        <div className="space-y-2">
          <div className={`h-4 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
          <div className={`h-4 rounded animate-pulse w-5/6 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
          <div className={`h-4 rounded animate-pulse w-4/6 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
        </div>
      </div>
    </article>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <main className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="py-20 px-6 max-w-7xl mx-auto font-sans">
        <div className="space-y-5 mb-16">
          <h1 className={isDark ? "text-5xl font-black text-white tracking-tight leading-[1.1]" : "text-5xl font-black text-[#0F1C2E] tracking-tight leading-[1.1]"}>
            Blog
          </h1>
          <p className={isDark ? "text-slate-400 text-xl font-medium max-w-2xl leading-relaxed" : "text-[#4A5E7A] text-xl font-medium max-w-2xl leading-relaxed"}>
            Insights, tutorials, and industry news to help you grow your skills and career.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === category
                  ? "bg-blue-500 text-white shadow-sm"
                  : isDark
                  ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  : "bg-slate-100 text-slate-400 hover:bg-slate-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading ? (
            // Skeleton loading state
            Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : blogPosts.length > 0 ? (
            blogPosts.map((post: any, index) => (
              <article
                key={post._id || index}
                ref={(el) => (itemRefs.current[index] = el)}
                data-id={post._id || index}
                className={`rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-500 ease-in-out ${
                  visibleItems.has(post._id || String(index))
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                } ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}
              >
                <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center overflow-hidden">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">📝</span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={isDark ? "bg-blue-500/20 text-blue-400 text-xs font-bold px-2 py-1 rounded-full" : "bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full"}>
                      {post.category}
                    </span>
                    <span className={isDark ? "text-slate-400 text-xs" : "text-slate-500 text-xs"}>
                      {formatDate(post.createdAt)} · {post.readTime}
                    </span>
                  </div>
                  <h2 className={isDark ? "font-bold text-2xl mb-3 text-white" : "font-bold text-2xl mb-3 text-[#0F1C2E]"}>
                    {post.title}
                  </h2>
                  <p className={isDark ? "text-slate-400 text-base leading-relaxed" : "text-[#4A5E7A] text-base leading-relaxed"}>
                    {post.excerpt}
                  </p>
                  <button className="mt-4 text-[#1E40AF] font-bold text-base hover:underline cursor-pointer">
                    Read More →
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                No blog posts found in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
