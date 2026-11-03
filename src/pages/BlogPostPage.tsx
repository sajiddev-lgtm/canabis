/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { BLOG_POSTS } from '../data/cannabisData';
import { ArrowLeft, Calendar, Clock, User, Share2, Bookmark, CheckCircle, ShieldCheck } from 'lucide-react';

export const BlogPostPage: React.FC = () => {
  const { pageParam, navigateTo } = useApp();
  const [copied, setCopied] = React.useState(false);

  const postSlug = pageParam || 'german-cang-framework-standards';
  const post =
    BLOG_POSTS.find((p) => p.slug === postSlug) ||
    BLOG_POSTS.find((p) => p.id === postSlug) ||
    BLOG_POSTS[0];

  const otherPosts = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 3);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] dark:bg-[#041F18] py-12 text-[#263A36] dark:text-[#E2E8F0] transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <button
            onClick={() => navigateTo('blog')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#07543F] dark:text-emerald-400 hover:text-[#F28A19] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Editorial Articles
          </button>
        </div>

        {/* Article Header */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-[#07543F]/10 dark:bg-emerald-500/20 text-[#07543F] dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-xs text-[#68756F] dark:text-gray-400">·</span>
            <span className="text-xs text-[#68756F] dark:text-gray-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063E30] dark:text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-[#68756F] dark:text-gray-300 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E9EDE7] dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#07543F] text-white flex items-center justify-center font-bold text-xs">
                {post.author.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-xs font-bold text-[#263A36] dark:text-white">{post.author}</div>
                <div className="text-[11px] text-[#68756F] dark:text-gray-400">{post.date} · Scientific Review</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="px-3 py-1.5 rounded-lg border border-[#E9EDE7] dark:border-white/10 text-xs font-semibold text-[#263A36] dark:text-gray-200 hover:bg-white dark:hover:bg-[#073B2E] flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> {copied ? 'URL Copied!' : 'Share Article'}
              </button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-3xl overflow-hidden shadow-lg border border-[#E9EDE7] dark:border-white/10 mb-12">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div
          className="prose prose-lg max-w-none text-[#263A36] dark:text-gray-200 prose-headings:text-[#063E30] dark:prose-headings:text-white prose-headings:font-bold prose-p:leading-relaxed prose-p:text-sm sm:prose-p:text-base prose-li:text-sm space-y-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Author Bio Box */}
        <div className="mt-12 p-6 rounded-2xl bg-white dark:bg-[#073B2E]/60 border border-[#E9EDE7] dark:border-white/10 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#F28A19] text-white flex items-center justify-center font-bold text-sm shrink-0">
            {post.author.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#063E30] dark:text-white mb-1">
              About the Contributor: {post.author}
            </h4>
            <p className="text-xs text-[#68756F] dark:text-gray-300 leading-relaxed">
              Contributing pharmacologist and regulatory consultant for Canabis Hub Germany. Regularly publishing academic papers on cannabinoid pharmacokinetics, analytical purity testing, and consumer safety.
            </p>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-16 pt-12 border-t border-[#E9EDE7] dark:border-white/10">
          <h3 className="text-xl font-bold text-[#063E30] dark:text-white mb-6">
            Related Technical Articles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {otherPosts.map((op) => (
              <div
                key={op.id}
                onClick={() => navigateTo('blog-post', op.slug)}
                className="bg-white dark:bg-[#073B2E]/50 rounded-2xl border border-[#E9EDE7] dark:border-white/10 p-4 hover:border-[#07543F]/40 dark:hover:border-emerald-500/50 cursor-pointer shadow-sm hover:shadow-md transition-all group"
              >
                <span className="text-[10px] font-bold text-[#F28A19] uppercase tracking-wider block mb-1">
                  {op.category}
                </span>
                <h4 className="font-bold text-sm text-[#063E30] dark:text-white group-hover:text-[#07543F] dark:group-hover:text-emerald-300 line-clamp-2 mb-2">
                  {op.title}
                </h4>
                <span className="text-[11px] text-[#68756F] dark:text-gray-400">{op.readTime}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
