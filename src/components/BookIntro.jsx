
import { useEffect, useState } from "react";
import "./BookIntro.css";

export default function BookIntro({ onOpen, featuredRecipe }) {
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    if (!isOpening) return;

    const timer = setTimeout(() => {
      onOpen();
    }, 1250);

    return () => clearTimeout(timer);
  }, [isOpening, onOpen]);

  const recipeImage = featuredRecipe?.image;

  return (
    <main className={`book-intro ${isOpening ? "is-opening" : ""}`}>
      <div className="intro-topline">
        <span>THE RECIPEBOX JOURNAL</span>
        <span>EST. 2026 · VOL. 01</span>
      </div>

      <div className="book-stage">
        {/* The pages visible behind the cover */}
        <div className="book-spread">
          <section className="book-page inside-left">
            <span className="page-kicker">A NOTE FROM OUR KITCHEN</span>

            <h1>
              Good food.
              <br />
              Slow moments.
              <br />
              <em>Beautiful memories.</em>
            </h1>

            <div className="page-divider" />

            <p>
              Welcome to RecipeBox, a little corner for discovering
              delicious recipes, gathering around the table, and
              finding joy in everyday cooking.
            </p>

            <span className="page-signature">
              Made with love, RecipeBox
            </span>

            <span className="page-number">01</span>
          </section>

          <section className="book-page inside-right">
            {recipeImage && (
              <img
                src={recipeImage}
                alt={featuredRecipe?.name || "Featured recipe"}
              />
            )}

            <div className="inside-recipe-caption">
              <span>ON THE MENU</span>
              <h2>
                {featuredRecipe?.name || "Something delicious"}
              </h2>
              <p>
                A little inspiration for your next kitchen adventure.
              </p>
            </div>

            <span className="page-number">02</span>
          </section>
        </div>

        {/* The front cover */}
        <div className="book-cover">
          <div className="cover-content">
            <span className="cover-edition">
              A COLLECTION OF EVERYDAY DELIGHTS
            </span>

            <div className="cover-emblem">✳</div>

            <h2>RecipeBox</h2>

            <span className="cover-subtitle">
              THE ART OF GOOD FOOD
            </span>

            <div className="cover-line" />

            <p>
              Recipes to make,
              <br />
              moments to savour.
            </p>

            <span className="cover-bottom">
              OPEN YOUR KITCHEN
            </span>
          </div>
        </div>
      </div>

      <div className="intro-bottom">
        <span>FRESH IDEAS · FAMILIAR FLAVOURS</span>

        <button
          type="button"
          className="open-book-button"
          onClick={() => setIsOpening(true)}
          disabled={isOpening}
        >
          {isOpening ? "Opening your journal..." : "Open the book"}
          <span aria-hidden="true"> ↗</span>
        </button>

        <span>COOK · CREATE · SHARE</span>
      </div>
    </main>
  );
}
