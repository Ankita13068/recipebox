import { useCallback, useEffect, useRef, useState } from "react";
import fallbackImage from "../assets/hero.png";
import "./RecipeDetails.css";

export default function RecipeDetails({
  recipe,
  onClose,
  onDelete,
  returnFocusRef
}) {
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const closeTimerRef = useRef(null);
  const isClosingRef = useRef(false);
  const [isClosing, setIsClosing] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const requestClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(onClose, 180);
  }, [onClose]);

  function handleImageError(event) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallbackImage;
  }

  function deleteCommunityRecipe() {
    if (!window.confirm(`Delete "${recipe.name}" from this browser?`)) return;

    if (!onDelete?.(recipe.id)) {
      setDeleteError("This recipe could not be deleted from browser storage.");
    }
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const returnFocusElement = returnFocusRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        requestClose();
      }

      if (event.key === "Tab") {
        const focusableElements = dialogRef.current?.querySelectorAll(
          "button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex='-1'])"
        );
        if (!focusableElements?.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(closeTimerRef.current);
      document.body.style.overflow = previousOverflow;
      returnFocusElement?.focus();
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, requestClose, returnFocusRef]);

  return (
    <div
      className={`recipe-dialog-backdrop${isClosing ? " is-closing" : ""}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <section
        ref={dialogRef}
        className="recipe-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-dialog-title"
      >
        <button
          ref={closeButtonRef}
          className="recipe-dialog-close"
          type="button"
          onClick={requestClose}
          aria-label="Close recipe details"
        >
          ×
        </button>

        <div className="recipe-dialog-image-wrap">
          <img
            src={recipe.image || fallbackImage}
            alt={`${recipe.name} prepared and served`}
            onError={handleImageError}
          />
        </div>

        <div className="recipe-dialog-content">
          <p className="recipe-dialog-kicker">{recipe.category} · {recipe.time} minutes</p>
          <h2 id="recipe-dialog-title">{recipe.name}</h2>
          <p className="recipe-dialog-diet">
            {recipe.isVeg ? "Vegetarian" : "Non-vegetarian"}
            {recipe.isCommunity && " · Community recipe"}
          </p>

          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.id || ingredient.name}>{ingredient.name}</li>
            ))}
          </ul>

          {recipe.instructions && (
            <>
              <h3>Cooking instructions</h3>
              <p className="recipe-dialog-instructions">
                {recipe.instructions}
              </p>
            </>
          )}

          {deleteError && (
            <p className="recipe-dialog-delete-error" role="alert">
              {deleteError}
            </p>
          )}

          {recipe.isCommunity && onDelete && (
            <button
              className="recipe-dialog-delete"
              type="button"
              onClick={deleteCommunityRecipe}
            >
              Delete community recipe
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
