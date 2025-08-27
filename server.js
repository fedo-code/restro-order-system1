const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

// 1. Middleware Setup
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Move this to the end, after all routes





// Dummy About route
//app.get("/about", (req, res) => {
  //res.json({
    //description: "Global grace is a cozy Restro with kosher Certified"

  //});
//});

app.get("/api/about", (req, res) => {
  res.json({
    description: `🌍 Global Grace Harmony Inn

Global Grace Harmony Inn is more than just a restaurant — it’s a sanctuary of flavors where cultures unite through food.

🌏 Inspired by the spirit of unity, peace, and shared tradition, we bring you an interfaith-friendly dining experience. Every dish is crafted with respect for religious values, health, and authenticity.

🕊️ Our Philosophy:

• Serve food that nourishes the body and uplifts the soul.  
• Create a space where people of all religions can dine peacefully — whether you’re following Halal, Kosher, Sattvic, Jain, Vegetarian, or Vegan diets.

🥗 What We Serve:

• Jewish matzo ball soup and Kosher-friendly Mediterranean platters  
• Jain thali without onion, garlic, or root vegetables  
• Halal biryanis and Middle Eastern delicacies  
• Sattvic khichdi, temple-style prasadam  
• Vegan Buddha bowls and Buddhist-inspired meals  
• Global vegetarian and fusion plates for all tastes

🕍 Kosher Certified:

Yes, Global Grace Harmony Inn is Kosher-certified.

• We follow strict kosher preparation guidelines with separate utensils, trained staff, and sourcing based on Jewish dietary laws.  
• A certified mashgiach (supervisor) oversees daily kosher compliance.  
• Dairy and meat are kept separate, and all meat is kosher-slaughtered and approved.

✨ Our Promise:

🌿 100% Clean, Honest Ingredients  
🙏 Respect for All Faiths  
🍽️ Taste from Around the World  
❤️ Meals Served with Soul`
  });
});



// Update your create-order endpoint
app.post('/api/create-order', (req, res) => {
  try {
    const { amount } = req.body;
    
    // Validation
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    
    // Response format Razorpay ke hisab se
    res.json({
      id: `order_${Date.now()}`,
      amount: amount,
      currency: 'INR',
      receipt: 'rcpt_' + Math.random().toString(36).substr(2, 6)
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Static files (HTML, CSS, JS) from "public" folder
app.use(express.static(path.join(__dirname, "docs")));


// ✅ Catch-all route (must be AFTER API routes, BEFORE error handler)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "docs", "index.html"));
});

// ✅ Error handler (LAST MIDDLEWARE)

// 4. Error Handling (Must be last middleware)
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});
 


// Server Start
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
