
import express from "express"

import bcrypt from "bcrypt"

import jwt from "jsonwebtoken"


import passport from "passport";

import pool from "../db.js";

import dotenv from "dotenv";
dotenv.config();


const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.post("/login", async (req, res) => {
    console.log("✅ LOGIN API HIT");
    console.log("📦 BODY:", req.body);

    res.status(200).json({
        success: true,
        message: "Login API reached",
    });
});

console.log('AUTH ROUTES LOADED');

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user.id, name: req.user.name },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.redirect(
            `http://localhost:3000/oauth-success?token=${token}`
        );
    }
);

router.get("/debug-db", async (req, res) => {
    const db = await pool.query("SELECT current_database()");
    const users = await pool.query("SELECT * FROM users");
    console.log(users)
    res.json({
        database: db.rows,
        users: users.rows,
    });
});



// router.post('/login', async (req, res) => {
//     console.log("Login request received", req.body);
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({ message: 'Email and password required' });
//         }

//         console.log("User found:", email);
//         // 1️⃣ Get user by email
//         const result = await pool.query(
//             'SELECT id, name, email, password, role FROM users WHERE email = $1',
//             [email]
//         );

//         console.log("query executed", result.rows)

//         if (result.rows.length === 0) {
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }

//         const user = result.rows[0];

//         console.log("user data", user)
//         // 2️⃣ Compare password
//         const isMatch = await bcrypt.compare(password, user.password);
//         console.log(isMatch)
//         if (!isMatch) {
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }

//         // 3️⃣ Generate JWT
//         const token = jwt.sign(
//             {
//                 id: user.id,
//                 email: user.email,
//                 role: user.role
//             },
//             process.env.JWT_SECRET,
//             { expiresIn: '1d' }
//         );

//         // 4️⃣ Send response (NEVER send password)
//         res.json({
//             message: 'Login successful',
//             success: true,
//             token,
//             user: {
//                 id: user.id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role
//             }
//         });

//     } catch (err) {
//         console.error('LOGIN ERROR:', err);
//         res.status(500).json({ message: 'Server error' });
//     }
// });


//module.exports = router;
export default router;
