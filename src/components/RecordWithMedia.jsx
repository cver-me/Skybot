export function RecordWithMedia({ embed, onMediaSelect }) {
  return (
  <>
    {embed.media.$type === 'app.bsky.embed.images#view' && (
    <div className={`mt-2 ${embed.media.images.length > 1 ? 'grid grid-cols-2 gap-0.5' : ''}`}>
      {embed.media.images.map((image, index) => (
      <div
        key={`${embed.record.uri}-media-image-${index}`}
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
    )}
    {embed.media.$type === 'app.bsky.embed.external#view' && (
    <div className="mt-2">
      <video
      src={embed.media.external.uri}
      poster={embed.media.external.thumb}
      controls
      playsInline
      className="w-full rounded-lg"
      style={{ maxHeight: '500px' }}
      >
      <source src={embed.media.external.uri} type="video/mp4" />
      <source src={embed.media.external.uri} type="video/webm" />
      Your browser does not support the video tag.
      </video>
    </div>
    )}
    <QuotedPost post={embed.record} key={embed.record.uri} />
  </>
  );
}