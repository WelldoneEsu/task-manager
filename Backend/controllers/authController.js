//authController.js
const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcrypt');

const usersFile = path.join(__dirname, '../data/users.json');

// Helper: read users.json
async function getUsers() {
  return fs.readJSON(usersFile).catch(() => []);
}

// Helper: save users.json
async function saveUsers(users) {
  return fs.writeJSON(usersFile, users, { spaces: 2 });
}

// @desc Signup new user
exports.signup = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: "❌Name and password required" });
    }

    const users = await getUsers();

    if (users.find(u => u.name === name)) {
      return res.status(400).json({ error: "❌Name already exists" });
    }

    // 🔑 Hash password before saving
    const hashed = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      name,
      password: hashed
    };

    users.push(newUser);
    await saveUsers(users);

    res.status(201).json({ message: "✅User registered" });
  } catch (err) {
    res.status(500).json({ error: "❌Server error" });
  }
};

// @desc Login user
exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;
    const users = await getUsers();

    const user = users.find(u => u.name === name);
    if (!user) return res.status(400).json({ error: "❌Invalid name" });

    // 🔑 Compare plain password with hashed password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "❌Invalid password" });

    req.session.userId = user.id;
    req.session.name = user.name;

    res.json({
      message: "✅Login successful",
      user: { id: user.id, name: user.name }
    });
  } catch (err) {
    res.status(500).json({ error: "❌Server error" });
  }
};

// @desc Logout user
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
};
