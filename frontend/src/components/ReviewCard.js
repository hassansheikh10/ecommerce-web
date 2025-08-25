export default function ReviewCard({ review }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition">
      <p className="text-gray-600 italic mb-3">"{review.comment}"</p>
      <h4 className="text-lg font-semibold">{review.name}</h4>
      <p className="text-yellow-500">⭐ {review.rating}/5</p>
    </div>
  );
}