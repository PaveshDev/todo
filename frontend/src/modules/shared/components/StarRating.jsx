import { useState } from "react";
import "../styles/StarRating.css";

const StarRating = ({ rating, onRate, readonly = false, size = "large" }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className={`star-rating ${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${
            star <= (hover || rating) ? "star-filled" : "star-empty"
          } ${readonly ? "readonly" : "interactive"}`}
          onClick={() => !readonly && onRate && onRate(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          ★
        </span>
      ))}
      {!readonly && rating > 0 && (
        <span className="rating-text">{rating} / 5</span>
      )}
    </div>
  );
};

export default StarRating;
