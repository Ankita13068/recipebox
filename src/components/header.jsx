export default function Header({
  activePage,
  onNavigateHome,
  onShareRecipe
}) {
  return (
    <header className="site-header">
      <div className="header-edition">
        A COLLECTION OF RECIPES & EVERYDAY INSPIRATION
      </div>

      <div className="header-inner">
        <a
          href="#hero"
          className="brand-logo"
          aria-label="RecipeBox home"
          onClick={(event) => onNavigateHome("hero", event)}
        >
          <span className="logo-symbol" aria-hidden="true">❖</span>
          <span className="logo-text">
            RecipeBox<span>.</span>
          </span>
        </a>

        <nav className="header-nav" aria-label="Main navigation">
          <a
            href="#hero"
            className="nav-link"
            onClick={(event) => onNavigateHome("hero", event)}
          >
            Home
          </a>
          <a
            href="#recipes"
            className="nav-link"
            onClick={(event) => onNavigateHome("recipes", event)}
          >
            The Recipes
          </a>
          <a
            href="#categories"
            className="nav-link"
            onClick={(event) => onNavigateHome("categories", event)}
          >
            Categories
          </a>
          <button
            className="nav-link nav-link-button"
            type="button"
            aria-current={activePage === "share" ? "page" : undefined}
            onClick={onShareRecipe}
          >
            Share Your Recipe
          </button>
        </nav>
      </div>
    </header>
  );
}
