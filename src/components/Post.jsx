import React from 'react';
import { Repeat, MessageSquareReply } from 'lucide-react';
import { format } from 'timeago.js';
import { PostMedia } from './PostMedia';

export function Post({ post, onMediaSelect }) {
  const repostedBy = post.reason?.$type === 'app.bsky.feed.defs#reasonRepost'
    ? post.reason.by.displayName
    : null;

  const isReply = post.post.record?.reply;

  return (
    <div className="w-full">
      {repostedBy && (
        <div className="flex items-center gap-1.5 text-[#9c5fff] text-sm mb-2">
          <Repeat className="w-4 h-4" />
          <span>{repostedBy} reposted</span>
        </div>
      )}
      <div className="flex gap-3">
        <img src={post.post.author.avatar} alt="" className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="font-medium truncate">
              {post.post.author.displayName}
            </span>
            <span className="text-gray-500 text-sm truncate">
              @{post.post.author.handle}
            </span>
            <div className="text-gray-500 text-sm ml-auto flex items-center gap-1">
              {isReply && <MessageSquareReply className="w-3.5 h-3.5" />}
              <span>{format(post.post.indexedAt)}</span>
            </div>
          </div>
          <div className="text-[15px] leading-5 mt-1">
            {post.post.record.text}
          </div>
          <PostMedia post={post} onMediaSelect={onMediaSelect} />
        </div>
      </div>
    </div>
  );
}