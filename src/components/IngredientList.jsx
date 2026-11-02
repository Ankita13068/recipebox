
export default function IngredientList({ ingredients, maxDisplay = 4 }) {
  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  const visibleIngredients = ingredients.slice(0, maxDisplay);
  const remaining = Math.max(0, ingredients.length - maxDisplay);

  return (
    <div className="ingredient-container">
      <h4 className="ingredient-heading">Key Ingredients</h4>

      <ul className="ingredient-list">
        {visibleIngredients.map((item) => (
          <li
            key={item.id || item.name}
            className="ingredient-item"
          >
            <span className="bullet-dot" aria-hidden="true">•</span>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>

      {remaining > 0 && (
        <p className="ingredient-more">
          +{remaining} additional item{remaining !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
