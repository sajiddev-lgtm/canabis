/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BLOG_POSTS } from '../data/cannabisData';
import { BookOpen, Calendar, Clock, ArrowRight, User, Search } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const { navigateTo } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'LEGAL & REGULATION', 'SCIENCE & BOTANY', 'EXTRACTION TECH', 'QUALITY ASSURANCE'];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchCat = selectedCategory === 'all' || post.category === selectedCategory;
    const matchQuery =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="min-h-screen bg-[#FFFDF8] dark:bg-[#041F18] py-12 text-[#263A36] dark:text-[#E2E8F0] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-[#68756F] dark:text-gray-400 mb-3">
            <button onClick={() => navigateTo('home')} className="hover:text-[#07543F] dark:hover:text-emerald-400">
              Home
            </button>
            <span>/</span>
            <span className="text-[#07543F] dark:text-emerald-400 font-semibold">Blog & Insights</span>
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-2">
            BOTANICAL MONOGRAPHS & RESEARCH
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063E30] dark:text-white tracking-tight mb-4">
            Cannabis Science & Regulatory Intelligence
          </h1>
          <p className="text-sm sm:text-base text-[#68756F] dark:text-gray-300 max-w-3xl leading-relaxed">
            Authored by pharmacologists, analytical chemists, and legal analysts. Explore peer-reviewed insights on German CanG regulations, terpenes, extraction physics, and clinical harm reduction.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#07543F] text-white shadow-sm dark:bg-emerald-600'
                    : 'bg-white dark:bg-[#073B2E]/60 text-[#263A36] dark:text-gray-200 border border-[#E9EDE7] dark:border-white/10 hover:border-[#07543F] dark:hover:border-emerald-500'
                }`}
              >
                {cat === 'all' ? 'All Articles' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#68756F] dark:text-gray-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search articles by keyword or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#073B2E]/60 border border-[#E9EDE7] dark:border-white/10 rounded-xl text-xs text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F] dark:focus:border-emerald-400 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white dark:bg-[#073B2E]/50 rounded-3xl border border-[#E9EDE7] dark:border-white/10 hover:border-[#07543F]/40 dark:hover:border-emerald-500/50 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-3 left-3 bg-[#063E30]/85 dark:bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-[#68756F] dark:text-gray-400 mb-2.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {post.date}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {post.readTime}
                    </span>
                  </div>

                  <h3
                    onClick={() => navigateTo('blog-post', post.slug)}
                    className="font-extrabold text-lg text-[#063E30] dark:text-white group-hover:text-[#07543F] dark:group-hover:text-emerald-300 cursor-pointer mb-2.5 leading-snug line-clamp-2"
                  >
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#68756F] dark:text-gray-300 leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>

                  <div className="text-[11px] font-semibold text-[#263A36] dark:text-gray-200 flex items-center gap-1.5 pt-3 border-t border-[#E9EDE7] dark:border-white/10">
                    <User className="w-3.5 h-3.5 text-[#F28A19]" />
                    <span>{post.author}</span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0">
                <button
                  onClick={() => navigateTo('blog-post', post.slug)}
                  className="w-full py-2.5 rounded-xl bg-[#FFFDF8] dark:bg-[#041F18]/80 hover:bg-[#07543F] dark:hover:bg-emerald-600 hover:text-white border border-[#E9EDE7] dark:border-white/10 text-xs font-bold text-[#063E30] dark:text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Read Full Technical Monograph</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
