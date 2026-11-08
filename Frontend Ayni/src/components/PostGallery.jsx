import { useState } from 'react';
import { assetUrl } from '../models/api.js';
export default function PostGallery({ post }) {
  const [index, setIndex] = useState(0);
  const images = post.images?.length
    ? post.images
    : post.image
      ? [post.image]
      : [];
  if (!images.length) return null;
  return (
    <div className="post-gallery">
      <img
        src={assetUrl(images[index] || images[0])}
        alt={post.title}
        className="w-full h-52 object-cover"
      />
      {images.length > 1 && (
        <div className="gallery-thumbs" aria-label="Fotos de la publicación">
          {images.map((url, n) => (
            <button
              key={url}
              type="button"
              aria-label={`Ver foto ${n + 1}`}
              aria-pressed={index === n}
              className={index === n ? 'is-selected' : ''}
              onClick={() => setIndex(n)}
            >
              <img src={assetUrl(url)} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
