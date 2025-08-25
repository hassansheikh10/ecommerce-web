const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;

    const userExist = await User.findOne({ where: { email } });
    if (userExist) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    res.json({ message: "User created successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const data = { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address, isAdmin: user.isAdmin, token: token, message: "Login Successful!" }

    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};