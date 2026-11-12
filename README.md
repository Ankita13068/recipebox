# 🌿 RecipeBox | A Digital Cookbook

RecipeBox is a botanical-inspired digital cookbook built with React and Vite. Browse a collection of recipes, find ideas by ingredient or category, save favourites, and add your own recipes to your browser's local collection.

## ✨ Features

### Editorial welcome
- Full-screen welcome screen with a subtle opening transition.
- Responsive, cookbook-inspired design.

### Recipe collection
- Browse recipe cards, ingredients, cooking times, and recipe details.
- Explore categories and identify vegetarian and non-vegetarian recipes.
- Search by recipe name, category, ingredients, or instructions.
- Combine search with category, dietary, and favourites filters.
- Save and remove favourites for the current browsing session.
- Clear filters and get feedback when no recipes match.

### Share a recipe
- Submit a recipe with its category, cooking time, dietary preference, ingredients, and instructions.
- Upload and preview a JPG, PNG, or WebP photo, or use the default image.
- View submitted recipes in the collection and delete them with confirmation.

### Local browser storage
- Community recipes are saved in `localStorage` and remain available after a refresh in the same browser.
- No backend or database is required.

> **Note:** Community recipes and uploaded photos are stored only in the visitor's browser. They are not shared across devices or with other visitors. Favourites are not persisted after a page refresh.

## 🎨 Design palette

| Colour | Hex code |
|---|---|
| Sage Green | `#82977C` |
| Deep Forest | `#344B38` |
| Warm Cream | `#F5F3EB` |
| Soft White | `#FFFDF8` |
| Muted Beige | `#E8E4D8` |

## 🛠️ Technologies

- React and React Hooks
- Vite
- JavaScript (ES6+)
- HTML5 and CSS3
- Browser `localStorage`

## 🚀 Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm
- Git

### Installation

```bash
git clone https://github.com/Ankita13068/recipebox.git
cd recipebox
npm install
npm run dev
```

Open the local URL printed by Vite in your browser.

### Available scripts

```bash
npm run dev      # Start the development server
npm run build    # Create a production build
npm run preview  # Preview the production build
npm run lint     # Run ESLint
```

## 📸 Screenshots

### Editorial welcome
![RecipeBox editorial welcome screen](screenshots/book-intro.png)

### Laptop homepage
![RecipeBox homepage at laptop size](screenshots/homepage.png)

### Recipe collection
![Recipe collection and filters](screenshots/recipe-collection.png)

### Recipe details
![Recipe details](screenshots/recipe-details.png)

### Share a recipe
![Share a recipe form](screenshots/share-recipe.png)

### Community recipes
![Community recipes in the collection](screenshots/community-recipes.png)

## 📂 Project structure

```text
recipebox/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── screenshots/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── BookIntro.css
│   │   ├── BookIntro.jsx
│   │   ├── header.jsx
│   │   ├── IngredientList.jsx
│   │   ├── RecipeDetails.css
│   │   ├── RecipeDetails.jsx
│   │   ├── recipecard.jsx
│   │   ├── ShareRecipe.css
│   │   └── ShareRecipe.jsx
│   ├── data/
│   │   ├── communityRecipes.js
│   │   └── recipe.js
│   ├── app.css
│   ├── app.jsx
│   ├── index.css
│   └── main.jsx
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## 🎯 Project objective

RecipeBox is a hands-on React project exploring component-based development, state and props, hooks, dynamic rendering, search and filtering, form handling, browser storage, and responsive design.

## 🌱 Future improvements

- Persist favourites between visits.
- Add recipe ratings and reviews.
- Provide more discovery and sorting options.
- Add shared collections with a backend and user accounts.

## 👩‍💻 Author

**Ankita** · Frontend Development Project
*Made with 🌿 and a love for good food.*
