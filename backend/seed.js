const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

const menuData = [
  // Starters
  { name: 'Paneer Tikka', description: 'Grilled paneer with spices', price: 220, category: 'Starters', isVeg: true },
  { name: 'Chicken Seekh Kebab', description: 'Minced chicken on skewers', price: 280, category: 'Starters', isVeg: false },
  { name: 'Crispy Veg Fingers', description: 'Golden fried veggie fingers', price: 160, category: 'Starters', isVeg: true },
  { name: 'Chicken Wings', description: 'Spicy masala wings', price: 300, category: 'Starters', isVeg: false },

  // Main Course
  { name: 'Butter Chicken', description: 'Creamy tomato curry with tender chicken', price: 320, category: 'Main Course', isVeg: false },
  { name: 'Paneer Butter Masala', description: 'Rich paneer in buttery gravy', price: 270, category: 'Main Course', isVeg: true },
  { name: 'Dal Makhani', description: 'Slow-cooked black lentils', price: 220, category: 'Main Course', isVeg: true },
  { name: 'Chicken Biryani', description: 'Fragrant basmati with spiced chicken', price: 350, category: 'Main Course', isVeg: false },
  { name: 'Veg Biryani', description: 'Fragrant basmati with mixed veggies', price: 260, category: 'Main Course', isVeg: true },

  // Breads
  { name: 'Butter Naan', description: 'Soft leavened bread with butter', price: 50, category: 'Breads', isVeg: true },
  { name: 'Garlic Naan', description: 'Naan with garlic and herb butter', price: 70, category: 'Breads', isVeg: true },
  { name: 'Tandoori Roti', description: 'Whole wheat bread from tandoor', price: 40, category: 'Breads', isVeg: true },

  // Drinks
  { name: 'Mango Lassi', description: 'Thick mango yogurt drink', price: 100, category: 'Drinks', isVeg: true },
  { name: 'Masala Chai', description: 'Spiced Indian tea', price: 60, category: 'Drinks', isVeg: true },
  { name: 'Fresh Lime Soda', description: 'Lime with soda, sweet or salted', price: 80, category: 'Drinks', isVeg: true },
  { name: 'Cold Coffee', description: 'Chilled blended coffee', price: 120, category: 'Drinks', isVeg: true },

  // Desserts
  { name: 'Gulab Jamun', description: 'Soft milk dumplings in sugar syrup', price: 90, category: 'Desserts', isVeg: true },
  { name: 'Kulfi', description: 'Traditional Indian ice cream', price: 100, category: 'Desserts', isVeg: true },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await MenuItem.deleteMany({});
  await MenuItem.insertMany(menuData);
  console.log('Menu seeded successfully');
  process.exit();
}

seed().catch(console.error);
