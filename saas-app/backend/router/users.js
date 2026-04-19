const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

const SECRET = "meu-segredo-super-forte";

// Banco fake em memória
let users = [];
let nextId = 1;

/*
  user model example:
  {
    id: 1,
    name: "João",
    email: "joao@gmail.com",
    password: "hash",
    role: "admin" | "user",
    createdAt: "2026-04-19T..."
  }
*/

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required"
      });
    }

    const userExists = users.find((user) => user.email === email);

    if (userExists) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      id: nextId++,
      name,
      email,
      password: passwordHash,
      role: role === "admin" ? "admin" : "user",
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required"
      });
    }

    const user = users.find((item) => item.email === email);

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PROFILE - usuário logado
router.get("/me", auth, (req, res) => {
  try {
    const user = users.find((item) => item.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE PROFILE - usuário logado
router.put("/me", auth, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userIndex = users.findIndex((item) => item.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    if (email) {
      const emailExists = users.find(
        (item) => item.email === email && item.id !== req.user.id
      );

      if (emailExists) {
        return res.status(400).json({ error: "Email already in use" });
      }

      users[userIndex].email = email;
    }

    if (name) {
      users[userIndex].name = name;
    }

    if (password) {
      users[userIndex].password = await bcrypt.hash(password, 10);
    }

    return res.json({
      message: "Profile updated successfully",
      user: {
        id: users[userIndex].id,
        name: users[userIndex].name,
        email: users[userIndex].email,
        role: users[userIndex].role,
        createdAt: users[userIndex].createdAt
      }
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// LIST USERS - só admin
router.get("/", auth, isAdmin, (req, res) => {
  try {
    const safeUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }));

    return res.json(safeUsers);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET USER BY ID - só admin
router.get("/:id", auth, isAdmin, (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = users.find((item) => item.id === id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE USER BY ID - só admin
router.put("/:id", auth, isAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, email, password, role } = req.body;

    const userIndex = users.findIndex((item) => item.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    if (email) {
      const emailExists = users.find(
        (item) => item.email === email && item.id !== id
      );

      if (emailExists) {
        return res.status(400).json({ error: "Email already in use" });
      }

      users[userIndex].email = email;
    }

    if (name) {
      users[userIndex].name = name;
    }

    if (password) {
      users[userIndex].password = await bcrypt.hash(password, 10);
    }

    if (role && (role === "admin" || role === "user")) {
      users[userIndex].role = role;
    }

    return res.json({
      message: "User updated successfully",
      user: {
        id: users[userIndex].id,
        name: users[userIndex].name,
        email: users[userIndex].email,
        role: users[userIndex].role,
        createdAt: users[userIndex].createdAt
      }
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE USER BY ID - só admin
router.delete("/:id", auth, isAdmin, (req, res) => {
  try {
    const id = Number(req.params.id);

    const userExists = users.find((item) => item.id === id);

    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    users = users.filter((item) => item.id !== id);

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;