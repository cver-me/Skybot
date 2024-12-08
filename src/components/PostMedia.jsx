import React from 'react';
import { VideoPlayer } from './VideoPlayer';
import { ExternalLink } from './ExternalLink';
import { QuotedPost } from './QuotedPost';
import { RecordWithMedia } from './RecordWithMedia';

export function PostMedia({ post, onMediaSelect }) {
  const embed = post.post.embed;

  if (!embed) return null;

  if (embed.$type === 'app.bsky.embed.images#view') {
    return (
      <div className={`mt-2 ${embed.images.length > 1 ? 'grid grid-cols-2 gap-0.5' : ''}`}>
        {embed.images.map((image, index) => (
          <div
            key={`${post.post.cid}-image-${index}`}
            className="cursor-pointer relative pt-[56.25%]"
            onClick={() => onMediaSelect({ ...image, type: 'image' })}
          >
            <img
              src={image.thumb}
              alt={image.alt}
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    );
  }

  if (embed.$type === 'app.bsky.embed.external#view') {
    return <ExternalLink embed={embed} />;
  }

  if (embed.$type === 'app.bsky.embed.recordWithMedia#view') {
    return <RecordWithMedia embed={embed} onMediaSelect={onMediaSelect} />;
  }

  if (embed.$type === 'app.bsky.embed.video#view') {
    const aspectRatio = embed.aspectRatio ? 
      `${embed.aspectRatio.width}/${embed.aspectRatio.height}` : 
      '16/9';

    return (
      <div className="mt-2">
        <VideoPlayer 
          src={embed.playlist}
          poster={embed.thumbnail}
          aspectRatio={aspectRatio}
        />
      </div>
    );
  }

  if (embed.$type === 'app.bsky.embed.record#view') {
    return <QuotedPost post={embed.record} key={embed.record.uri} />;
  }

  return null;
}