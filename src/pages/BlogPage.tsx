/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BLOG_POSTS } from '../data/cannabisData';
import { BookOpen, Calendar, Clock, User, ArrowRight, Tag, Search } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const { navigateTo } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'all',
    'LEGAL & REGULATION',
    'SCIENCE & BOTANY',
    'EXTRACTION TECH',
    'QUALITY ASSURANCE',
  ];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCat = selectedCategory === 'all' || post.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.author.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] px-3.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 inline-block">
          Insights & Phytocannabinoid Research
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#063E30] dark:text-white font-['Outfit']">
          Canabis Hub Educational Journal
        </h1>
        <p className="text-xs sm:text-sm text-[#68756F] dark:text-emerald-200/80 leading-relaxed">
          In-depth scientific articles, regulatory analysis under the German CanG framework, European Pharmacopoeia quality standards, and botanical extraction breakthroughs.
        </p>

        {/* Search */}
        <div className="relative max-w-md mx-auto pt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, topic, or author..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl text-xs bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 text-[#263A36] dark:text-white shadow-xs focus:outline-none focus:ring-2 focus:ring-[#07543F]"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-[#07543F] text-white shadow-md'
                : 'bg-white dark:bg-[#073B2E] text-[#68756F] dark:text-emerald-200 border border-[#E9EDE7] dark:border-emerald-800 hover:text-[#07543F]'
            }`}
          >
            {cat === 'all' ? 'All Journal Posts' : cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => navigateTo('blog-post', post.slug || post.id)}
            className="group rounded-3xl bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#07543F] dark:hover:border-[#F28A19] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="h-56 w-full relative overflow-hidden bg-slate-100 dark:bg-emerald-950">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#07543F]/90 backdrop-blur-xs text-white">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-3">
                <div className="flex items-center gap-4 text-xs text-[#68756F] dark:text-emerald-200/70">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-[#063E30] dark:text-white group-hover:text-[#07543F] dark:group-hover:text-[#F28A19] transition-colors font-['Outfit']">
                  {post.title}
                </h2>

                <p className="text-xs sm:text-sm text-[#4A5568] dark:text-emerald-100/80 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0 flex items-center justify-between border-t border-[#E9EDE7] dark:border-emerald-800/60 mt-4 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-[#68756F] dark:text-emerald-200/70">
                <User className="w-3.5 h-3.5 text-[#07543F] dark:text-[#F28A19]" />
                {post.author}
              </span>
              <span className="font-bold text-[#07543F] dark:text-[#F28A19] flex items-center gap-1">
                Read Full Monograph <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
