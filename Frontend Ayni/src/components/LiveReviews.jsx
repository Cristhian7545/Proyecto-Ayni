import { useEffect, useState } from 'react';
import { api } from '../models/api.js';
export default function LiveReviews({ userId }) {
  const [reviews, setReviews] = useState([]),
    [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    api(`/users/${userId}/reviews`)
      .then((data) => {
        if (active) {
          setReviews(data.reviews);
          setError('');
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [userId]);
  return (
    <section className="bg-white rounded-2xl p-6 my-6">
      <h2 className="text-headline-md text-primary">
        Recomendaciones de la comunidad
      </h2>
      {error ? (
        <p role="status">{error}</p>
      ) : !reviews.length ? (
        <p className="mt-3 text-on-surface-variant">
          Todavía no tienes recomendaciones registradas.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="bg-surface-container-low rounded-xl p-5"
            >
              <h3 className="font-semibold">{review.publication}</h3>
              <p className="my-3">{review.body}</p>
              <p className="text-sm text-primary">{review.author}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
