
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import pool from "./db.js";
import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import passportConfig from "./config/passport.js";

import authRoutes from "./routes/auth.js";
import session from "express-session";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/auth", authRoutes);
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passportConfig.initialize());
app.use(passportConfig.session());
//console.log("Google strategy loaded");




// ✅ SIGNUP API
app.post("/api/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ success: false, message: "Missing fields" });
        }

        if (!["admin", "user"].includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }

        const cleanEmail = email.trim().toLowerCase();

        // ✅ Check email
        const checkUser = await pool.query(
            "SELECT id FROM users WHERE LOWER(TRIM(email)) = $1",
            [cleanEmail]
        );

        if (checkUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            });
        }

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Insert
        const result = await pool.query(
            `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
            [name, cleanEmail, hashedPassword, role]
        );

        const user = result.rows[0];

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // ✅ SINGLE response
        return res.status(201).json({
            success: true,
            message: "Signup successful",
            user,
            token,
        });

    } catch (err) {
        console.error("🔥 SIGNUP ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});
// Login API


//coupon saving
app.post('/api/coupons', async (req, res) => {
    console.log(req.body)
    const { couponCode, createdBy } = req.body;

    if (!couponCode) {
        return res.status(400).json({ message: 'Coupon code is required' });
    }

    try {
        const result = await pool.query(
            `
      INSERT INTO coupons (code, status, created_by)
      VALUES ($1, 'ACTIVE', $2)
      RETURNING *
      `,
            [couponCode, createdBy]
        );

        res.status(201).json({
            message: 'Coupon saved successfully',
            coupon: result.rows[0],
        });

    } catch (error) {
        // Duplicate coupon
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Coupon already exists' });
        }

        console.error(error);
        res.status(500).json({ message: 'Database error' });
    }
});
//fetching coupon codes

app.get("/api/coupons", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT code, status, created_at, used_at
       FROM coupons
       ORDER BY created_at DESC`
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch coupons" });
    }
});

app.post("/api/coupons/validate", async (req, res) => {
    //console.log(req.body)

    try {
        const { couponCode } = req.body;

        if (!couponCode) {
            return res.status(400).json({ message: "Coupon code required" });
        }

        const result = await pool.query(
            `SELECT * FROM coupons WHERE code = $1`,
            [couponCode]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Invalid coupon code" });
        }

        const coupon = result.rows[0];
        console.log(coupon)
        if (coupon.status !== "ACTIVE") {
            console.log(coupon.status)
            return res.status(400).json({ message: "Coupon already used" });
        }

        // Mark coupon as USED
        await pool.query(
            `UPDATE coupons
           SET status='USED', used_at=NOW()
           WHERE code=$1`,
            [couponCode]
        );
        //console.log(coupon)
        res.json({ message: "Coupon is valid and applied successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Validation failed" });
    }
});
app.get('/_health', (req, res) => {
    res.send('OK');
});
app.listen(5001, () => {
    console.log("Server running on port 5001");
});