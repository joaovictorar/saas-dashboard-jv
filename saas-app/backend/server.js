require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

const SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI);

mongoose.connection.on("connected", () => {
  console.log("MongoDB conectado 🚀");
});

mongoose.connection.on("error", (err) => {
  console.log("Erro no MongoDB:", err.message);
});

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hash
    });

    await user.save();

    res.status(201).json({ message: "User saved in DB" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ email, id: user._id }, SECRET, {
      expiresIn: "1d"
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/dashboard", (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    const decoded = jwt.verify(token, SECRET);

    res.json({
      message: "Welcome " + decoded.email,
      data: [
        { name: "Revenue", value: "$1200" },
        { name: "Users", value: "320" }
      ]
    });
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});