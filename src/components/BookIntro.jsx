
import { useEffect, useState } from "react";
import "./BookIntro.css";

export default function BookIntro({ onOpen }) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (!isLeaving) return;

    const timer = setTimeout(() => {
      onOpen();
    }, 500);

    return () => clearTimeout(timer);
  }, [isLeaving, onOpen]);

  return (
    <main className={`editorial-intro ${isLeaving ? "is-leaving" : ""}`}>
      {/* Decorative background details */}
      <div className="editorial-orb editorial-orb-one" aria-hidden="true" />
      <div className="editorial-orb editorial-orb-two" aria-hidden="true" />

      {/* Header */}
      <header className="editorial-header">
        <a className="editorial-logo" href="#home" aria-label="RecipeBox home">
          RecipeBox<span>.</span>
        </a>

        <span className="editorial-header-label">
          THE ART OF EVERYDAY COOKING
        </span>

        <span className="editorial-edition">
          EST. 2026
        </span>
      </header>

      {/* Main brand introduction */}
      <section className="editorial-main">
        <div className="editorial-overline">
          <span className="editorial-line" />
          A LITTLE SPACE FOR FOOD LOVERS
          <span className="editorial-line" />
        </div>

        <div className="editorial-heading">
          <span className="editorial-pretitle">WELCOME TO</span>

          <h1>
            Recipe<span>Box</span>
            <i>.</i>
          </h1>

          <div className="editorial-flower" aria-hidden="true">
            ✳
          </div>
        </div>

        <p className="editorial-description">
          Discover delicious recipes, find inspiration
          <br className="desktop-break" />
          in everyday ingredients, and make every
          <br className="desktop-break" />
          moment around the table a little more special.
        </p>

        <div className="editorial-divider">
          <span />
          <span className="editorial-divider-flower">✿</span>
          <span />
        </div>

        <p className="editorial-tagline">
          GOOD FOOD. GOOD MOOD. GOOD MEMORIES.
        </p>

        <button
          type="button"
          className="editorial-explore-button"
          onClick={() => setIsLeaving(true)}
          disabled={isLeaving}
        >
          <span>{isLeaving ? "Welcome to RecipeBox..." : "Explore recipes"}</span>
          <span className="editorial-arrow" aria-hidden="true">↗</span>
        </button>
      </section>

      {/* Footer */}
      <footer className="editorial-footer">
        <span>MADE WITH LOVE, FOR THE LOVE OF FOOD</span>
        <span className="editorial-footer-symbol">✳</span>
        <span>COOK · CREATE · SHARE</span>
      </footer>

      <span className="editorial-side-label" aria-hidden="true">
        YOUR EVERYDAY RECIPE JOURNAL
      </span>
    </main>
  );
}
