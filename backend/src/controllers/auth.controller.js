import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
    try {
        const { users, name, email, password, role } = req.body;

        /* ================= BULK REGISTER ================= */
        if (Array.isArray(users)) {

            if (users.length === 0) {
                return res.status(400).json({ message: "Users array is empty" });
            }

            // Validate rows
            for (let i = 0; i < users.length; i++) {
                const u = users[i];
                if (!u.name || !u.email || !u.password) {
                    return res.status(400).json({
                        message: `Invalid data at row ${i + 1}`
                    });
                }
            }

            // Check duplicate emails in DB
            const emails = users.map(u => u.email);
            const existing = await User.find({ email: { $in: emails } });

            if (existing.length > 0) {
                return res.status(409).json({
                    message: "Some users already exist",
                    existingEmails: existing.map(u => u.email)
                });
            }

            // Hash passwords SAFELY
            const hashedUsers = [];
            for (const u of users) {
                const hashedPassword = await bcrypt.hash(u.password, 10);
                hashedUsers.push({
                    name: u.name,
                    email: u.email,
                    password: hashedPassword,
                    role: u.role || "STUDENT"
                });
            }

            await User.insertMany(hashedUsers);

            return res.status(201).json({
                message: "Students uploaded successfully",
                count: hashedUsers.length
            });
        }

        /* ================= SINGLE REGISTER ================= */
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "STUDENT"
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({
            message: "Internal server error",
            
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // 2. Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        // 3. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        //4. generate token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "7d"
            }
        );

        //5. response
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};
