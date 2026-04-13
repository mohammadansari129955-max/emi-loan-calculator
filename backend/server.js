const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Emi = require("./models/Emi");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/emiDB";
mongoose.connect(mongoUri)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// SIGN UP
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please provide name, email, and password." });
    }
    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered. Please log in." });
    }
    
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password,
    });
    
    await newUser.save();
    
    return res.status(201).json({
      message: "User signed up successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// LOG IN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password." });
    }
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    
    const isPasswordMatch = await user.comparePassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();
    
    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        loginCount: user.loginCount,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/calculate-emi", async (req, res) => {
  try {
    const { userId, name, email, amount, rate, time } = req.body;
    if (!userId || !name || !email || !amount || !rate || !time) {
      return res.status(400).json({ error: "Please provide userId, name, email, amount, rate, and time." });
    }

    const P = parseFloat(amount);
    const annualRate = parseFloat(rate);
    const N = parseFloat(time) * 12;
    const R = annualRate / 12 / 100;

    if (isNaN(P) || isNaN(annualRate) || isNaN(N) || P <= 0 || annualRate < 0 || N <= 0) {
      return res.status(400).json({ error: "Please enter valid numeric loan values." });
    }

    const emiValue = R === 0
      ? P / N
      : (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);

    const savedRecord = await Emi.create({
      userId,
      name,
      email,
      amount: P,
      rate: annualRate,
      time: parseFloat(time),
      emi: parseFloat(emiValue.toFixed(2)),
    });

    return res.json({ emi: savedRecord.emi, record: savedRecord });
  } catch (error) {
    console.error("Error saving EMI record:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await Emi.find({ userId }).sort({ date: -1 }).limit(20);
    return res.json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});