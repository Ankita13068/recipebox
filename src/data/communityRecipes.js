const STORAGE_KEY = "recipebox.communityRecipes.v1";

function isValidCommunityRecipe(recipe) {
  return Boolean(
    recipe &&
      typeof recipe.id === "string" &&
      recipe.isCommunity === true &&
      typeof recipe.name === "string" &&
      recipe.name.trim() &&
      typeof recipe.category === "string" &&
      recipe.category.trim() &&
      Number.isFinite(recipe.time) &&
      recipe.time > 0 &&
      typeof recipe.isVeg === "boolean" &&
      Array.isArray(recipe.ingredients) &&
      recipe.ingredients.length > 0 &&
      recipe.ingredients.every(
        (ingredient) =>
          ingredient &&
          typeof ingredient.name === "string" &&
          ingredient.name.trim()
      ) &&
      typeof recipe.instructions === "string" &&
      recipe.instructions.trim() &&
      typeof recipe.image === "string"
  );
}

export function loadCommunityRecipes() {
  const storedRecipes = window.localStorage.getItem(STORAGE_KEY);
  if (storedRecipes === null) return [];

  const parsedRecipes = JSON.parse(storedRecipes);
  if (
    !Array.isArray(parsedRecipes) ||
    !parsedRecipes.every(isValidCommunityRecipe)
  ) {
    throw new Error("Stored community recipes have an invalid format.");
  }

  return parsedRecipes;
}

export function saveCommunityRecipes(recipes) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}
