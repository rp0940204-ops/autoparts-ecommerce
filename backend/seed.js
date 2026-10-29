const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product");

const products = [
  { name: "Ceramic Brake Pads (Front)", description: "Low-dust ceramic brake pads for smooth stopping.", price: 2499, category: "Brakes", brand: "StopWell", stock: 40 },
  { name: "12V Car Battery 45Ah", description: "Maintenance-free battery with 36-month warranty.", price: 5999, category: "Batteries", brand: "PowerMax", stock: 15 },
  { name: "All-Season Tyre 195/65 R15", description: "Durable tyre with good wet grip.", price: 4200, category: "Tyres", brand: "RoadGrip", stock: 30 },
  { name: "Engine Oil 5W-30 (4L)", description: "Fully synthetic engine oil.", price: 2800, category: "Engine", brand: "SmoothFlow", stock: 60 },
  { name: "LED Headlight Bulb H4", description: "Bright white LED bulb, easy plug-in fit.", price: 1499, category: "Lights", brand: "BrightBeam", stock: 50 },
  { name: "Wiper Blades (Pair)", description: "Streak-free silicone wiper blades.", price: 699, category: "Accessories", brand: "ClearView", stock: 80 },
  { name: "Air Filter", description: "High-flow air filter for better engine breathing.", price: 450, category: "Engine", brand: "PureAir", stock: 70 },
  { name: "Car Tool Kit (50 pcs)", description: "Basic toolkit for roadside repairs.", price: 1899, category: "Tools", brand: "FixIt", stock: 25 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Added " + products.length + " products");
  } catch (err) {
    console.log("Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();