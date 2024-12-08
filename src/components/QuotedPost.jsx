import React from 'react';
import { format } from 'timeago.js';

export function QuotedPost({ post }) {
  if (!post?.value) {
  console.error("Invalid post object passed to QuotedPost:", post);
  return null;
  }

  return (
  <div className="mt-2 rounded-xl bg-neutral-100 border border-neutral-200 p-3">
    <div className="flex items-center gap-2">
    <img
      src={post.author.avatar}
      alt=""
      className="w-5 h-5 rounded-full"
      onError={(e) => {
      e.target.src = 'https://placeholderr.com/20x20';
      }}
    />
    <div className="flex gap-1.5 items-baseline flex-1 min-w-0">
      <span className="font-medium text-[15px] truncate">
      {post.author.displayName}
      </span>
      <span className="text-sm text-gray-500 truncate">
      @{post.author.handle}
      </span>
      <span className="text-sm ml-auto">
      {format(post.indexedAt)}
      </span>
    </div>
    </div>
    <div className="text-[15px] mt-1">
    {post.value.text}
    </div>
  </div>
  );
}