
import IngredientList from "./IngredientList";
import fallbackImage from "../assets/hero.png";

export default function RecipeCard({
  recipe,
  onSelect,
  isFavourite,
  onToggleFavourite
}) {
  const {
    id,
    name,
    category,
    time,
    image,
    isVeg,
    ingredients
  } = recipe;

  function handleImageError(event) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbackImage;
  }

  function handleFavouriteClick(event) {
    // Prevent the card from opening recipe details.
    event.stopPropagation();

    onToggleFavourite(id);
  }

  function handleCardKeyDown(event) {
    // Ignore keyboard events originating from child buttons.
    if (event.target !== event.currentTarget) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(event);
    }
  }

  return (
    <article
      id={`recipe-${id}`}
      className="recipe-card"
      role="button"
      tabIndex={0}
      aria-label={`View details for ${name}`}
      onClick={onSelect}
      onKeyDown={handleCardKeyDown}
    >
      <div className="card-media">
        <img
          src={image || fallbackImage}
          alt={`${name} recipe`}
          className="recipe-image"
          loading="lazy"
          onError={handleImageError}
        />

        {/* NEW: Favourite heart button */}
        <button
          type="button"
          className={`favourite-btn ${
            isFavourite ? "favourite-active" : ""
          }`}
          aria-label={
            isFavourite
              ? `Remove ${name} from favourites`
              : `Add ${name} to favourites`
          }
          aria-pressed={isFavourite}
          onClick={handleFavouriteClick}
        >
          {isFavourite ? "♥" : "♡"}
        </button>

        {/* Dietary badge */}
        <span
          className={`diet-badge ${
            isVeg ? "badge-veg" : "badge-nonveg"
          }`}
        >
          <span className="badge-dot" aria-hidden="true" />
          {isVeg ? "Vegetarian" : "Non-Veg"}
        </span>

        {/* Community recipe badge */}
        {recipe.isCommunity && (
          <span className="community-recipe-badge">
            Community recipe
          </span>
        )}
      </div>

      <div className="card-body">
        <div className="meta-row">
          <span className="category-tag">
            {category}
          </span>

          <span className="time-tag">
            <svg
              className="time-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>

            {time} mins
          </span>
        </div>

        <h3 className="recipe-title">
          {name}
        </h3>

        <IngredientList ingredients={ingredients} />
      </div>
    </article>
  );
}
