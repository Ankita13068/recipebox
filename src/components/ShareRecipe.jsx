import { useRef, useState } from "react";
import placeholderImage from "../assets/hero.png";
import "./ShareRecipe.css";

const MAX_UPLOAD_SIZE = 8 * 1024 * 1024;
const MAX_STORED_IMAGE_LENGTH = 700_000;
const allowedExtensions = new Set(["jpg", "jpeg", "png", "webp"]);
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function createRecipeId() {
  const uniqueId = window.crypto?.randomUUID?.();
  return `community-${uniqueId || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
}

async function compressImage(file) {
  const imageUrl = URL.createObjectURL(file);

  try {
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error("This image could not be opened."));
      image.src = imageUrl;
    });

    if (!image.naturalWidth || !image.naturalHeight) {
      throw new Error("This image has no readable dimensions.");
    }

    if (image.naturalWidth * image.naturalHeight > 40_000_000) {
      throw new Error("Choose an image with fewer than 40 megapixels.");
    }

    const scale = Math.min(
      1,
      1200 / Math.max(image.naturalWidth, image.naturalHeight)
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("This browser could not prepare the image.");
    }

    context.fillStyle = "#fffdf8";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    for (const quality of [0.82, 0.7, 0.58, 0.46]) {
      const compressedImage = canvas.toDataURL("image/jpeg", quality);
      if (compressedImage.length <= MAX_STORED_IMAGE_LENGTH) {
        return compressedImage;
      }
    }

    throw new Error("This photo is still too large after compression. Choose a smaller image.");
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

function createEmptyForm() {
  return {
    name: "",
    category: "",
    time: "",
    diet: "",
    ingredients: [""],
    instructions: ""
  };
}

export default function ShareRecipe({
  categories,
  storageMessage,
  onPublish,
  onViewCollection
}) {
  const [form, setForm] = useState(createEmptyForm);
  const [photo, setPhoto] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLockRef = useRef(false);

  function updateField(field, value) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setFormError("");
    setSuccessMessage("");
  }

  function updateIngredient(index, value) {
    setForm((currentForm) => ({
      ...currentForm,
      ingredients: currentForm.ingredients.map((ingredient, ingredientIndex) =>
        ingredientIndex === index ? value : ingredient
      )
    }));
    setFormError("");
    setSuccessMessage("");
  }

  function addIngredient() {
    setForm((currentForm) => ({
      ...currentForm,
      ingredients: [...currentForm.ingredients, ""]
    }));
  }

  function removeIngredient(index) {
    setForm((currentForm) => ({
      ...currentForm,
      ingredients: currentForm.ingredients.filter(
        (_, ingredientIndex) => ingredientIndex !== index
      )
    }));
    setFormError("");
  }

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setPhotoError("");
    setSuccessMessage("");

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (
      !allowedExtensions.has(extension) ||
      (file.type && !allowedMimeTypes.has(file.type.toLowerCase()))
    ) {
      setPhotoError("Choose a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      setPhotoError("Choose an image smaller than 8 MB.");
      return;
    }

    try {
      const compressedPhoto = await compressImage(file);
      setPhoto(compressedPhoto);
    } catch (error) {
      setPhotoError(error.message);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (submitLockRef.current) return;

    const cleanIngredients = form.ingredients
      .map((ingredient) => ingredient.trim())
      .filter(Boolean);
    const cookingTime = Number(form.time);

    if (
      !form.name.trim() ||
      !form.category.trim() ||
      !Number.isInteger(cookingTime) ||
      cookingTime < 1 ||
      cookingTime > 1440 ||
      !form.diet ||
      cleanIngredients.length === 0 ||
      !form.instructions.trim()
    ) {
      setFormError("Complete each required field before publishing.");
      return;
    }

    submitLockRef.current = true;
    setIsSubmitting(true);
    setFormError("");
    setSuccessMessage("");

    const id = createRecipeId();
    const recipe = {
      id,
      name: form.name.trim(),
      category: form.category.trim(),
      time: cookingTime,
      isVeg: form.diet === "veg",
      image: photo,
      isCommunity: true,
      instructions: form.instructions.trim(),
      ingredients: cleanIngredients.map((name, index) => ({
        id: `${id}-ingredient-${index + 1}`,
        name
      }))
    };

    const saved = onPublish(recipe);
    if (saved) {
      setForm(createEmptyForm());
      setPhoto("");
      setPhotoError("");
      setSuccessMessage("Your recipe is now part of the RecipeBox collection.");
    } else {
      setFormError("Your recipe could not be saved. Check the storage message above and try again.");
    }

    setIsSubmitting(false);
    submitLockRef.current = false;
  }

  return (
    <main className="share-recipe-page">
      <header className="share-recipe-heading">
        <p className="section-kicker">A COMMUNITY COOKBOOK</p>
        <h1 className="section-title">Share your recipe</h1>
        <p>
          Every table has a story. Add a favourite recipe and pass a little
          inspiration along.
        </p>
      </header>

      {storageMessage && (
        <p className="share-storage-message" role="alert">
          {storageMessage}
        </p>
      )}
      {successMessage && (
        <div className="share-success-message" role="status">
          <span>{successMessage}</span>
          <button type="button" onClick={onViewCollection}>
            View the collection
          </button>
        </div>
      )}

      <div className="share-recipe-layout">
        <form className="share-recipe-form" onSubmit={handleSubmit}>
          <div className="share-form-grid">
            <div className="share-field share-field--wide">
              <label htmlFor="shared-recipe-name">Recipe name</label>
              <input
                id="shared-recipe-name"
                name="name"
                maxLength={100}
                required
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="e.g. Sunday garden pasta"
              />
            </div>

            <div className="share-field">
              <label htmlFor="shared-recipe-category">Category</label>
              <input
                id="shared-recipe-category"
                name="category"
                list="recipe-category-suggestions"
                maxLength={40}
                required
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
                placeholder="Breakfast, lunch, dessert..."
              />
              <datalist id="recipe-category-suggestions">
                {categories.map((category) => (
                  <option value={category} key={category} />
                ))}
              </datalist>
            </div>

            <div className="share-field">
              <label htmlFor="shared-recipe-time">Cooking time</label>
              <div className="share-time-input">
                <input
                  id="shared-recipe-time"
                  name="time"
                  type="number"
                  min="1"
                  max="1440"
                  step="1"
                  required
                  value={form.time}
                  onChange={(event) => updateField("time", event.target.value)}
                  placeholder="30"
                />
                <span>minutes</span>
              </div>
            </div>

            <fieldset className="share-field share-diet-field">
              <legend>Diet type</legend>
              <div className="share-diet-options">
                <label>
                  <input
                    type="radio"
                    name="diet"
                    value="veg"
                    required
                    checked={form.diet === "veg"}
                    onChange={(event) => updateField("diet", event.target.value)}
                  />
                  Vegetarian
                </label>
                <label>
                  <input
                    type="radio"
                    name="diet"
                    value="nonveg"
                    checked={form.diet === "nonveg"}
                    onChange={(event) => updateField("diet", event.target.value)}
                  />
                  Non-Veg
                </label>
              </div>
            </fieldset>

            <div className="share-field share-field--wide">
              <div className="share-field-heading">
                <label>Ingredients</label>
                <button
                  className="share-text-button"
                  type="button"
                  onClick={addIngredient}
                >
                  + Add ingredient
                </button>
              </div>
              <div className="share-ingredient-fields">
                {form.ingredients.map((ingredient, index) => (
                  <div className="share-ingredient-row" key={index}>
                    <input
                      aria-label={`Ingredient ${index + 1}`}
                      maxLength={100}
                      required
                      value={ingredient}
                      onChange={(event) =>
                        updateIngredient(index, event.target.value)
                      }
                      placeholder={`Ingredient ${index + 1}`}
                    />
                    {form.ingredients.length > 1 && (
                      <button
                        type="button"
                        className="share-remove-ingredient"
                        aria-label={`Remove ingredient ${index + 1}`}
                        onClick={() => removeIngredient(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="share-field share-field--wide">
              <label htmlFor="shared-recipe-instructions">
                Cooking instructions
              </label>
              <textarea
                id="shared-recipe-instructions"
                name="instructions"
                rows="6"
                maxLength={5000}
                required
                value={form.instructions}
                onChange={(event) =>
                  updateField("instructions", event.target.value)
                }
                placeholder="Write the steps in the order you cook them..."
              />
            </div>

            <div className="share-field share-field--wide">
              <span className="share-label">Recipe photograph (optional)</span>
              <div className={`share-photo-uploader${photo ? " has-photo" : ""}`}>
                <img
                  src={photo || placeholderImage}
                  alt={photo ? "Selected recipe photograph preview" : "RecipeBox photo placeholder"}
                />
                <div>
                  <strong>{photo ? "Photo ready to share" : "Add a little visual inspiration"}</strong>
                  <p id="share-photo-hint">
                    JPG, PNG, or WebP · up to 8 MB before compression
                  </p>
                  <input
                    id="shared-recipe-photo"
                    className="share-photo-input"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    aria-describedby="share-photo-hint share-photo-error"
                    onChange={handlePhotoChange}
                  />
                  <label className="share-photo-button" htmlFor="shared-recipe-photo">
                    {photo ? "Choose another photo" : "Choose a photo"}
                  </label>
                  {photo && (
                    <button
                      type="button"
                      className="share-text-button share-photo-remove"
                      onClick={() => {
                        setPhoto("");
                        setPhotoError("");
                      }}
                    >
                      Remove photo
                    </button>
                  )}
                  {photoError && (
                    <p className="share-field-error" id="share-photo-error" role="alert">
                      {photoError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {formError && (
            <p className="share-field-error share-submit-error" role="alert">
              {formError}
            </p>
          )}

          <div className="share-form-footer">
            <p>Your recipe is saved only in this browser, not shared across devices.</p>
            <button
              className="share-publish-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publishing..." : "Publish recipe"}
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </form>

        <aside className="share-recipe-preview" aria-label="Recipe card preview">
          <p className="section-kicker">YOUR CONTRIBUTION</p>
          <div className="share-preview-image">
            <img src={photo || placeholderImage} alt="" />
            <span>COMMUNITY RECIPE</span>
          </div>
          <p className="share-preview-category">{form.category || "Recipe category"}</p>
          <h2>{form.name || "Your recipe title"}</h2>
          <p className="share-preview-meta">
            {form.time ? `${form.time} minutes` : "Cooking time"}
            {form.diet && ` · ${form.diet === "veg" ? "Vegetarian" : "Non-Veg"}`}
          </p>
          <p className="share-preview-note">
            A lovely new story to add to the RecipeBox table.
          </p>
        </aside>
      </div>
    </main>
  );
}
