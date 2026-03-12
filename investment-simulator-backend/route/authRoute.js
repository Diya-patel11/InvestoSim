const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");  // ✅ Ensure correct path
const router = express.Router();

// 🔹 Register Route
//const bcrypt = require("bcrypt");

/*router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: "User already exists!" });

        console.log("🔍 Raw password before hashing:", password);

        // Ensure password is hashed only once
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log("🔐 Hashed password before saving:", hashedPassword);

        user = new User({ username, email, password: hashedPassword });
        await user.save();

        console.log("✅ User successfully registered!");

        res.status(201).json({ message: "Registration successful!", userId: user._id });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ error: "Server error" });
    }
});*/
// Register Route
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: "User already exists!" });

        console.log("🔍 Raw password before hashing:", password);

        // ❌ Remove manual hashing (UserSchema pre-save already handles it)
        user = new User({ username, email, password });
        await user.save();

        console.log("✅ User successfully registered!");

        res.status(201).json({ message: "Registration successful!", userId: user._id });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ error: "Server error" });
    }
});


// 🔹 Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required!" });
    }

    try {
        const user = await User.findOne({ email });

        console.log("🔍 User found in DB:", user);

        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        console.log("🔑 Entered password:", password);
        console.log("🔐 Stored password hash:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        //const isMatch = await bcrypt.compare(req.body.password, user.password);
        //const isMatch = await bcrypt.compare(req.body.password.trim(), user.password);

        console.log("🔐 Password Match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials!" });
        }

        const token = jwt.sign(
            { _id: user._id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.json({
            message: "Login successful!",
            token,
            userId: user._id.toString(),  // ✅ Ensure userId is a string
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });
        

        /*res.json({
            message: "Login successful!",
            token,
            user: { _id: user._id, username: user.username, email: user.email }
        });*/
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Server error!" });
    }
});


module.exports = router;