export function ExternalLink({ embed }) {
  const { external } = embed;
  const isGif = external.uri.toLowerCase().endsWith('.gif');

  if (isGif) {
  return (
    <div className="mt-2">
    <video
      autoPlay
      loop
      muted
      playsInline
      poster={external.thumb}
      className="w-full rounded-lg"
    >
      <source src={external.uri} type="video/mp4" />
      <img src={external.uri} alt={external.description} className="w-full rounded-lg" />
    </video>
    </div>
  );
  }

  return (
  <a
    href={external.uri}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-2 block border rounded-lg overflow-hidden hover:bg-gray-50"
  >
    {external.thumb && (
    <img
      src={external.thumb}
      alt={external.title}
      className="w-full h-40 object-cover"
    />
    )}
    <div className="p-3">
    <div className="font-medium">{external.title}</div>
    {external.description && (
      <div className="text-gray-500 text-sm mt-1 line-clamp-2">
      {external.description}
      </div>
    )}
    <div className="text-gray-400 text-sm mt-1 truncate">{external.uri}</div>
    </div>
  </a>
  );
}