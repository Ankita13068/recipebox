import { useCallback, useRef, useState } from "react";
import BookIntro from "./components/BookIntro.jsx";
import Header from "./components/header.jsx";
import RecipeDetails from "./components/RecipeDetails.jsx";
import RecipeCard from "./components/recipecard.jsx";
import ShareRecipe from "./components/ShareRecipe.jsx";
import placeholderImage from "./assets/hero.png";
import recipes from "./data/recipe.js";
import {
  loadCommunityRecipes,
  saveCommunityRecipes
} from "./data/communityRecipes.js";
import "./App.css";

function loadCommunityStorageState() {
  try {
    return {
      recipes: loadCommunityRecipes(),
      ready: true,
      message: ""
    };
  } catch (error) {
    console.error("Could not load saved community recipes.", error);
    return {
      recipes: [],
      ready: false,
      message:
        "Saved community recipes could not be loaded. Browser storage may be unavailable or contain invalid data."
    };
  }
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hasOpenedBook, setHasOpenedBook] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [communityStorage, setCommunityStorage] = useState(
    loadCommunityStorageState
  );
  const [activePage, setActivePage] = useState("home");
  const recipeTriggerRef = useRef(null);

  const { recipes: communityRecipes, ready: storageReady, message: storageMessage } =
    communityStorage;
  const featuredRecipe = recipes[0];
  const allRecipes = [...recipes, ...communityRecipes];

  // Generate categories from the recipe data.
  const categories = Array.from(
    new Map(
      allRecipes.map((recipe) => [
        recipe.category,
        {
          name: recipe.category,
          image: recipe.image || placeholderImage,
          count: allRecipes.filter(
            (item) => item.category === recipe.category
          ).length
        }
      ])
    ).values()
  );

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredRecipes = allRecipes.filter((recipe) => {
    const searchableText = [
      recipe.name,
      recipe.category,
      recipe.instructions || "",
      ...recipe.ingredients.map((ingredient) => ingredient.name)
    ]
      .join(" ")
      .toLowerCase();
    const matchesSearch =
      !normalizedSearch || searchableText.includes(normalizedSearch);

    const matchesDiet =
      activeFilter === "all" ||
      (activeFilter === "veg" && recipe.isVeg) ||
      (activeFilter === "nonveg" && !recipe.isVeg);

    const matchesCategory =
      selectedCategory === "all" ||
      recipe.category === selectedCategory;

    return matchesSearch && matchesDiet && matchesCategory;
  });

  function resetFilters() {
    setSearchTerm("");
    setActiveFilter("all");
    setSelectedCategory("all");
  }

  function handleSearchSubmit() {
    if (searchTerm.trim()) {
      document.getElementById("recipes")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  function selectCategory(category) {
    setSelectedCategory(category);

    document.getElementById("recipes")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  const closeRecipe = useCallback(() => setSelectedRecipe(null), []);

  function updateStorageMessage(message) {
    setCommunityStorage((currentStorage) => ({
      ...currentStorage,
      message
    }));
  }

  function openRecipe(recipe, event) {
    recipeTriggerRef.current = event.currentTarget;
    setSelectedRecipe(recipe);
  }

  function publishCommunityRecipe(recipe) {
    if (!storageReady) {
      updateStorageMessage(
        "Saved recipes are unavailable, so this recipe cannot be added without risking existing browser data."
      );
      return false;
    }

    if (allRecipes.some((existingRecipe) => existingRecipe.id === recipe.id)) {
      updateStorageMessage("A recipe with this ID already exists. Please try publishing again.");
      return false;
    }

    const updatedRecipes = [recipe, ...communityRecipes];
    try {
      saveCommunityRecipes(updatedRecipes);
      setCommunityStorage({
        recipes: updatedRecipes,
        ready: true,
        message: ""
      });
      return true;
    } catch (error) {
      console.error("Could not save the community recipe.", error);
      updateStorageMessage(
        error?.name === "QuotaExceededError"
          ? "Browser storage is full. Remove a shared recipe or choose a smaller photo, then try again."
          : "The recipe could not be saved. Browser storage may be unavailable."
      );
      return false;
    }
  }

  function deleteCommunityRecipe(recipeId) {
    const updatedRecipes = communityRecipes.filter(
      (recipe) => recipe.id !== recipeId
    );

    try {
      saveCommunityRecipes(updatedRecipes);
      setCommunityStorage({
        recipes: updatedRecipes,
        ready: true,
        message: ""
      });
      setSelectedRecipe(null);
      return true;
    } catch (error) {
      console.error("Could not delete the community recipe.", error);
      updateStorageMessage(
        "The recipe could not be deleted because browser storage is unavailable."
      );
      return false;
    }
  }

  function navigateToHomeSection(section, event) {
    if (activePage === "share") {
      event.preventDefault();
      setActivePage("home");
      window.requestAnimationFrame(() => {
        document.getElementById(section)?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    }
  }

  function viewCollection() {
    setActivePage("home");
    window.requestAnimationFrame(() => {
      document.getElementById("recipes")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }

  if (!hasOpenedBook) {
    return (
      <BookIntro
        featuredRecipe={featuredRecipe}
        onOpen={() => setHasOpenedBook(true)}
      />
    );
  }

  return (
    <div className="app-shell">
      <Header
        activePage={activePage}
        onNavigateHome={navigateToHomeSection}
        onShareRecipe={() => {
          setActivePage("share");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {storageMessage && activePage === "home" && (
        <p className="app-storage-message" role="alert">
          {storageMessage}
        </p>
      )}

      {activePage === "share" ? (
        <ShareRecipe
          categories={categories.map((category) => category.name)}
          storageMessage={storageMessage}
          onPublish={publishCommunityRecipe}
          onViewCollection={viewCollection}
        />
      ) : (
      <main>
        {/* Hero section */}
        <section id="hero" className="hero-section">
          <div className="hero-content">
            <span className="hero-kicker">
              THE EVERYDAY TABLE · ISSUE NO. 01
            </span>

            <h1 className="hero-title">
              A taste of
              <br />
              something <em>beautiful.</em>
            </h1>

            <p className="hero-description">
              A collection of thoughtful recipes, seasonal
              inspiration and little moments worth sharing
              around the table.
            </p>

            <a href="#recipes" className="hero-cta">
              Explore the collection
              <span aria-hidden="true">↗</span>
            </a>

            <div className="hero-note">
              <span className="hero-note-icon">✳</span>
              GOOD FOOD. SLOW MOMENTS. EVERYDAY MAGIC.
            </div>
          </div>

          <div className="hero-media">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1100&q=85"
              alt="Fresh ingredients arranged in a beautiful kitchen"
              className="hero-image"
            />

            <div className="hero-image-caption">
              <span>THE ART OF EVERYDAY COOKING</span>
              <span>01 / 08</span>
            </div>

            <span className="hero-decoration" aria-hidden="true">
              ✳
            </span>
          </div>
        </section>

        {/* Featured editorial recipe */}
        {featuredRecipe && (
          <section className="featured-section">
            <div className="featured-heading">
              <div>
                <span className="section-kicker">
                  FROM OUR EDITOR'S TABLE
                </span>

                <h2 className="section-title">
                  The recipe spotlight
                </h2>
              </div>

              <span className="featured-number">
                VOL. 01 · FEATURE 001
              </span>
            </div>

            <div className="featured-card">
              <div className="featured-image-wrap">
                <img
                  src={featuredRecipe.image}
                  alt={featuredRecipe.name}
                  className="featured-image"
                />

                <span className="featured-image-label">
                  THIS WEEK'S PICK
                </span>
              </div>

              <div className="featured-content">
                <span className="featured-kicker">
                  {featuredRecipe.category}
                </span>

                <h2>{featuredRecipe.name}</h2>

                <p>
                  Every memorable meal begins with a little
                  inspiration. Discover this week's featured
                  recipe and bring something delicious to your table.
                </p>

                <div className="featured-meta">
                  <span>◷ {featuredRecipe.time} minutes</span>

                  <span>
                    {featuredRecipe.isVeg
                      ? "● Vegetarian"
                      : "● Non-Vegetarian"}
                  </span>
                </div>

                <a
                  href={`#recipe-${featuredRecipe.id}`}
                  className="featured-link"
                >
                  Read the recipe <span>↗</span>
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Category explorer */}
        <section id="categories" className="category-section">
          <div className="category-heading">
            <div>
              <span className="section-kicker">
                A WORLD OF FLAVOUR
              </span>

              <h2 className="section-title">
                Browse the chapters
              </h2>

              <p className="section-subtitle">
                Find a little inspiration for whatever you're craving.
              </p>
            </div>

            <button
              type="button"
              className="category-reset"
              onClick={resetFilters}
            >
              View all recipes ↗
            </button>
          </div>

          <div className="category-grid">
            {categories.map((category, index) => (
              <button
                type="button"
                key={category.name}
                className={`category-card ${
                  selectedCategory === category.name
                    ? "category-selected"
                    : ""
                }`}
                aria-pressed={selectedCategory === category.name}
                onClick={() => selectCategory(category.name)}
              >
                <div className="category-image-wrap">
                  <img
                    src={category.image}
                    alt=""
                    className="category-image"
                    loading="lazy"
                  />

                  <span className="category-image-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="category-card-info">
                  <span>{category.name}</span>

                  <small>
                    {category.count}{" "}
                    {category.count === 1 ? "recipe" : "recipes"}
                  </small>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Recipe collection */}
        <section id="recipes" className="main-content">
          <div className="collection-header">
            <div>
              <span className="section-kicker">
                THE RECIPE ARCHIVE · 001
              </span>

              <h2 className="section-title">
                Explore Recipes
              </h2>

              <p className="section-subtitle">
                Good food begins with a little inspiration.
              </p>
            </div>

            <div className="collection-controls">
              <form
                className="collection-search"
                role="search"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSearchSubmit();
                }}
              >
                <svg
                  className="search-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  className="search-input"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search recipes or ingredients..."
                  aria-label="Search recipes or ingredients"
                  autoComplete="off"
                />
                {searchTerm && (
                  <button
                    className="clear-btn"
                    type="button"
                    aria-label="Clear search"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => setSearchTerm("")}
                  >
                    ×
                  </button>
                )}
              </form>

              <div
                className="filter-group"
                role="group"
                aria-label="Filter recipes by dietary preference"
              >
                {[
                  { label: "All recipes", value: "all" },
                  { label: "Vegetarian", value: "veg" },
                  { label: "Non-Veg", value: "nonveg" }
                ].map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    className={`filter-btn ${
                      activeFilter === filter.value ? "active" : ""
                    }`}
                    aria-pressed={activeFilter === filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="collection-toolbar">
            <p className="results-count" aria-live="polite">
              Showing {filteredRecipes.length}{" "}
              {filteredRecipes.length === 1 ? "recipe" : "recipes"}
            </p>

            {selectedCategory !== "all" && (
              <button
                type="button"
                className="clear-category"
                onClick={() => setSelectedCategory("all")}
              >
                {selectedCategory} ×
              </button>
            )}
          </div>

          {filteredRecipes.length > 0 ? (
            <div className="recipe-grid">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onSelect={(event) => openRecipe(recipe, event)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">✳</span>

              <h3>Nothing on the menu just yet.</h3>

              <p>
                Try another search or explore a different category.
              </p>

              <button
                type="button"
                className="reset-btn"
                onClick={resetFilters}
              >
                Explore all recipes
              </button>
            </div>
          )}
        </section>
      </main>
      )}

      {/* Footer */}
      <footer className="site-footer">
        <a
          href="#hero"
          className="footer-brand"
          onClick={(event) => navigateToHomeSection("hero", event)}
        >
          RecipeBox<span>.</span>
        </a>

        <p>A little inspiration. A lot of flavour.</p>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} RecipeBox</span>
          <span>MADE FOR THE LOVE OF FOOD</span>
          <a href="#hero" onClick={(event) => navigateToHomeSection("hero", event)}>
            Back to top ↑
          </a>
        </div>
      </footer>
      {selectedRecipe && (
        <RecipeDetails
          recipe={selectedRecipe}
          onClose={closeRecipe}
          onDelete={deleteCommunityRecipe}
          returnFocusRef={recipeTriggerRef}
        />
      )}
    </div>
  );
}