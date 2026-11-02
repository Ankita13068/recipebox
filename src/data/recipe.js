const recipes = [
  {
    id: "avocado-toast",
    name: "Avocado Toast",
    category: "Breakfast",
    time: 15,
    isVeg: true,
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=85",
    ingredients: [
      { id: "sourdough", name: "Sourdough bread" },
      { id: "avocado", name: "Ripe avocado" },
      { id: "lemon", name: "Fresh lemon" },
      { id: "chilli", name: "Chilli flakes" },
    ],
  },
  {
    id: "berry-pancakes",
    name: "Fluffy Homemade Pancakes",
    category: "Breakfast",
    time: 25,
    isVeg: true,
    image:
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=85",
    ingredients: [
      { id: "flour", name: "All-purpose flour" },
      { id: "milk", name: "Milk" },
      { id: "baking-powder", name: "Baking powder" },
      { id: "sugar", name: "Sugar" },
      { id: "butter", name: "Butter" },
      { id: "berries", name: "Mixed berries" },
      { id: "maple", name: "Maple syrup" },
    ],
  },
  {
    id: "tomato-pasta",
    name: "Garden Tomato Pasta",
    category: "Lunch",
    time: 30,
    isVeg: true,
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85",
    ingredients: [
      { id: "pasta", name: "Pasta" },
      { id: "tomatoes", name: "Cherry tomatoes" },
      { id: "basil", name: "Fresh basil" },
      { id: "parmesan", name: "Parmesan" },
      { id: "garlic", name: "Garlic" },
    ],
  },
  {
    id: "grain-bowl",
    name: "Roasted Veggie Bowl",
    category: "Lunch",
    time: 35,
    isVeg: true,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",
    ingredients: [
      { id: "quinoa", name: "Quinoa" },
      { id: "sweet-potato", name: "Sweet potato" },
      { id: "chickpeas", name: "Chickpeas" },
      { id: "greens", name: "Baby spinach" },
    ],
  },
  {
    id: "lemon-salmon",
    name: "Lemon Herb Salmon",
    category: "Dinner",
    time: 40,
    isVeg: false,
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=85",
    ingredients: [
      { id: "salmon", name: "Salmon fillets" },
      { id: "lemon", name: "Fresh lemon" },
      { id: "dill", name: "Fresh dill" },
      { id: "potatoes", name: "Baby potatoes" },
    ],
  },
  {
    id: "apple-crumble",
    name: "Warm Apple Crumble",
    category: "Dessert",
    time: 50,
    isVeg: true,
    image:
      "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=900&q=85",
    ingredients: [
      { id: "apples", name: "Apples" },
      { id: "oats", name: "Rolled oats" },
      { id: "cinnamon", name: "Cinnamon" },
      { id: "butter", name: "Butter" },
    ],
  },
];

export default recipes;