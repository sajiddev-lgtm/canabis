/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { BLOG_POSTS } from '../data/cannabisData';
import { Calendar, Clock, User, ArrowLeft, Share2, Bookmark, ShieldCheck, Tag } from 'lucide-react';

export const BlogPostPage: React.FC = () => {
  const { pageParam, navigateTo } = useApp();

  const post =
    BLOG_POSTS.find((p) => p.slug === pageParam || p.id === pageParam) ||
    BLOG_POSTS[0];

  const relatedPosts = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigateTo('blog')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#07543F] dark:text-[#F28A19] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </button>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/60 text-[#07543F] dark:text-emerald-200 inline-block">
          {post.category}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#063E30] dark:text-white font-['Outfit'] leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#68756F] dark:text-emerald-200/70 pt-2 border-b border-[#E9EDE7] dark:border-emerald-800 pb-6">
          <span className="flex items-center gap-1.5 font-bold text-[#063E30] dark:text-white">
            <User className="w-4 h-4 text-[#F28A19]" />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#07543F] dark:text-emerald-300" />
            {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#07543F] dark:text-emerald-300" />
            {post.readTime}
          </span>
          <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold ml-auto">
            <ShieldCheck className="w-4 h-4 text-[#F28A19]" />
            Peer-Reviewed Monograph
          </span>
        </div>
      </div>

      {/* Featured Banner Image */}
      <div className="rounded-3xl overflow-hidden h-72 sm:h-96 w-full relative bg-slate-100 dark:bg-emerald-950 shadow-md">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Excerpt Lead */}
      <div className="p-6 rounded-2xl bg-emerald-50/70 dark:bg-[#073B2E]/60 border-l-4 border-[#07543F] text-sm sm:text-base font-medium text-[#263A36] dark:text-emerald-100 italic leading-relaxed">
        "{post.excerpt}"
      </div>

      {/* Post Body */}
      <div
        className="prose prose-emerald dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-[#263A36] dark:text-emerald-100 space-y-4"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Compliance Disclaimer */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 text-xs text-[#68756F] dark:text-emerald-200/80 space-y-1">
        <strong className="block font-bold text-[#063E30] dark:text-white uppercase tracking-wider">
          Legal & Medical Notice (CanG Compliance)
        </strong>
        <p>
          The information contained within this journal monograph is published exclusively for educational, scientific, and botanical research purposes. It does not constitute medical advice or promotion of illicit substances. Cannabis use is restricted to adults aged 18 and older under German federal law.
        </p>
      </div>

      {/* Related articles */}
      <div className="pt-10 border-t border-[#E9EDE7] dark:border-emerald-800 space-y-6">
        <h3 className="text-xl font-bold text-[#063E30] dark:text-white font-['Outfit']">
          Related Journal Monographs
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {relatedPosts.map((r) => (
            <div
              key={r.id}
              onClick={() => {
                navigateTo('blog-post', r.slug || r.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group p-5 rounded-2xl bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 hover:border-[#07543F] dark:hover:border-[#F28A19] transition-all cursor-pointer space-y-2 shadow-xs"
            >
              <span className="text-[10px] font-bold text-[#F28A19] uppercase tracking-wider block">
                {r.category}
              </span>
              <h4 className="text-sm font-bold text-[#063E30] dark:text-white group-hover:text-[#07543F] dark:group-hover:text-[#F28A19] transition-colors">
                {r.title}
              </h4>
              <p className="text-xs text-[#68756F] dark:text-emerald-200/70 line-clamp-2">
                {r.excerpt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};
